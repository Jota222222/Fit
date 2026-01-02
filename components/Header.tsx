import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Activity className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">NeuroFit SafePlan</h1>
            <p className="text-xs text-slate-500 font-medium">Treino Adaptado & Seguro</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
          <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
          <span>Foco em Proteção Cervical</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
