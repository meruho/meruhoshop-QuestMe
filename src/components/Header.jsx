import { motion } from 'framer-motion';

// 미루 캐릭터 (픽셀 아트 SVG) v1.1
const MiruPixel = () => (
  <svg width="32" height="32" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
    {/* 머리 */}
    <rect x="2" y="0" width="4" height="4" fill="#FFD6A5"/>
    {/* 눈 */}
    <rect x="3" y="1" width="1" height="1" fill="#1A1A2E"/>
    <rect x="5" y="1" width="1" height="1" fill="#1A1A2E"/>
    {/* 입 */}
    <rect x="3" y="3" width="2" height="1" fill="#E74C3C"/>
    {/* 몸 */}
    <rect x="2" y="4" width="4" height="3" fill="#3498DB"/>
    {/* 팔 */}
    <rect x="1" y="4" width="1" height="2" fill="#3498DB"/>
    <rect x="6" y="4" width="1" height="2" fill="#3498DB"/>
    {/* 다리 */}
    <rect x="2" y="7" width="1" height="1" fill="#1A1A2E"/>
    <rect x="5" y="7" width="1" height="1" fill="#1A1A2E"/>
  </svg>
);

export default function Header({ level, exp, maxExp }) {
  const expPercent = Math.min((exp / maxExp) * 100, 100);

  return (
    <header className="bg-[#FFFDF5] border-b-4 border-black px-4 pt-6 pb-3">
      {/* 상단 로고 + 캐릭터 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MiruPixel />
          </motion.div>
          <div>
            <div className="text-[10px] font-black text-gray-400 tracking-widest">MERUHOSHOP</div>
            <div className="text-sm font-black text-pixel-dark tracking-tight leading-none">
              QUEST MASTER
            </div>
          </div>
        </div>

        {/* 레벨 뱃지 */}
        <div className="flex flex-col items-end gap-1">
          <div className="bg-pixel-dark text-exp-yellow border-2 border-black px-2 py-0.5 text-xs font-black shadow-[2px_2px_0px_0px_#F1C40F]">
            ⚔️ LV.{level}
          </div>
          <div className="text-[10px] font-black text-gray-400">
            EXP {exp} / {maxExp}
          </div>
        </div>
      </div>

      {/* EXP 바 */}
      <div className="w-full h-5 bg-gray-200 border-2 border-black relative overflow-hidden">
        <motion.div
          className="h-full"
          style={{
            background: 'linear-gradient(90deg, #F1C40F 0%, #E67E22 100%)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${expPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        {/* EXP 바 패턴 (픽셀 느낌) */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.3) 8px, rgba(0,0,0,0.3) 9px)',
          }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-black mix-blend-multiply">
          {Math.floor(expPercent)}%
        </span>
      </div>
    </header>
  );
}
