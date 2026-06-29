
import React, { useState } from 'react';
import { Message } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface MessageItemProps {
  message: Message;
  onSendMessage?: (text: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onSendMessage }) => {
  const isAI = message.sender === 'ai';
  const [isExporting, setIsExporting] = useState(false);

  const suggestionsMatch = message.text.match(/\[SUGESTOES: (.*?)\]/);
  const suggestions = suggestionsMatch 
    ? suggestionsMatch[1].split('|').map(s => s.trim())
    : [];
  
  const cleanMessageText = message.text.replace(/\[SUGESTOES: .*?\]/, '').trim();

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const MARGIN = 20; 
      const PAGE_W = 210;
      const PAGE_H = 297;
      const CONTENT_W_MM = PAGE_W - (MARGIN * 2);
      const MAX_Y = PAGE_H - MARGIN;
      
      let currentY = MARGIN;

      const addBlock = async (html: string) => {
        const div = document.createElement('div');
        div.style.width = '800px';
        div.style.padding = '5px 20px';
        div.style.backgroundColor = 'white';
        div.style.fontFamily = 'Arial, sans-serif';
        div.style.position = 'fixed';
        div.style.left = '-10000px';
        div.innerHTML = html;
        document.body.appendChild(div);
        
        const canvas = await html2canvas(div, { scale: 2, backgroundColor: 'white' });
        document.body.removeChild(div);
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const imgH = (canvas.height * CONTENT_W_MM) / canvas.width;

        if (currentY + imgH > MAX_Y) {
          pdf.addPage();
          currentY = MARGIN;
        }

        pdf.addImage(imgData, 'JPEG', MARGIN, currentY, CONTENT_W_MM, imgH);
        currentY += imgH;
      };

      await addBlock(`
        <div style="border-bottom: 4px solid #135bec; padding-bottom: 8px; margin-bottom: 12px;">
          <h1 style="margin: 0; font-size: 28pt; font-weight: 900; color: #135bec;">BÍBLIANEW AI</h1>
          <p style="margin: 3px 0 0 0; font-size: 11pt; font-weight: bold; text-transform: uppercase; color: #64748b; letter-spacing: 1px;">
            Estudo Bíblico gerado em ${new Date().toLocaleDateString('pt-BR')} - App desenvolvido por Marcos de Lima
          </p>
        </div>
      `);

      const lines = cleanMessageText.split('\n');
      for (const line of lines) {
        const l = line.replace(/\*/g, '').replace(/---/g, '').trim();
        if (!l) {
          currentY += 2;
          continue;
        }

        let html = '';
        if (l.startsWith('# ')) {
          html = `<h1 style="font-size: 14pt; color: #135bec; margin-top: 10px; margin-bottom: 2px; font-weight: 900;">${l.substring(2)}</h1>`;
        } else if (l.startsWith('## ')) {
          html = `<h2 style="font-size: 12pt; color: #334155; margin-top: 6px; margin-bottom: 2px; font-weight: 800;">${l.substring(3)}</h2>`;
        } else {
          html = `<p style="font-size: 12pt; line-height: 1.5; color: #1e293b; text-align: justify; margin: 0; padding-bottom: 4px;">${l}</p>`;
        }
        
        await addBlock(html);
      }
      
      pdf.save(`biblianew-estudo-${Date.now()}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Houve um problema ao gerar o PDF individual.');
    } finally {
      setIsExporting(false);
    }
  };

  const parseInlineText = (text: string): React.ReactNode[] => {
    const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*|[\u0590-\u05FF\u0370-\u03FF]+)/g;
    const subTokens = text.split(regex);
    
    return subTokens.map((token, idx) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        return <strong key={idx} className="font-extrabold text-amber-400">{token.slice(2, -2)}</strong>;
      }
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code key={idx} className="font-mono text-xs bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/20 shadow-sm mx-0.5">
            {token.slice(1, -1)}
          </code>
        );
      }
      if (token.startsWith('*') && token.endsWith('*')) {
        return <em key={idx} className="italic text-slate-300">{token.slice(1, -1)}</em>;
      }
      const isOriginalLanguage = /[\u0590-\u05FF\u0370-\u03FF]/.test(token);
      if (isOriginalLanguage) {
        return (
          <span key={idx} className="font-serif text-sm font-bold text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded shadow-sm border border-amber-500/25 mx-0.5" title="Termo original">
            {token}
          </span>
        );
      }
      return <span key={idx}>{token}</span>;
    });
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="h-2" />;
      
      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={i} className="text-sm font-black text-white mt-5 mb-3 uppercase tracking-tight border-b border-white/10 pb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-primary rounded-full" />
            {parseInlineText(trimmed.substring(2))}
          </h1>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={i} className="text-xs font-extrabold text-amber-400 mt-4 mb-2.5 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1 h-1 bg-amber-400 rounded-full" />
            {parseInlineText(trimmed.substring(3))}
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={i} className="text-[11px] font-bold text-primary mt-3.5 mb-2 uppercase tracking-wider">
            {parseInlineText(trimmed.substring(4))}
          </h3>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={i} className="border-l-3 border-amber-500/50 bg-amber-500/5 pl-3.5 py-2.5 pr-2 my-3 rounded-r-xl italic text-slate-300 leading-relaxed text-[12.5px]">
            {parseInlineText(trimmed.substring(2))}
          </blockquote>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <div key={i} className="flex items-start gap-2 mb-2 pl-1.5">
            <span className="text-amber-500 font-bold select-none text-[10px] mt-1">◆</span>
            <span className="leading-relaxed text-slate-100 font-medium text-[13px] antialiased">
              {parseInlineText(trimmed.substring(2))}
            </span>
          </div>
        );
      }
      
      return (
        <p key={i} className="mb-3 leading-relaxed text-slate-100 font-medium text-[13px] antialiased">
          {parseInlineText(trimmed)}
        </p>
      );
    });
  };

  return (
    <div className={`flex items-end gap-3 ${isAI ? '' : 'justify-end'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      {isAI && (
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 border border-white/20 text-white shadow-xl shadow-primary/40 mb-1">
          <span className="material-symbols-outlined text-[20px]">smart_toy</span>
        </div>
      )}

      <div className={`flex flex-col gap-2 max-w-[85%] ${isAI ? 'items-start' : 'items-end'}`}>
        <div className="flex items-baseline gap-2 px-1">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isAI ? 'text-primary' : 'text-slate-400'}`}>
            {isAI ? 'BíbliaNew AI' : 'Você'}
          </span>
          <span className="text-[9px] text-slate-500 font-bold">{message.timestamp}</span>
        </div>

        <div className={`
          p-5 rounded-[22px] shadow-2xl border transition-all duration-300
          ${isAI 
            ? 'bg-[#1f293a] border-white/10 rounded-tl-none' 
            : 'bg-primary border-primary/40 rounded-tr-none'}
        `}>
          <div className="text-[13px]">
            {isAI ? formatText(cleanMessageText) : (
              <p className="whitespace-pre-wrap font-bold text-white tracking-tight leading-relaxed">{message.text}</p>
            )}
          </div>

          {isAI && (
            <>
              {suggestions.length > 0 && (
                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary text-sm">explore</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Próximos Passos no Estudo</span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSendMessage?.(s)}
                        className="text-[12px] font-bold bg-black/20 hover:bg-primary text-slate-200 hover:text-white px-4 py-3 rounded-xl border border-white/5 hover:border-primary/50 transition-all text-left flex items-center justify-between group"
                      >
                        <span className="flex-1">{s}</span>
                        <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-2">send</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 hover:text-white transition-all bg-black/40 hover:bg-primary/50 px-4 py-2 rounded-full border border-white/5 uppercase tracking-widest active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isExporting ? 'sync' : 'picture_as_pdf'}
                  </span>
                  {isExporting ? 'Processando...' : 'Exportar PDF'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {!isAI && (
        <div className="w-9 h-9 rounded-xl bg-[#2d3a54] flex items-center justify-center flex-shrink-0 border border-white/20 text-white shadow-xl mb-1">
          <span className="material-symbols-outlined text-[20px]">person</span>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
