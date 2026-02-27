import { useState, useCallback } from 'react';

// LocalStorage 키
const STORAGE_KEY = 'questmaster_state_v1';

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

// 초기 데이터
const defaultState = {
  level: 1,
  exp:   0,
  habits: [
    {
      id: 'h1',
      title: '물 2L 마시기',
      days: [1, 2, 3, 4, 5],   // 평일
      completedDates: [],
    },
    {
      id: 'h2',
      title: '스트레칭 10분',
      days: [0, 1, 2, 3, 4, 5, 6], // 매일
      completedDates: [],
    },
  ],
  tasks: [
    {
      id: 't1',
      title: '세금계산서 발행',
      type: 'project',
      status: 'active',
      steps: ['자료 수집', '사이트 접속', '공인인증서 로그인', '발행 완료'],
      currentStep: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: 't2',
      title: '인스타 게시물 업로드',
      type: 'task',
      status: 'active',
      steps: [],
      currentStep: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: 't3',
      title: '미루호샵 신제품 기획',
      type: 'task',
      status: 'paused',
      steps: [],
      currentStep: 0,
      createdAt: new Date().toISOString(),
    },
  ],
  logs: [],
};

// LocalStorage 로드
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

// LocalStorage 저장
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('LocalStorage 저장 실패:', e);
  }
}

export function useGameState() {
  const [state, setState] = useState(() => loadState());

  // 상태 업데이트 + 자동 저장
  const update = useCallback((updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveState(next);
      return next;
    });
  }, []);

  // EXP 추가 (레벨업 처리 포함)
  const addExp = useCallback((amount) => {
    let levelUp = false;
    let newLevel = null;
    update(prev => {
      let newExp = prev.exp + amount;
      let lv = prev.level;
      const maxExp = lv * 100; // 레벨업 필요 EXP = 레벨 * 100
      if (newExp >= maxExp) {
        lv += 1;
        newExp -= maxExp;
        levelUp = true;
        newLevel = lv;
      }
      return { ...prev, exp: newExp, level: lv };
    });
    return { levelUp, newLevel };
  }, [update]);

  // 습관 체크
  const completeHabit = useCallback((habitId) => {
    const today = todayStr();
    let expGained = EXP_REWARDS.habit;
    update(prev => ({
      ...prev,
      habits: prev.habits.map(h =>
        h.id === habitId
          ? { ...h, completedDates: [...(h.completedDates || []), today] }
          : h
      ),
      logs: [
        {
          id: Date.now(),
          title: prev.habits.find(h => h.id === habitId)?.title || '',
          type: 'habit',
          completedAt: new Date().toISOString(),
          expGained,
        },
        ...prev.logs,
      ],
    }));
    return addExp(expGained);
  }, [update, addExp]);

  // 태스크/프로젝트 완료 or 단계 진행
  const completeTask = useCallback((taskId) => {
    let expGained = 0;
    let isFullComplete = false;
    let result = null;

    update(prev => {
      const task = prev.tasks.find(t => t.id === taskId);
      if (!task) return prev;

      const isProject = task.type === 'project';
      const isLastStep = !isProject || task.currentStep >= task.steps.length - 1;

      if (isProject && !isLastStep) {
        // 단계 진행
        expGained = EXP_REWARDS.project_step;
        isFullComplete = false;
        return {
          ...prev,
          tasks: prev.tasks.map(t =>
            t.id === taskId ? { ...t, currentStep: t.currentStep + 1 } : t
          ),
          logs: [
            {
              id: Date.now(),
              title: `${task.title} - ${task.steps[task.currentStep]} 완료`,
              type: 'project_step',
              completedAt: new Date().toISOString(),
              expGained: EXP_REWARDS.project_step,
            },
            ...prev.logs,
          ],
        };
      } else {
        // 최종 완료
        expGained = isProject ? EXP_REWARDS.project_done : EXP_REWARDS.task;
        isFullComplete = true;
        return {
          ...prev,
          tasks: prev.tasks.filter(t => t.id !== taskId),
          logs: [
            {
              id: Date.now(),
              title: task.title,
              type: task.type,
              completedAt: new Date().toISOString(),
              expGained,
            },
            ...prev.logs,
          ],
        };
      }
    });

    result = addExp(expGained);
    return { ...result, expGained, isFullComplete };
  }, [update, addExp]);

  // 태스크 추가
  const addTask = useCallback((taskData) => {
    const newTask = {
      id: `t${Date.now()}`,
      type: 'task',
      status: 'paused',
      steps: [],
      currentStep: 0,
      createdAt: new Date().toISOString(),
      ...taskData,
    };
    update(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  }, [update]);

  // 습관 추가
  const addHabit = useCallback((habitData) => {
    const newHabit = {
      id: `h${Date.now()}`,
      completedDates: [],
      days: [0, 1, 2, 3, 4, 5, 6],
      ...habitData,
    };
    update(prev => ({ ...prev, habits: [...prev.habits, newHabit] }));
  }, [update]);

  // 태스크 상태 토글 (active ↔ paused)
  const toggleTaskStatus = useCallback((taskId) => {
    update(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === taskId
          ? { ...t, status: t.status === 'active' ? 'paused' : 'active' }
          : t
      ),
    }));
  }, [update]);

  // 태스크 삭제
  const deleteTask = useCallback((taskId) => {
    update(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== taskId) }));
  }, [update]);

  // 습관 삭제
  const deleteHabit = useCallback((habitId) => {
    update(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== habitId) }));
  }, [update]);

  // 태스크 단계 업데이트
  const updateTaskSteps = useCallback((taskId, steps) => {
    update(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === taskId ? { ...t, steps, currentStep: 0 } : t
      ),
    }));
  }, [update]);

  // 오늘 표시할 습관 필터 (요일 일치 + 미완료)
  const todayHabits = state.habits.filter(h => {
    const dayMatch = h.days.includes(getDayIndex());
    const notDoneToday = !(h.completedDates || []).includes(todayStr());
    return dayMatch && notDoneToday;
  });

  // 활성 태스크 필터
  const activeTasks = state.tasks.filter(t => t.status === 'active');

  // 레벨업 EXP 최대값
  const maxExp = state.level * 100;

  return {
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
    updateTaskSteps,
  };
}
