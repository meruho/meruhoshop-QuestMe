import { Zap, LayoutList, History } from 'lucide-react';

const TABS = { TODAY: 'TODAY', FLOW: 'FLOW', LOG: 'LOG' };

function TabButton({ active, onClick, label, icon, color = '#3498DB' }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-1 w-full h-full
        transition-all duration-100 border-0 outline-none
        ${active
          ? 'bg-[#FFFDF5]'
          : 'bg-[#F0EAD6] opacity-60 hover:opacity-80'
        }
      `}
      style={active ? { borderTop: `4px solid ${color}` } : { borderTop: '4px solid transparent' }}
    >
      <div style={{ color: active ? color : '#666' }}>
        {icon}
      </div>
      <span
        className="text-[9px] font-black tracking-widest"
        style={{ color: active ? color : '#666' }}
      >
        {label}
      </span>
    </button>
  );
}

export default function Navigation({ activeTab, setActiveTab }) {
  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-[#F0EAD6] border-t-4 border-black grid grid-cols-3 h-[68px] z-50">
      <TabButton
        active={activeTab === TABS.TODAY}
        onClick={() => setActiveTab(TABS.TODAY)}
        label="TODAY"
        icon={<Zap size={22} />}
        color="#F1C40F"
      />
      <div className="border-x-2 border-black">
        <TabButton
          active={activeTab === TABS.FLOW}
          onClick={() => setActiveTab(TABS.FLOW)}
          label="FLOW"
          icon={<LayoutList size={22} />}
          color="#3498DB"
        />
      </div>
      <TabButton
        active={activeTab === TABS.LOG}
        onClick={() => setActiveTab(TABS.LOG)}
        label="LOG"
        icon={<History size={22} />}
        color="#2ECC71"
      />
    </nav>
  );
}

export { TABS };
