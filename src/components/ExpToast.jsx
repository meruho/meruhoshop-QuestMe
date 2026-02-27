import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

// EXP 획득 토스트 알림
export function useExpToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((exp, message = '') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, exp, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 1800);
  }, []);

  return { toasts, showToast };
}

export function ExpToastContainer({ toasts }) {
  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="bg-exp-yellow border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-1.5 text-xs font-black text-black"
          >
            ⚡ +{toast.exp} EXP {toast.message && `• ${toast.message}`}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
