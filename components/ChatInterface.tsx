
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import MessageItem from './MessageItem';
import { DAILY_VERSES, DailyVerse } from '../constants';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onMicClick: () => void;
  isThinking?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, onMicClick, isThinking }) => {
  const [inputText, setInputText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Seleciona um versículo diário baseado no dia atual para que persista durante a sessão
  const [dailyVerse] = useState<DailyVerse>(() => {
    const dayIndex = new Date().getDate() % DAILY_VERSES.length;
    return DAILY_VERSES[dayIndex];
  });

  useEffect(() => {
    // Scroll automático para manter as respostas visíveis uma após a outra
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const startSTT = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    if (isTranscribing) {
      recognitionRef.current?.stop();
      setIsTranscribing(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false; 
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsTranscribing(true);
    };

    recognition.onresult = (event: any) => {
      let fullTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          fullTranscript += event.results[i][0].transcript;
        } else {
          fullTranscript += event.results[i][0].transcript;
        }
      }

      if (fullTranscript) {
        setInputText(prev => {
          const base = event.resultIndex === 0 ? "" : prev;
          return capitalize(base + fullTranscript);
        });
      }
    };

    recognition.onend = () => {
      setIsTranscribing(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Erro no Reconhecimento de Voz:", event.error);
      setIsTranscribing(false);
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  const studyStarters = [
    {
      icon: 'translate',
      title: 'Línguas Originais',
      description: 'Estude o significado profundo de Chesed (Hebraico) e Charis (Grego) nas escrituras.',
      color: 'from-amber-500/10 to-amber-600/5 hover:from-amber-500/20 border-amber-500/15',
      iconColor: 'text-amber-400',
      prompt: 'Faça um estudo teológico profundo sobre os termos Chesed (misericórdia/amor de aliança em Hebraico) e Charis (graça no Grego). Como esses conceitos se relacionam e se revelam na Bíblia?'
    },
    {
      icon: 'history_edu',
      title: 'Arqueologia Bíblica',
      description: 'Como as descobertas de manuscritos históricos esclarecem o contexto das escrituras.',
      color: 'from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 border-blue-500/15',
      iconColor: 'text-blue-400',
      prompt: 'Explique como as descobertas arqueológicas modernas (como os Manuscritos do Mar Morto) e a compreensão da cultura do Antigo Oriente Médio ajudam na exegese bíblica moderna.'
    },
    {
      icon: 'account_balance',
      title: 'Teologia Sistemática',
      description: 'Analise estruturada das visões Aliancista e Dispensacionalista de forma acadêmica.',
      color: 'from-purple-500/10 to-purple-600/5 hover:from-purple-500/20 border-purple-500/15',
      iconColor: 'text-purple-400',
      prompt: 'Apresente uma comparação acadêmica clara e equilibrada entre a Teologia da Aliança (Aliancismo) e a Teologia Dispensacionalista. Quais as principais diferenças hermenêuticas e escatológicas?'
    },
    {
      icon: 'auto_awesome',
      title: 'Tipologia Cristocêntrica',
      description: 'Veja como sombras e símbolos no Antigo Testamento prefiguram o sacrifício de Cristo.',
      color: 'from-emerald-500/10 to-emerald-600/5 hover:from-emerald-500/20 border-emerald-500/15',
      iconColor: 'text-emerald-400',
      prompt: 'Explique o conceito de tipologia bíblica. Como elementos do Antigo Testamento (como o Tabernáculo, o sacrifício de Isaque ou Melquisedeque) prefiguram a Jesus Cristo no Novo Testamento?'
    }
  ];

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <div className="flex justify-center my-4">
        <span className="text-[9px] font-black text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 uppercase tracking-[0.25em] flex items-center gap-1.5 shadow-sm">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          Sessão Ativa de Estudo
        </span>
      </div>

      <div className="space-y-8 px-4 pb-48 max-w-4xl mx-auto w-full">
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} onSendMessage={onSendMessage} />
        ))}

        {messages.length === 1 && (
          <div className="space-y-6 mt-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Versículo do Dia Container */}
            <div className="bg-gradient-to-br from-[#1b253b] to-[#121a2b] border border-amber-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-700" />
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-lg">auto_stories</span>
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Estudo do Versículo do Dia</span>
                </div>
                <span className="text-[9px] bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full font-extrabold uppercase tracking-wider">
                  {dailyVerse.theme}
                </span>
              </div>

              <div className="space-y-3">
                <p className="font-serif italic text-base md:text-lg text-amber-100 leading-relaxed tracking-wide font-medium">
                  "{dailyVerse.text}"
                </p>
                {dailyVerse.originalText && (
                  <p className="font-serif text-[11px] text-amber-500/50 leading-relaxed font-semibold italic">
                    {dailyVerse.originalText}
                  </p>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                  <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">{dailyVerse.reference}</span>
                  <button
                    onClick={() => onSendMessage(`Faça uma exegese teológica detalhada de ${dailyVerse.reference} ("${dailyVerse.text}"). Explicando o contexto bíblico original, termos-chave no hebraico/grego (${dailyVerse.originalText || ''}) e implicações teológicas para o entendimento da fé.`)}
                    className="flex items-center gap-1.5 text-[9px] font-black text-white bg-amber-500 hover:bg-amber-600 transition-all px-4 py-2 rounded-full uppercase tracking-wider active:scale-95 shadow-lg shadow-amber-500/20"
                  >
                    <span className="material-symbols-outlined text-[13px]">science</span>
                    Exegese com IA
                  </button>
                </div>
              </div>
            </div>

            {/* Bento-Grid Study Starters */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 px-1">
                <span className="material-symbols-outlined text-primary text-base">explore</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trilhas de Estudo Sugeridas</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {studyStarters.map((starter, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(starter.prompt)}
                    className={`flex flex-col items-start text-left p-5 rounded-2xl bg-gradient-to-br ${starter.color} border transition-all duration-300 hover:scale-[1.015] hover:border-white/10 hover:shadow-2xl active:scale-95 group relative overflow-hidden h-36 justify-between`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] group-hover:bg-white/[0.03] rounded-full blur-xl transition-all duration-500" />
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-white/5 group-hover:bg-primary/20 transition-all ${starter.iconColor}`}>
                        <span className="material-symbols-outlined text-lg">{starter.icon}</span>
                      </div>
                      <h4 className="text-[12.5px] font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">{starter.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-2 line-clamp-2">
                      {starter.description}
                    </p>
                    <div className="w-full flex justify-end items-center opacity-0 group-hover:opacity-100 transition-all pt-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
                        Estudar Tema <span className="material-symbols-outlined text-[11px] font-bold">arrow_forward</span>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {isThinking && (
          <div className="flex items-end gap-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 border border-white/20 text-white shadow-lg">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="bg-[#2d3a54] border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-xl">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={endOfMessagesRef} className="h-4" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-30">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          {isTranscribing && (
            <div className="flex justify-center">
               <div className="flex items-center gap-2 bg-red-500/20 px-5 py-2 rounded-full border border-red-500/30 shadow-2xl backdrop-blur-md">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  <span className="text-red-400 text-[9px] font-black uppercase tracking-[0.2em]">
                    Capturando Áudio...
                  </span>
               </div>
            </div>
          )}
          
          <div className="flex items-center gap-2.5 h-14">
            <div className="flex-1 bg-[#1a2233]/95 h-full rounded-[24px] flex items-center px-5 border border-white/10 focus-within:border-primary/70 transition-all shadow-2xl backdrop-blur-3xl">
              <button className="text-slate-400 hover:text-primary transition-colors mr-2 flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">sentiment_satisfied</span>
              </button>
              <textarea
                className="w-full bg-transparent border-none outline-none text-[14px] text-white placeholder-slate-500 focus:ring-0 p-0 resize-none overflow-hidden self-center py-2.5 font-medium"
                placeholder="Faça sua pergunta"
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button 
                onClick={startSTT}
                className={`ml-2 flex-shrink-0 w-8 h-8 rounded-full transition-all flex items-center justify-center ${isTranscribing ? 'bg-red-600 text-white animate-pulse' : 'text-slate-400 hover:bg-white/10 hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-[20px]">{isTranscribing ? 'stop' : 'mic'}</span>
              </button>
            </div>
            
            <button 
              onClick={onMicClick}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-[#232f48] text-slate-300 flex items-center justify-center hover:bg-slate-700 transition-all border border-white/10 active:scale-90 group relative animate-pulse"
            >
              <span className="material-symbols-outlined text-[26px]">settings_voice</span>
              <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-slate-800 text-[9px] px-2.5 py-1 rounded-lg border border-white/10 text-white font-black uppercase tracking-widest shadow-2xl">Voz Real Time</div>
            </button>
            
            <button 
              onClick={handleSend}
              disabled={!inputText.trim() || isThinking}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 active:scale-95 disabled:opacity-30 disabled:grayscale"
            >
              <span className="material-symbols-outlined text-[26px] ml-1">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
