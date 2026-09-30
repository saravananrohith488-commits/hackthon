import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bot, Send, Sparkles, RefreshCw, AlertCircle, Trash2 } from 'lucide-react';
import { apiService } from '../services/api';

interface MessageItem {
  id: string;
  sender: 'user' | 'chitti';
  text: string;
  timestamp: string;
  source?: string;
  isError?: boolean;
}

export const ChittiChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [inputMsg, setInputMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [lastFailedMsg, setLastFailedMsg] = useState<string | null>(null);

  const initialWelcomeMsg: MessageItem = {
    id: 'welcome-page-01',
    sender: 'chitti',
    text: "Hi! I'm CHITTI 🤖\nYour Sentinels Cybersecurity Assistant.\nHow can I help you with cybersecurity, forensic reports, SHA-256 evidence integrity, secure coding, or threat intelligence today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    source: 'Sentinels AI'
  };

  const [messages, setMessages] = useState<MessageItem[]>([initialWelcomeMsg]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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
    const qAttackId = searchParams.get('attack_id') || searchParams.get('id');
    if (qAttackId) {
      ctx.attack_id = qAttackId;
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
      console.error("CHITTI Page API Error:", err);
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
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col font-sans">
      {/* PAGE HEADER */}
      <div className="pb-4 border-b border-[#23261F] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0E2019] border border-[#0F3D2E] flex items-center justify-center text-[#34D399]">
            <Bot className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl font-grotesk font-bold text-[#EEF0EA] tracking-tight flex items-center gap-2">
              CHITTI
              <span className="px-2.5 py-0.5 bg-[#0E2019] border border-[#0F3D2E] text-[#34D399] font-mono text-xs font-bold rounded-full">
                🛡️ CYBERSECURITY AI
              </span>
            </h1>
            <p className="text-xs text-[#9BA096] font-sans mt-0.5">
              Sentinels Cybersecurity Assistant — Defense, Secure Coding, Vulnerability Analysis & Forensics.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([initialWelcomeMsg])}
          className="px-3 py-1.5 bg-[#191B18] hover:bg-[#1E211D] border border-[#23261F] text-[#9BA096] hover:text-[#EEF0EA] rounded-lg text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Conversation</span>
        </button>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 bg-[#131513] border border-[#23261F] rounded-2xl flex flex-col overflow-hidden min-h-0">
        {/* MESSAGES THREAD */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#0A0B0A]/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[75%] p-4 rounded-xl text-xs leading-relaxed font-sans space-y-2 ${
                  m.sender === 'user'
                    ? 'bg-[#34D399] text-[#0A0B0A] font-medium rounded-br-none'
                    : m.isError
                    ? 'bg-[#211110] border border-[#3D1815] text-[#F0554A] rounded-bl-none'
                    : 'bg-[#191B18] border border-[#23261F] text-[#EEF0EA] rounded-bl-none shadow-lg'
                }`}
              >
                {m.isError && (
                  <div className="flex items-center gap-1.5 font-bold text-[#F0554A]">
                    <AlertCircle className="w-4 h-4" />
                    <span>Connection Error</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>

              <div className="flex items-center gap-2 mt-1.5 px-1 text-[10px] font-mono text-[#62675C]">
                <span>{m.timestamp}</span>
                {m.source && <span className="text-[#34D399]">({m.source})</span>}
              </div>
            </div>
          ))}

          {/* SUGGESTION BUTTONS ON WELCOME SCREEN */}
          {messages.length === 1 && (
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl">
              {suggestionButtons.map((btnText, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(btnText)}
                  className="p-3 bg-[#191B18] hover:bg-[#1E211D] text-[#EEF0EA] border border-[#23261F] rounded-xl text-xs font-sans text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <span>{btnText}</span>
                  <Sparkles className="w-4 h-4 text-[#34D399] opacity-70 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          )}

          {/* LOADING / TYPING INDICATOR */}
          {loading && (
            <div className="flex items-center gap-2 p-4 bg-[#191B18] border border-[#23261F] rounded-xl rounded-bl-none text-xs text-[#9BA096] max-w-[50%]">
              <RefreshCw className="w-4 h-4 animate-spin text-[#34D399]" />
              <span className="font-mono text-xs">CHITTI is analyzing security relevance...</span>
            </div>
          )}

          {/* RETRY BUTTON */}
          {lastFailedMsg && !loading && (
            <div className="flex justify-start">
              <button
                onClick={() => handleSend(lastFailedMsg)}
                className="px-3.5 py-1.5 bg-[#211110] hover:bg-[#3D1815] border border-[#3D1815] text-[#F0554A] rounded-lg text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry failed message</span>
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BAR */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-[#191B18] border-t border-[#23261F] flex items-end gap-3 shrink-0"
        >
          <textarea
            rows={1}
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask CHITTI a cybersecurity question... (Shift+Enter for newline)"
            className="flex-1 px-4 py-3 bg-[#131513] border border-[#23261F] rounded-xl text-xs font-sans text-[#EEF0EA] placeholder-[#62675C] focus:outline-none focus:border-[#0F3D2E] resize-none max-h-32"
          />
          <button
            type="submit"
            disabled={loading || !inputMsg.trim()}
            className="px-5 py-3 bg-[#34D399] hover:bg-[#2EB883] disabled:opacity-40 text-[#0A0B0A] font-grotesk font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
            <span>Send to CHITTI</span>
          </button>
        </form>
      </div>
    </div>
  );
};
