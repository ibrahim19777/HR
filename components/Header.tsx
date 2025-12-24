
import React from 'react';
import { Bell, Globe, Search, ArrowUpCircle } from 'lucide-react';
import { Language, Translation } from '../types';

interface HeaderProps {
  lang: Language;
  t: Translation;
  setLang: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ lang, t, setLang }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t.search}
            className={`w-full bg-slate-100 border-none rounded-full py-2 ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:ring-2 focus:ring-indigo-500 text-sm`}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200 text-sm">
          <ArrowUpCircle size={16} />
          <span className="font-medium">{t.trialMessage}</span>
          <button className="text-amber-900 underline font-bold hover:text-amber-950">
            {t.upgradeNow}
          </button>
        </div>

        <button 
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <Globe size={20} />
          <span className="text-sm font-semibold uppercase">{lang === 'en' ? 'العربية' : 'English'}</span>
        </button>

        <button className="relative text-slate-600 hover:text-indigo-600 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
