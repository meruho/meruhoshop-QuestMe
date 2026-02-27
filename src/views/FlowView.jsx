import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Play, Pause, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';

// 요일 선택기
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

function DaySelector({ selected, onChange }) {
  return (
    <div className="flex gap-1">
      {DAY_NAMES.map((d, i) => (
        <button
          key={i}
          type="button"
          onClick={() => {
            const next = selected.includes(i)
              ? selected.filter(x => x !== i)
              : [...selected, i];
            onChange(next);
          }}
          className={`w-7 h-7 text-[10px] font-black border-2 border-black transition-all
            ${selected.includes(i)
              ? 'bg-exp-yellow text-black shadow-[1px_1px_0px_0px_#000]'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
        >
          {d}
        </button>
      ))}
    </div>
  );
}

// 퀘스트 추가 폼
function AddQuestForm({ onAdd, onCancel }) {
  const [type, setType] = useState('task'); // 'habit' | 'task' | 'project'
  const [title, setTitle] = useState('');
  const [days, setDays] = useState([1, 2, 3, 4, 5]);
  const [steps, setSteps] = useState(['']);

  const handleSubmit = () => {
    if (!title.trim()) return;
    if (type === 'habit') {
      onAdd({ type: 'habit', title: title.trim(), days });
    } else if (type === 'project') {
      const filteredSteps = steps.filter(s => s.trim());
      if (filteredSteps.length === 0) return;
      onAdd({ type: 'project', title: title.trim(), steps: filteredSteps, status: 'paused' });
    } else {
      onAdd({ type: 'task', title: title.trim(), status: 'paused' });
    }
    onCancel();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[#FFFDF5] border-4 border-black shadow-[4px_4px_0px_0px_#3498DB] p-4 mb-4"
    >
      {/* 타입 선택 */}
      <div className="flex gap-1 mb-3">
        {[
          { key: 'habit', label: '🔥 습관', color: '#F1C40F' },
          { key: 'task',  label: '⭐ 태스크', color: '#3498DB' },
          { key: 'project', label: '🗺️ 프로젝트', color: '#E74C3C' },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setType(key)}
            className={`flex-1 text-[10px] font-black py-1.5 border-2 border-black transition-all
              ${type === key
                ? 'text-white shadow-[2px_2px_0px_0px_#000]'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            style={type === key ? { backgroundColor: color } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 제목 입력 */}
      <input
        autoFocus
        className="w-full border-2 border-black p-2 mb-2 text-sm font-bold bg-white focus:outline-none focus:border-miru-blue"
        placeholder={type === 'habit' ? '습관 이름 (예: 물 2L 마시기)' : type === 'project' ? '프로젝트명 (예: 세금 신고)' : '할 일 이름...'}
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && type !== 'project' && handleSubmit()}
      />

      {/* 습관: 요일 선택 */}
      {type === 'habit' && (
        <div className="mb-3">
          <label className="text-[10px] font-black text-gray-500 mb-1 block">반복 요일</label>
          <DaySelector selected={days} onChange={setDays} />
        </div>
      )}

      {/* 프로젝트: 단계 입력 */}
      {type === 'project' && (
        <div className="mb-3">
          <label className="text-[10px] font-black text-gray-500 mb-1 block">
            단계 목록 (순서대로 실행됨)
          </label>
          <div className="space-y-1.5">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-1 items-center">
                <span className="text-[10px] font-black w-5 text-center text-gray-400">{i + 1}</span>
                <input
                  className="flex-1 border-2 border-black p-1.5 text-xs font-bold bg-white focus:outline-none focus:border-miru-blue"
                  placeholder={`단계 ${i + 1}`}
                  value={step}
                  onChange={e => {
                    const next = [...steps];
                    next[i] = e.target.value;
                    setSteps(next);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setSteps([...steps, '']);
                    }
                  }}
                />
                {steps.length > 1 && (
                  <button
                    onClick={() => setSteps(steps.filter((_, idx) => idx !== i))}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setSteps([...steps, ''])}
              className="w-full text-[10px] font-black text-miru-blue border-2 border-dashed border-miru-blue py-1 hover:bg-blue-50 transition-colors"
            >
              + 단계 추가
            </button>
          </div>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-pixel-dark text-white border-2 border-black py-2 text-xs font-black shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
        >
          등록 ▶
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 border-2 border-black px-4 text-xs font-bold"
        >
          취소
        </button>
      </div>
    </motion.div>
  );
}

// 퀘스트 카드
function QuestCard({ task, onToggle, onDelete, isHabit = false }) {
  const [showSteps, setShowSteps] = useState(false);
  const isActive = task.status === 'active';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#FFFDF5] border-4 border-black p-3
        ${isActive
          ? 'shadow-[4px_4px_0px_0px_#2ECC71]'
          : 'shadow-[4px_4px_0px_0px_#999] opacity-70'}`}
    >
      <div className="flex items-center gap-2">
        {/* 타입 뱃지 */}
        <span className={`text-[9px] font-black px-1.5 py-0.5 border border-black shrink-0
          ${isHabit ? 'bg-exp-yellow' : task.type === 'project' ? 'bg-red-400 text-white' : 'bg-miru-blue text-white'}`}>
          {isHabit ? '🔥 습관' : task.type === 'project' ? '🗺️ 프로젝트' : '⭐ 태스크'}
        </span>

        {/* 제목 */}
        <p className="font-black text-sm text-pixel-dark flex-1 truncate">{task.title}</p>

        {/* 액션 버튼들 */}
        <div className="flex items-center gap-1 shrink-0">
          {/* 단계 펼치기 (프로젝트만) */}
          {task.type === 'project' && (
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="p-1 text-gray-400 hover:text-pixel-dark"
            >
              {showSteps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}

          {/* 활성/멈춤 토글 (습관은 없음) */}
          {!isHabit && (
            <button
              onClick={onToggle}
              className={`p-2 border-2 border-black shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5
                ${isActive ? 'bg-red-400' : 'bg-quokka-green'}`}
            >
              {isActive ? <Pause size={12} /> : <Play size={12} />}
            </button>
          )}

          {/* 삭제 */}
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* 프로젝트 단계 */}
      <AnimatePresence>
        {task.type === 'project' && showSteps && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 pl-2 border-l-2 border-black space-y-1">
              {task.steps.map((step, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-[11px] font-bold py-0.5
                    ${i < task.current_step ? 'text-gray-300 line-through' : ''}
                    ${i === task.current_step ? 'text-miru-blue' : ''}
                  `}
                >
                  <span className={`w-4 h-4 border border-black flex items-center justify-center text-[9px]
                    ${i < task.current_step ? 'bg-quokka-green text-white' : i === task.current_step ? 'bg-miru-blue text-white' : 'bg-gray-100'}`}
                  >
                    {i < task.current_step ? '✓' : i + 1}
                  </span>
                  {step}
                  {i === task.current_step && <span className="text-[9px] bg-miru-blue text-white px-1">▶ NOW</span>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 상태 안내 */}
      {!isHabit && (
        <div className="mt-2 text-[9px] font-black">
          {isActive
            ? <span className="text-quokka-green">● TODAY에 표시 중</span>
            : <span className="text-gray-400">● 멈춤 (▶ 눌러서 시작)</span>
          }
        </div>
      )}
    </motion.div>
  );
}

export default function FlowView({ habits, tasks, onAddTask, onAddHabit, onToggleTask, onDeleteTask, onDeleteHabit }) {
  const [isAdding, setIsAdding] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'habit' | 'task' | 'project'

  const handleAdd = (data) => {
    if (data.type === 'habit') {
      onAddHabit({ title: data.title, days: data.days });
    } else {
      onAddTask(data);
    }
  };

  const filtered = filterType === 'all'
    ? { habits, tasks }
    : filterType === 'habit'
      ? { habits, tasks: [] }
      : { habits: [], tasks: tasks.filter(t => t.type === filterType) };

  return (
    <motion.div
      key="flow"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15 }}
      className="pb-6"
    >
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-base font-black text-pixel-dark">⚙️ 설계실</h2>
          <p className="text-[10px] text-gray-500 font-bold">퀘스트를 만들고 관리하세요</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`border-2 border-black p-2 shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5
            ${isAdding ? 'bg-gray-200' : 'bg-miru-blue'}`}
        >
          <Plus size={18} className={isAdding ? 'text-gray-600' : 'text-white'} />
        </button>
      </div>

      {/* 추가 폼 */}
      <AnimatePresence>
        {isAdding && (
          <AddQuestForm onAdd={handleAdd} onCancel={() => setIsAdding(false)} />
        )}
      </AnimatePresence>

      {/* 필터 탭 */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {[
          { key: 'all', label: '전체' },
          { key: 'habit', label: '🔥 습관' },
          { key: 'task', label: '⭐ 태스크' },
          { key: 'project', label: '🗺️ 프로젝트' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilterType(key)}
            className={`text-[10px] font-black px-2 py-1 border-2 border-black whitespace-nowrap shrink-0
              ${filterType === key ? 'bg-pixel-dark text-white shadow-[2px_2px_0px_0px_#000]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 퀘스트 목록 */}
      <div className="space-y-3">
        {/* 습관 목록 */}
        {filtered.habits.map(h => (
          <QuestCard
            key={h.id}
            task={{ ...h, type: 'habit', status: 'active' }}
            isHabit
            onToggle={() => {}}
            onDelete={() => onDeleteHabit(h.id)}
          />
        ))}

        {/* 태스크/프로젝트 목록 */}
        {filtered.tasks.map(t => (
          <QuestCard
            key={t.id}
            task={t}
            onToggle={() => onToggleTask(t.id)}
            onDelete={() => onDeleteTask(t.id)}
          />
        ))}

        {filtered.habits.length === 0 && filtered.tasks.length === 0 && (
          <div className="text-center py-16 opacity-30">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-xs font-black text-gray-500">
              퀘스트가 없어요.<br />+ 버튼으로 추가해보세요!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
