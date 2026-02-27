import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

// 미루 캐릭터 픽셀 아트 (레벨업 버전 - 더 크게)
const MiruBig = () => (
  <svg width="80" height="80" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
    <rect x="2" y="0" width="4" height="4" fill="#FFD6A5"/>
    <rect x="3" y="1" width="1" height="1" fill="#1A1A2E"/>
    <rect x="5" y="1" width="1" height="1" fill="#1A1A2E"/>
    {/* 웃는 입 */}
    <rect x="3" y="3" width="1" height="1" fill="#E74C3C"/>
    <rect x="4" y="2" width="1" height="1" fill="#E74C3C"/>
    <rect x="4" y="3" width="1" height="1" fill="#E74C3C"/>
    <rect x="3" y="2" width="1" height="1" fill="#E74C3C"/>
    <rect x="2" y="4" width="4" height="3" fill="#F1C40F"/>
    <rect x="1" y="4" width="1" height="2" fill="#F1C40F"/>
    <rect x="6" y="4" width="1" height="2" fill="#F1C40F"/>
    {/* 팔을 들고 있는 포즈 */}
    <rect x="0" y="3" width="1" height="1" fill="#F1C40F"/>
    <rect x="7" y="3" width="1" height="1" fill="#F1C40F"/>
    <rect x="2" y="7" width="1" height="1" fill="#1A1A2E"/>
    <rect x="5" y="7" width="1" height="1" fill="#1A1A2E"/>
  </svg>
);

// 파티클 스파클
const Sparkle = ({ x, y, delay }) => (
  <motion.div
    className="absolute text-base pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ opacity: 1, scale: 1, y: 0 }}
    animate={{ opacity: 0, scale: 0, y: -40 }}
    transition={{ duration: 0.8, delay }}
  >
    ✨
  </motion.div>
);

const MIRU_COMMENTS = [
  "야무지게 레벨업했네요!",
  "이 기세면 다음 레벨도 금방이에요!",
  "오오... 제법인데요?",
  "미루지 말고 계속 야무지게!",
  "레벨업 축하드립니다! 이제 더 어려운 퀘스트를 받을 수 있어요.",
];

export default function LevelUpModal({ level, onClose }) {
  const comment = MIRU_COMMENTS[(level - 1) % MIRU_COMMENTS.length];

  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    x: 10 + (i * 12),
    y: 10 + (i % 3) * 20,
    delay: i * 0.1,
  }));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative bg-[#FFFDF5] border-4 border-black shadow-[8px_8px_0px_0px_#F1C40F] p-6 mx-6 text-center max-w-xs w-full"
          initial={{ scale: 0.3, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* 스파클 파티클 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {sparkles.map((s, i) => (
              <Sparkle key={i} {...s} />
            ))}
          </div>

          {/* 레벨업 헤더 */}
          <div className="bg-pixel-dark border-2 border-black text-exp-yellow font-black text-xs tracking-widest px-3 py-1 inline-block mb-4">
            🎉 LEVEL UP!
          </div>

          {/* 미루 캐릭터 */}
          <motion.div
            className="flex justify-center mb-3"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <MiruBig />
          </motion.div>

          {/* 레벨 표시 */}
          <motion.div
            className="text-4xl font-black text-pixel-dark mb-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            LV.<span className="text-exp-yellow">{level}</span>
          </motion.div>

          {/* 미루 코멘트 */}
          <div className="bg-gray-100 border-2 border-black p-2 mt-3 text-xs font-bold text-left relative">
            <span className="absolute -top-2 left-3 bg-[#FFFDF5] border border-black text-[9px] px-1 font-black text-gray-500">
              미루 점장
            </span>
            {comment}
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full bg-exp-yellow border-2 border-black py-2 text-xs font-black shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
          >
            계속하기 ▶
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
