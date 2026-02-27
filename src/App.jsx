import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import Navigation, { TABS } from './components/Navigation';
import LevelUpModal from './components/LevelUpModal';
import { useExpToast, ExpToastContainer } from './components/ExpToast';

import TodayView from './views/TodayView';
import FlowView from './views/FlowView';
import LogView from './views/LogView';

import { useGameState } from './hooks/useGameState';

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.TODAY);
  const [levelUpInfo, setLevelUpInfo] = useState(null); // { level }
  const { toasts, showToast } = useExpToast();

  const {
    state,
    todayHabits,
    activeTasks,
    maxExp,
    completeHabit,
    completeTask,
    addTask,
    addHabit,
    toggleTaskStatus,
    deleteTask,
    deleteHabit,
  } = useGameState();

  // 습관 완료 처리
  const handleCompleteHabit = useCallback((habitId) => {
    const { levelUp, newLevel, expGained } = completeHabit(habitId) || {};
    // completeHabit returns result from addExp
    showToast(15, '습관 완료!');
    if (levelUp) {
      setTimeout(() => setLevelUpInfo({ level: newLevel }), 400);
    }
  }, [completeHabit, showToast]);

  // 태스크 완료 처리
  const handleCompleteTask = useCallback((taskId) => {
    const result = completeTask(taskId);
    if (!result) return;
    const { levelUp, newLevel, expGained, isFullComplete } = result;
    showToast(expGained, isFullComplete ? '퀘스트 완료!' : '단계 완료!');
    if (levelUp) {
      setTimeout(() => setLevelUpInfo({ level: newLevel }), 400);
    }
  }, [completeTask, showToast]);

  return (
    <div className="flex justify-center items-start min-h-screen bg-pixel-dark">
      {/* 앱 컨테이너 */}
      <div className="relative flex flex-col w-full max-w-md min-h-screen bg-[#F0EAD6] border-x-4 border-black overflow-hidden">

        {/* 헤더 */}
        <Header level={state.level} exp={state.exp} maxExp={maxExp} />

        {/* 메인 컨텐츠 */}
        <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
          <AnimatePresence mode="wait">
            {activeTab === TABS.TODAY && (
              <TodayView
                key="today"
                todayHabits={todayHabits}
                activeTasks={activeTasks}
                onCompleteHabit={handleCompleteHabit}
                onCompleteTask={handleCompleteTask}
              />
            )}
            {activeTab === TABS.FLOW && (
              <FlowView
                key="flow"
                habits={state.habits}
                tasks={state.tasks}
                onAddTask={addTask}
                onAddHabit={addHabit}
                onToggleTask={toggleTaskStatus}
                onDeleteTask={deleteTask}
                onDeleteHabit={deleteHabit}
              />
            )}
            {activeTab === TABS.LOG && (
              <LogView
                key="log"
                logs={state.logs}
              />
            )}
          </AnimatePresence>
        </main>

        {/* 하단 네비게이션 */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* EXP 획득 토스트 */}
        <ExpToastContainer toasts={toasts} />

        {/* 레벨업 모달 */}
        <AnimatePresence>
          {levelUpInfo && (
            <LevelUpModal
              level={levelUpInfo.level}
              onClose={() => setLevelUpInfo(null)}
            />
          )}
        </AnimatePresence>

        {/* 미루호샵 워터마크 */}
        <div className="fixed bottom-[68px] right-0 max-w-md w-full pointer-events-none">
          <div className="text-right pr-2 pb-1">
            <span className="text-[8px] font-black text-black/20 tracking-widest">
              MERUHOSHOP #3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
