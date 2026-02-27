import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Zap, ChevronRight, Star, Flame } from 'lucide-react';
import { getDayIndex } from '../hooks/useGameState';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
const today = new Date();

function HabitItem({ habit, onComplete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-[#FFFDF5] border-4 border-black shadow-[4px_4px_0px_0px_#F1C40F] flex items-center gap-3 p-3 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#F1C40F] transition-all"
      onClick={onComplete}
    >
      {/* 아이콘 박스 */}
      <div className="w-10 h-10 border-2 border-black bg-yellow-50 flex items-center justify-center shrink-0">
        <Flame size={18} className="text-exp-orange" />
      </div>

      <div className="flex-1">
        <p className="font-black text-sm text-pixel-dark">{habit.title}</p>
        {/* 요일 뱃지 */}
        <div className="flex gap-0.5 mt-1">
          {DAY_NAMES.map((d, i) => (
            <span
              key={i}
              className={`text-[8px] font-black w-4 h-4 flex items-center justify-center border border-black
                ${habit.days.includes(i) ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-400'}`}
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <CheckCircle2 size={24} className="text-gray-200 hover:text-quokka-green transition-colors" />
        <span className="text-[9px] font-black text-yellow-500">+15 EXP</span>
      </div>
    </motion.div>
  );
}

function TaskItem({ task, onComplete }) {
  const isProject = task.type === 'project';
  const currentStepName = isProject ? task.steps[task.currentStep] : null;
  const progress = isProject ? `${task.currentStep + 1}/${task.steps.length}` : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-[#FFFDF5] border-4 border-black shadow-[4px_4px_0px_0px_#999] flex items-center gap-3 p-3 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#999] transition-all"
      onClick={onComplete}
    >
      {/* 아이콘 박스 */}
      <div className="w-10 h-10 border-2 border-black bg-blue-50 flex items-center justify-center shrink-0">
        {isProject
          ? <ChevronRight size={18} className="text-miru-blue" />
          : <Star size={18} className="text-miru-blue" />
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-black text-sm text-pixel-dark truncate">{task.title}</p>
        {isProject && currentStepName && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[9px] font-black bg-miru-blue text-white px-1 border border-black">
              ▶ NEXT
            </span>
            <span className="text-[10px] font-bold text-miru-blue truncate">
              {currentStepName}
            </span>
            <span className="text-[9px] text-gray-400 shrink-0">{progress}</span>
          </div>
        )}
        {/* 프로젝트 진행 바 */}
        {isProject && (
          <div className="w-full h-1.5 bg-gray-200 border border-black mt-1.5">
            <div
              className="h-full bg-miru-blue"
              style={{ width: `${(task.currentStep / task.steps.length) * 100}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-1 shrink-0">
        <CheckCircle2 size={24} className="text-gray-200 hover:text-quokka-green transition-colors" />
        <span className="text-[9px] font-black text-miru-blue">
          +{isProject ? (task.currentStep >= task.steps.length - 1 ? '40' : '10') : '25'} EXP
        </span>
      </div>
    </motion.div>
  );
}

// 빈 상태
function EmptyQuest({ message }) {
  return (
    <div className="text-center py-8 opacity-40">
      <div className="text-3xl mb-2">🏖️</div>
      <p className="text-xs font-black text-gray-500">{message}</p>
    </div>
  );
}

export default function TodayView({ todayHabits, activeTasks, onCompleteHabit, onCompleteTask }) {
  const dateStr = today.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });

  return (
    <motion.div
      key="today"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.15 }}
      className="space-y-5 pb-6"
    >
      {/* 날짜 헤더 */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-black" />
        <span className="text-[10px] font-black text-gray-500 tracking-widest">{dateStr}</span>
        <div className="h-px flex-1 bg-black" />
      </div>

      {/* 습관 섹션 */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-black bg-exp-yellow text-black border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]">
            🔥 오늘의 습관
          </span>
          <span className="text-[10px] text-gray-400 font-bold">
            {todayHabits.length}개 남음
          </span>
        </div>
        <AnimatePresence mode="popLayout">
          {todayHabits.length > 0
            ? todayHabits.map(h => (
                <div key={h.id} className="mb-2">
                  <HabitItem habit={h} onComplete={() => onCompleteHabit(h.id)} />
                </div>
              ))
            : <EmptyQuest message="오늘 습관 퀘스트를 모두 완료했어요! 🎉" />
          }
        </AnimatePresence>
      </section>

      {/* 활성 퀘스트 섹션 */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-black bg-miru-blue text-white border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]">
            ⚔️ 활성 퀘스트
          </span>
          <span className="text-[10px] text-gray-400 font-bold">
            {activeTasks.length}개
          </span>
        </div>
        <AnimatePresence mode="popLayout">
          {activeTasks.length > 0
            ? activeTasks.map(t => (
                <div key={t.id} className="mb-2">
                  <TaskItem task={t} onComplete={() => onCompleteTask(t.id)} />
                </div>
              ))
            : <EmptyQuest message="활성 퀘스트가 없어요. FLOW에서 퀘스트를 시작하세요!" />
          }
        </AnimatePresence>
      </section>
    </motion.div>
  );
}
