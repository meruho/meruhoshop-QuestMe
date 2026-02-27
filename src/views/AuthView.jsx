import { motion } from 'framer-motion';

const MiruBig = () => (
  <svg width="72" height="72" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
    <rect x="2" y="0" width="4" height="4" fill="#FFD6A5"/>
    <rect x="3" y="1" width="1" height="1" fill="#1A1A2E"/>
    <rect x="5" y="1" width="1" height="1" fill="#1A1A2E"/>
    <rect x="3" y="3" width="2" height="1" fill="#E74C3C"/>
    <rect x="2" y="4" width="4" height="3" fill="#3498DB"/>
    <rect x="1" y="4" width="1" height="2" fill="#3498DB"/>
    <rect x="6" y="4" width="1" height="2" fill="#3498DB"/>
    <rect x="2" y="7" width="1" height="1" fill="#1A1A2E"/>
    <rect x="5" y="7" width="1" height="1" fill="#1A1A2E"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function AuthView({ onSignIn }) {
  return (
    <div className="flex justify-center items-start min-h-screen bg-pixel-dark">
      <div className="flex flex-col items-center justify-center w-full max-w-md min-h-screen bg-[#F0EAD6] border-x-4 border-black px-6">

        {/* 로고 */}
        <div className="text-center mb-2">
          <p className="text-[10px] font-black text-gray-400 tracking-[0.3em]">MERUHOSHOP</p>
          <h1 className="text-2xl font-black text-pixel-dark tracking-tight">QUEST MASTER</h1>
        </div>

        {/* 미루 캐릭터 */}
        <motion.div
          className="my-6"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <MiruBig />
        </motion.div>

        {/* 픽셀 카드 */}
        <div className="w-full bg-[#FFFDF5] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-6 text-center">
          <p className="text-xs font-black text-pixel-dark mb-1">⚔️ 인생을 레벨업하세요</p>
          <p className="text-[10px] text-gray-500 font-bold mb-6">
            습관을 쌓고, 퀘스트를 클리어하고<br/>나만의 캐릭터를 성장시키세요.
          </p>

          {/* 구글 로그인 버튼 */}
          <button
            onClick={onSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border-4 border-black py-3 font-black text-sm shadow-[4px_4px_0px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
          >
            <GoogleIcon />
            Google로 시작하기
          </button>
        </div>

        {/* 하단 태그 */}
        <div className="mt-6 flex gap-2">
          {['#3', 'meruhoshop', '야무진투두'].map(tag => (
            <span key={tag} className="text-[9px] font-black bg-black text-white px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}
