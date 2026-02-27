import { motion } from 'framer-motion';
import { useMemo } from 'react';

// 날짜 포맷팅
function formatDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
}
function formatTime(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

// 오늘/어제/날짜 레이블
function dateLabel(isoStr) {
  const d = new Date(isoStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const ds = d.toDateString();
  if (ds === today.toDateString()) return '오늘';
  if (ds === yesterday.toDateString()) return '어제';
  return formatDate(isoStr);
}

// 타입별 스타일
const TYPE_STYLES = {
  habit:        { bg: 'bg-exp-yellow',    text: '🔥 습관',      exp: 15, dot: '#F1C40F' },
  task:         { bg: 'bg-miru-blue',     text: '⭐ 태스크',    exp: 25, dot: '#3498DB' },
  project:      { bg: 'bg-red-400',       text: '🗺️ 프로젝트',  exp: 40, dot: '#E74C3C' },
  project_step: { bg: 'bg-gray-400',      text: '▶ 단계',       exp: 10, dot: '#999' },
};

// 주간 통계 계산
function calcWeeklyStats(logs) {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 6);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekAgo);
    d.setDate(weekAgo.getDate() + i);
    return d.toDateString();
  });

  const countsByDay = {};
  days.forEach(d => { countsByDay[d] = 0; });

  let totalExp = 0;
  let totalCount = 0;

  logs.forEach(log => {
    const ds = new Date(log.completedAt).toDateString();
    if (countsByDay[ds] !== undefined) {
      countsByDay[ds]++;
      totalCount++;
      totalExp += log.expGained || 0;
    }
  });

  const maxCount = Math.max(1, ...Object.values(countsByDay));
  return { countsByDay, days, maxCount, totalExp, totalCount };
}

// 주간 바 차트
function WeeklyChart({ logs }) {
  const { countsByDay, days, maxCount, totalExp, totalCount } = useMemo(() => calcWeeklyStats(logs), [logs]);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="bg-[#FFFDF5] border-4 border-black shadow-[4px_4px_0px_0px_#2ECC71] p-4 mb-5">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-black bg-quokka-green text-white border-2 border-black px-2 py-0.5">
          📊 주간 기록
        </span>
        <div className="text-right">
          <div className="text-[10px] font-black text-gray-500">총 {totalCount}개 완료</div>
          <div className="text-[10px] font-black text-exp-orange">+{totalExp} EXP</div>
        </div>
      </div>

      {/* 바 차트 */}
      <div className="flex items-end gap-1 h-16">
        {days.map((ds, i) => {
          const count = countsByDay[ds] || 0;
          const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
          const isToday = ds === new Date().toDateString();
          const dayIdx = new Date(ds).getDay();

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              {count > 0 && (
                <span className="text-[8px] font-black text-gray-500">{count}</span>
              )}
              <div className="w-full border border-black relative overflow-hidden" style={{ height: '44px' }}>
                <motion.div
                  className={`absolute bottom-0 w-full ${isToday ? 'bg-quokka-green' : 'bg-miru-blue'}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              </div>
              <span className={`text-[9px] font-black ${isToday ? 'text-quokka-green' : 'text-gray-500'}`}>
                {dayNames[dayIdx]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LogView({ logs }) {
  // 날짜별 그룹
  const grouped = useMemo(() => {
    const groups = {};
    logs.forEach(log => {
      const label = dateLabel(log.completedAt);
      if (!groups[label]) groups[label] = [];
      groups[label].push(log);
    });
    return Object.entries(groups);
  }, [logs]);

  return (
    <motion.div
      key="log"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="pb-6"
    >
      {/* 주간 통계 */}
      <WeeklyChart logs={logs} />

      {/* 완료 기록 타임라인 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-black bg-black text-white px-2 py-0.5">📜 완료 기록</span>
        <span className="text-[10px] text-gray-400 font-bold">총 {logs.length}개</span>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-20 opacity-30">
          <div className="text-4xl mb-3">🏔️</div>
          <p className="text-xs font-black text-gray-500">
            아직 기록된 역사가 없습니다.<br />
            퀘스트를 완료해서 역사를 쌓아보세요!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([dateLabel, dayLogs]) => (
            <div key={dateLabel}>
              {/* 날짜 구분 */}
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-black" />
                <span className="text-[10px] font-black bg-pixel-dark text-white px-2 py-0.5">
                  {dateLabel}
                </span>
                <div className="h-px flex-1 bg-black" />
              </div>

              {/* 타임라인 */}
              <div className="ml-3 border-l-4 border-black pl-4 space-y-3">
                {dayLogs.map((log, idx) => {
                  const style = TYPE_STYLES[log.type] || TYPE_STYLES.task;
                  return (
                    <motion.div
                      key={log.id || idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-[#FFFDF5] border-2 border-black p-3 relative shadow-[2px_2px_0px_0px_#000]"
                    >
                      {/* 타임라인 점 */}
                      <div
                        className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-black"
                        style={{ backgroundColor: style.dot }}
                      />

                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`text-[9px] font-black ${style.bg} text-black border border-black px-1`}>
                              {style.text}
                            </span>
                          </div>
                          <p className="text-xs font-black text-pixel-dark truncate">{log.title}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[9px] text-gray-400 font-bold">{formatTime(log.completedAt)}</div>
                          <div className="text-[10px] font-black text-exp-orange">+{log.expGained} EXP</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
