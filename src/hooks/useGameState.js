import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// EXP 보상 상수
export const EXP_REWARDS = {
  habit:        15,
  task:         25,
  project_step: 10,
  project_done: 40,
};

// 오늘 날짜 문자열 (YYYY-MM-DD)
export const todayStr = () => new Date().toISOString().split('T')[0];

// 요일 인덱스 (0=일, 6=토)
export const getDayIndex = () => new Date().getDay();

export function useGameState(userId) {
  const [state, setState] = useState({ level: 1, exp: 0, habits: [], tasks: [], logs: [] });
  const [isLoading, setIsLoading] = useState(true);

  // ── 초기 데이터 로드 ─────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    loadAll();
  }, [userId]);

  async function loadAll() {
    setIsLoading(true);
    try {
      const [profileRes, habitsRes, completionsRes, tasksRes, logsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('habits').select('*').eq('user_id', userId).order('created_at'),
        supabase.from('habit_completions').select('*').eq('user_id', userId),
        supabase.from('tasks').select('*').eq('user_id', userId).order('created_at'),
        supabase.from('logs').select('*').eq('user_id', userId).order('completed_at', { ascending: false }).limit(100),
      ]);

      const profile = profileRes.data || { level: 1, exp: 0 };
      const habits = (habitsRes.data || []).map(h => ({
        ...h,
        completedDates: (completionsRes.data || [])
          .filter(c => c.habit_id === h.id)
          .map(c => c.completed_date),
      }));

      setState({
        level: profile.level,
        exp: profile.exp,
        habits,
        tasks: tasksRes.data || [],
        logs: logsRes.data || [],
      });
    } catch (e) {
      console.error('데이터 로드 실패:', e);
    } finally {
      setIsLoading(false);
    }
  }

  // ── EXP + 레벨 처리 ──────────────────────────────────────
  async function applyExp(currentLevel, currentExp, amount) {
    let newExp = currentExp + amount;
    let newLevel = currentLevel;
    let levelUp = false;

    if (newExp >= newLevel * 100) {
      newExp -= newLevel * 100;
      newLevel += 1;
      levelUp = true;
    }

    await supabase.from('profiles').update({ level: newLevel, exp: newExp }).eq('id', userId);
    setState(prev => ({ ...prev, level: newLevel, exp: newExp }));
    return { levelUp, newLevel };
  }

  // ── 습관 완료 ─────────────────────────────────────────────
  const completeHabit = useCallback(async (habitId) => {
    const today = todayStr();
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;

    await supabase.from('habit_completions').insert({
      habit_id: habitId,
      user_id: userId,
      completed_date: today,
    });

    const logEntry = {
      id: Date.now(),
      user_id: userId,
      title: habit.title,
      type: 'habit',
      completed_at: new Date().toISOString(),
      exp_gained: EXP_REWARDS.habit,
    };
    await supabase.from('logs').insert(logEntry);

    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h =>
        h.id === habitId
          ? { ...h, completedDates: [...(h.completedDates || []), today] }
          : h
      ),
      logs: [logEntry, ...prev.logs],
    }));

    return applyExp(state.level, state.exp, EXP_REWARDS.habit);
  }, [state, userId]);

  // ── 태스크 완료 / 단계 진행 ──────────────────────────────
  const completeTask = useCallback(async (taskId) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const isProject = task.type === 'project';
    const isLastStep = !isProject || task.current_step >= task.steps.length - 1;
    const expGained = isProject
      ? (isLastStep ? EXP_REWARDS.project_done : EXP_REWARDS.project_step)
      : EXP_REWARDS.task;

    if (isProject && !isLastStep) {
      const nextStep = task.current_step + 1;
      await supabase.from('tasks').update({ current_step: nextStep }).eq('id', taskId);

      const logEntry = {
        id: Date.now(),
        user_id: userId,
        title: `${task.title} - ${task.steps[task.current_step]} 완료`,
        type: 'project_step',
        completed_at: new Date().toISOString(),
        exp_gained: expGained,
      };
      await supabase.from('logs').insert(logEntry);

      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? { ...t, current_step: nextStep } : t),
        logs: [logEntry, ...prev.logs],
      }));

      const result = await applyExp(state.level, state.exp, expGained);
      return { ...result, expGained, isFullComplete: false };
    } else {
      await supabase.from('tasks').delete().eq('id', taskId);

      const logEntry = {
        id: Date.now(),
        user_id: userId,
        title: task.title,
        type: task.type,
        completed_at: new Date().toISOString(),
        exp_gained: expGained,
      };
      await supabase.from('logs').insert(logEntry);

      setState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== taskId),
        logs: [logEntry, ...prev.logs],
      }));

      const result = await applyExp(state.level, state.exp, expGained);
      return { ...result, expGained, isFullComplete: true };
    }
  }, [state, userId]);

  // ── 태스크 추가 ───────────────────────────────────────────
  const addTask = useCallback(async (taskData) => {
    const newTask = {
      id: `t${Date.now()}`,
      user_id: userId,
      type: 'task',
      status: 'paused',
      steps: [],
      current_step: 0,
      created_at: new Date().toISOString(),
      ...taskData,
    };
    await supabase.from('tasks').insert(newTask);
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  }, [userId]);

  // ── 습관 추가 ─────────────────────────────────────────────
  const addHabit = useCallback(async (habitData) => {
    const newHabit = {
      id: `h${Date.now()}`,
      user_id: userId,
      days: [0, 1, 2, 3, 4, 5, 6],
      created_at: new Date().toISOString(),
      ...habitData,
    };
    await supabase.from('habits').insert(newHabit);
    setState(prev => ({
      ...prev,
      habits: [...prev.habits, { ...newHabit, completedDates: [] }],
    }));
  }, [userId]);

  // ── 상태 토글 ─────────────────────────────────────────────
  const toggleTaskStatus = useCallback(async (taskId) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    const newStatus = task.status === 'active' ? 'paused' : 'active';
    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t),
    }));
  }, [state.tasks]);

  // ── 삭제 ──────────────────────────────────────────────────
  const deleteTask = useCallback(async (taskId) => {
    await supabase.from('tasks').delete().eq('id', taskId);
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== taskId) }));
  }, []);

  const deleteHabit = useCallback(async (habitId) => {
    await supabase.from('habits').delete().eq('id', habitId);
    setState(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== habitId) }));
  }, []);

  // ── 파생 데이터 ───────────────────────────────────────────
  const todayHabits = state.habits.filter(h => {
    const dayMatch = (h.days || []).includes(getDayIndex());
    const notDoneToday = !(h.completedDates || []).includes(todayStr());
    return dayMatch && notDoneToday;
  });

  const activeTasks = state.tasks.filter(t => t.status === 'active');
  const maxExp = state.level * 100;

  return {
    state, isLoading, todayHabits, activeTasks, maxExp,
    completeHabit, completeTask, addTask, addHabit,
    toggleTaskStatus, deleteTask, deleteHabit,
  };
}
