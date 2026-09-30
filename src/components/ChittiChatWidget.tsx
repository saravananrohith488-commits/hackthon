import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, RefreshCw, AlertCircle, Trash2, ShieldCheck } from 'lucide-react';
import { apiService } from '../services/api';

interface MessageItem {
  id: string;
  sender: 'user' | 'chitti';
  text: string;
  timestamp: string;
  source?: string;
  isError?: boolean;
}

export const ChittiChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMsg, setInputMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [lastFailedMsg, setLastFailedMsg] = useState<string | null>(null);

  const initialWelcomeMsg: MessageItem = {
    id: 'welcome-01',
    sender: 'chitti',
    text: "Hi! I'm CHITTI 🤖\nYour Sentinels Cybersecurity Assistant.\nHow can I help you with cybersecurity, ethical hacking, secure coding, or threat intelligence today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    source: 'Sentinels AI'
  };

  const [messages, setMessages] = useState<MessageItem[]>([initialWelcomeMsg]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const getActiveContext = (): Record<string, any> => {
    const ctx: Record<string, any> = {};
    try {
      const raw = sessionStorage.getItem('sentinals_active_forensic_context');
      if (raw) {
        Object.assign(ctx, JSON.parse(raw));
      }
    } catch {
      // ignore
    }
    try {
      const params = new URLSearchParams(window.location.search);
      const qId = params.get('id') || params.get('attack_id');
      if (qId) {
        ctx.attack_id = qId;
      }
    } catch {
      // ignore
    }
    return ctx;
  };

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || inputMsg).trim();
    if (!textToSend || loading) return;

    setLastFailedMsg(null);

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMsg('');
    setLoading(true);

    try {
      const historyPayload = messages
        .filter(m => !m.isError)
        .map(m => ({ sender: m.sender, text: m.text }));

      const contextPayload = getActiveContext();
      const res = await apiService.sendChatMessage(textToSend, historyPayload, contextPayload);

      if (res.status === "error" || res.error) {
        throw new Error(res.reply || "CHITTI is temporarily unable to respond. Please try again.");
      }

      const chittiReply: MessageItem = {
        id: `chitti-${Date.now()}`,
        sender: 'chitti',
        text: res.reply || "CHITTI is temporarily unable to respond. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.source || 'Sentinels AI'
      };

      setMessages(prev => [...prev, chittiReply]);
    } catch (err: any) {
      console.error("CHITTI API Error:", err);
      setLastFailedMsg(textToSend);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'chitti',
          text: err?.message || "CHITTI is temporarily unable to respond. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestionButtons = [
    "Explain this forensic report",
    "Is the evidence hash valid?",
    "Explain SQL Injection",
    "How does XSS work?",
    "Explain network security",
    "Help me secure my API"
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans select-none">
      {/* FLOATING TOGGLE BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-4 py-3 bg-[#131513] border-2 border-[#34D399] hover:bg-[#191B18] text-[#EEF0EA] rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-6 h-6 text-[#34D399] group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#34D399] animate-pulse"></span>
          </div>
          <div className="text-left font-mono">
            <span className="text-xs font-bold font-grotesk text-[#EEF0EA] block leading-none">🛡️ CHITTI</span>
            <span className="text-[10px] text-[#34D399] leading-none mt-0.5 block">Cybersecurity AI</span>
          </div>
        </button>
      )}

      {/* EXPANDED CHAT WIDGET */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[560px] bg-[#131513] border border-[#23261F] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* HEADER */}
          <div className="p-3.5 bg-[#191B18] border-b border-[#23261F] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0E2019] border border-[#0F3D2E] flex items-center justify-center text-[#34D399]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-grotesk font-bold text-[#EEF0EA] tracking-tight flex items-center gap-1.5">
                  CHITTI
                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#0E2019] text-[#34D399] border border-[#0F3D2E] rounded">
                    🛡️ CYBERSECURITY AI
                  </span>
                </h3>
                <span className="text-[10px] font-mono text-[#9BA096] block leading-none mt-0.5">
                  Sentinels Cybersecurity Assistant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([initialWelcomeMsg])}
                title="Clear Conversation"
                className="p-1.5 text-[#62675C] hover:text-[#EEF0EA] hover:bg-[#1E211D] rounded-md transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#62675C] hover:text-[#EEF0EA] hover:bg-[#1E211D] rounded-md transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MESSAGES THREAD */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0A0B0A]/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-xl text-xs leading-relaxed font-sans ${
                    m.sender === 'user'
                      ? 'bg-[#34D399] text-[#0A0B0A] font-medium rounded-br-none'
                      : m.isError
                      ? 'bg-[#211110] border border-[#3D1815] text-[#F0554A] rounded-bl-none'
                      : 'bg-[#191B18] border border-[#23261F] text-[#EEF0EA] rounded-bl-none'
                  }`}
                >
                  {m.isError && (
                    <div className="flex items-center gap-1.5 mb-1 font-bold text-[#F0554A]">
                      <AlertCircle className="w-4 h-4" />
                      <span>Connection Error</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>

                <div className="flex items-center gap-2 mt-1 px-1 text-[10px] font-mono text-[#62675C]">
                  <span>{m.timestamp}</span>
                  {m.source && <span className="text-[#34D399]">({m.source})</span>}
                </div>
              </div>
            ))}

            {/* SUGGESTION BUTTONS ON WELCOME SCREEN */}
            {messages.length === 1 && (
              <div className="pt-2 grid grid-cols-1 gap-2">
                <span className="text-[10px] font-mono text-[#62675C] uppercase block mb-1">Cybersecurity Topics:</span>
                {suggestionButtons.map((btnText, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(btnText)}
                    className="text-left text-xs font-sans px-3 py-2 bg-[#191B18] hover:bg-[#1E211D] text-[#EEF0EA] border border-[#23261F] rounded-lg transition flex items-center justify-between group cursor-pointer"
                  >
                    <span>{btnText}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#34D399] opacity-70 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}

            {/* TYPING / LOADING INDICATOR */}
            {loading && (
              <div className="flex items-center gap-2 p-3 bg-[#191B18] border border-[#23261F] rounded-xl rounded-bl-none text-xs text-[#9BA096] max-w-[80%]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#34D399]" />
                <span className="font-mono text-[11px]">CHITTI is analyzing security relevance...</span>
              </div>
            )}

            {/* RETRY BUTTON ON ERROR */}
            {lastFailedMsg && !loading && (
              <div className="flex justify-start">
                <button
                  onClick={() => handleSend(lastFailedMsg)}
                  className="px-3 py-1 bg-[#211110] hover:bg-[#3D1815] border border-[#3D1815] text-[#F0554A] rounded-lg text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry failed message</span>
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#191B18] border-t border-[#23261F] flex items-end gap-2"
          >
            <textarea
              rows={1}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask CHITTI a cybersecurity question... (Shift+Enter for newline)"
              className="flex-1 px-3 py-2 bg-[#131513] border border-[#23261F] rounded-lg text-xs font-sans text-[#EEF0EA] placeholder-[#62675C] focus:outline-none focus:border-[#0F3D2E] resize-none max-h-24"
            />
            <button
              type="submit"
              disabled={loading || !inputMsg.trim()}
              className="p-2.5 bg-[#34D399] hover:bg-[#2EB883] disabled:opacity-40 text-[#0A0B0A] rounded-lg transition cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
