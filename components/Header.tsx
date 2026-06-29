
import React from 'react';

interface HeaderProps {
  onSettings: () => void;
  onExport: () => void;
  onClearHistory?: () => void;
  isExporting?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSettings, onExport, onClearHistory, isExporting }) => {
  return (
    <header className="flex-none flex items-center justify-between p-3 bg-background-dark/80 backdrop-blur-md z-10 sticky top-0 border-b border-white/5">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-primary/20">
          BN
        </div>
        <h2 className="text-white text-base font-bold leading-tight tracking-tight">BíbliaNew AI</h2>
      </div>
      
      <div className="flex items-center gap-1">
        {onClearHistory && (
          <button 
            onClick={onClearHistory}
            title="Limpar Histórico de Estudos"
            className="flex items-center justify-center rounded-full w-9 h-9 hover:bg-red-500/10 transition-colors text-slate-400 hover:text-red-400"
          >
            <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
          </button>
        )}

        <button 
          onClick={onExport}
          disabled={isExporting}
          title="Exportar Histórico Completo"
          className="flex items-center justify-center rounded-full w-9 h-9 hover:bg-white/10 transition-colors text-slate-400 hover:text-primary disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">{isExporting ? 'sync' : 'history_edu'}</span>
        </button>
        
        <button 
          onClick={onSettings}
          title="Configurações"
          className="flex items-center justify-center rounded-full w-9 h-9 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
