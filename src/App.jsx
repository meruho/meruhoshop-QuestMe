import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Header from './components/Header';
import Navigation, { TABS } from './components/Navigation';
import LevelUpModal from './components/LevelUpModal';
import { useExpToast, ExpToastContainer } from './components/ExpToast';

import TodayView from './views/TodayView';
import FlowView from './views/FlowView';
import LogView from './views/LogView';
import AuthView from './views/AuthView';

import { useAuth } from './hooks/useAuth';
import { useGameState } from './hooks/useGameState';

// 픽셀 로딩 스피너
function LoadingScreen() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-pixel-dark">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-8 h-8 bg-exp-yellow border-2 border-black"
          animate={{ rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <span className="text-[10px] font-black text-white tracking-widest">LOADING...</span>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState(TABS.TODAY);
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  const { toasts, showToast } = useExpToast();

  const {
    state,
    isLoading: dataLoading,
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
  } = useGameState(user?.id);

  // 습관 완료
  const handleCompleteHabit = useCallback(async (habitId) => {
    showToast(15, '습관 완료!');
    const result = await completeHabit(habitId);
    if (result?.levelUp) {
      setTimeout(() => setLevelUpInfo({ level: result.newLevel }), 400);
    }
  }, [completeHabit, showToast]);

  // 태스크 완료
  const handleCompleteTask = useCallback(async (taskId) => {
    const result = await completeTask(taskId);
    if (!result) return;
    showToast(result.expGained, result.isFullComplete ? '퀘스트 완료!' : '단계 완료!');
    if (result.levelUp) {
      setTimeout(() => setLevelUpInfo({ level: result.newLevel }), 400);
    }
  }, [completeTask, showToast]);

  // 인증 로딩 중
  if (authLoading) return <LoadingScreen />;

  // 미로그인 → 로그인 화면
  if (!user) return <AuthView onSignIn={signInWithGoogle} />;

  // 데이터 로딩 중
  if (dataLoading) return <LoadingScreen />;

  return (
    <div className="flex justify-center items-start min-h-screen bg-pixel-dark">
      <div className="relative flex flex-col w-full max-w-md min-h-screen bg-[#F0EAD6] border-x-4 border-black overflow-hidden">

        {/* 헤더 */}
        <Header
          level={state.level}
          exp={state.exp}
          maxExp={maxExp}
          user={user}
          onSignOut={signOut}
        />

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
              <LogView key="log" logs={state.logs} />
            )}
          </AnimatePresence>
        </main>

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <ExpToastContainer toasts={toasts} />

        <AnimatePresence>
          {levelUpInfo && (
            <LevelUpModal
              level={levelUpInfo.level}
              onClose={() => setLevelUpInfo(null)}
            />
          )}
        </AnimatePresence>

        <div className="fixed bottom-[68px] right-0 max-w-md w-full pointer-events-none">
          <div className="text-right pr-2 pb-1">
            <span className="text-[8px] font-black text-black/20 tracking-widest">MERUHOSHOP #3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
