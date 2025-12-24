
import React from 'react';
import { LayoutDashboard, Users, CreditCard, Clock, Settings, BrainCircuit, ShieldCheck, UserCircle } from 'lucide-react';
import { Language, Translation } from '../types';

interface SidebarProps {
  lang: Language;
  t: Translation;
  activePage: string;
  setActivePage: (page: string) => void;
  isEmployee?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ lang, t, activePage, setActivePage, isEmployee }) => {
  const adminMenuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
    { id: 'employees', icon: Users, label: t.employees },
    { id: 'payroll', icon: CreditCard, label: t.payroll },
    { id: 'attendance', icon: Clock, label: t.attendance },
    { id: 'ai', icon: BrainCircuit, label: t.aiAssistant },
    { id: 'settings', icon: Settings, label: t.settings },
  ];

  const employeeMenuItems = [
    { id: 'dashboard', icon: UserCircle, label: t.myPortal },
    { id: 'attendance', icon: Clock, label: t.attendance },
    { id: 'ai', icon: BrainCircuit, label: t.aiAssistant },
    { id: 'settings', icon: Settings, label: t.settings },
  ];

  const menuItems = isEmployee ? employeeMenuItems : adminMenuItems;

  return (
    <div className={`w-64 h-screen bg-indigo-900 text-white flex flex-col fixed top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} z-20 transition-all duration-300`}>
      <div className="p-6 flex items-center gap-3 border-b border-indigo-800">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-900 shadow-lg">
          <ShieldCheck size={28} />
        </div>
        <span className="text-2xl font-bold tracking-tight">Maward</span>
      </div>
      
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 transition-colors ${
              activePage === item.id 
                ? 'bg-indigo-800 border-l-4 border-indigo-400' 
                : 'hover:bg-indigo-800/50'
            }`}
          >
            <item.icon size={20} className={activePage === item.id ? 'text-indigo-400' : 'text-indigo-300'} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 bg-indigo-950 border-t border-indigo-800">
        <div className="flex items-center gap-3 p-2">
          <img src="https://i.pravatar.cc/150?u=hr" className="w-10 h-10 rounded-full border border-indigo-400" alt="User" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{isEmployee ? 'Employee' : 'HR Manager'}</p>
            <p className="text-xs text-indigo-400 truncate">{isEmployee ? 'Verified User' : 'Premium Member'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
