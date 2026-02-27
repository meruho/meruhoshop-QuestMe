import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Download } from 'lucide-react';

const MiruPixel = () => (
  <svg width="32" height="32" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
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

export default function Header({ level, exp, maxExp, user, onSignOut, isInstallable, onInstall }) {
  const expPercent = Math.min((exp / maxExp) * 100, 100);
  const [showMenu, setShowMenu] = useState(false);

  // 유저 아바타: 구글 프로필 사진 or 이니셜
  const avatarUrl = user?.user_metadata?.avatar_url;
  const displayName = user?.user_metadata?.full_name || user?.email || '유저';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-[#FFFDF5] border-b-4 border-black px-4 pt-6 pb-3">
      <div className="flex items-center justify-between mb-2">
        {/* 로고 + 캐릭터 */}
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

        {/* 우측: 레벨 + 유저 아바타 */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end gap-1">
            <div className="bg-pixel-dark text-exp-yellow border-2 border-black px-2 py-0.5 text-xs font-black shadow-[2px_2px_0px_0px_#F1C40F]">
              ⚔️ LV.{level}
            </div>
            <div className="text-[10px] font-black text-gray-400">
              EXP {exp} / {maxExp}
            </div>
          </div>

          {/* 유저 아바타 버튼 */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(v => !v)}
                className="w-9 h-9 border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_#000] shrink-0"
              >
                {avatarUrl
                  ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-miru-blue flex items-center justify-center text-white text-xs font-black">{initial}</div>
                }
              </button>

              {/* 드롭다운 */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 top-11 z-50 bg-[#FFFDF5] border-2 border-black shadow-[4px_4px_0px_0px_#000] min-w-[140px]"
                  >
                    <div className="px-3 py-2 border-b-2 border-black">
                      <p className="text-[10px] font-black text-gray-400">로그인 중</p>
                      <p className="text-xs font-black text-pixel-dark truncate max-w-[120px]">{displayName}</p>
                    </div>
                    {isInstallable && (
                      <button
                        onClick={() => { setShowMenu(false); onInstall(); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-black text-miru-blue hover:bg-blue-50 transition-colors border-b-2 border-black"
                      >
                        <Download size={12} />
                        앱 설치
                      </button>
                    )}
                    <button
                      onClick={() => { setShowMenu(false); onSignOut(); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-black text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={12} />
                      로그아웃
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* EXP 바 */}
      <div className="w-full h-5 bg-gray-200 border-2 border-black relative overflow-hidden">
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg, #F1C40F 0%, #E67E22 100%)' }}
          initial={{ width: 0 }}
          animate={{ width: `${expPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.3) 8px, rgba(0,0,0,0.3) 9px)' }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-black mix-blend-multiply">
          {Math.floor(expPercent)}%
        </span>
      </div>
    </header>
  );
}
