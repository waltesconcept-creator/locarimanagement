import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Smartphone, 
  Send, 
  Sparkles, 
  RefreshCw, 
  UserCheck, 
  ShieldCheck,
  CheckCheck
} from 'lucide-react';

interface MessageItem {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  actionTaken?: string;
}

interface WhatsAppSimulatorPageProps {
  onDataMutated: () => void;
}

export const WhatsAppSimulatorPage: React.FC<WhatsAppSimulatorPageProps> = ({ onDataMutated }) => {
  // Test Personas
  const personas = [
    {
      id: 'diaspora',
      name: 'Chief Adeleke (🇬🇧 UK Diaspora Landlord)',
      phone: '+447911123456',
      role: 'Landlord'
    },
    {
      id: 'manager',
      name: 'Tunde Balogun (Property Manager)',
      phone: '+2348011223344',
      role: 'Property Manager'
    },
    {
      id: 'new_user',
      name: 'Unregistered Diaspora Landlord (New)',
      phone: '+14155552671', // US Number
      role: 'New Lead'
    }
  ];

  const [selectedPersona, setSelectedPersona] = useState(personas[0]);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: `👋 *Locari Property Management Assistant*\nConnected as: *${selectedPersona.name}*\n\nReply *'Menu'* or tap a quick prompt below to test natural language commands!`,
      time: '12:00 PM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handlePersonaChange = (p: typeof personas[0]) => {
    setSelectedPersona(p);
    setMessages([
      {
        id: `switch-${Date.now()}`,
        sender: 'bot',
        text: `Switched simulator persona to: *${p.name}* (${p.phone})\nReply *'Menu'* or start typing!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message
    const userMsg: MessageItem = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: timeStr
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const res = await api.simulateWhatsAppMessage(
        selectedPersona.phone,
        text,
        selectedPersona.name
      );

      const botMsg: MessageItem = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: res.responseText || 'No response received.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTaken: res.actionTaken
      };

      setMessages(prev => [...prev, botMsg]);

      // If database was modified (e.g. property created, payment recorded, approval given), notify dashboard!
      if (res.actionTaken) {
        onDataMutated();
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bot',
          text: `⚠️ Error contacting backend: ${err.message}`,
          time: timeStr
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    'Menu',
    'Overview',
    'Properties',
    'Who is owing rent?',
    'Record payment ₦450,000 for Flat 2',
    'Maintenance',
    'Approve repair',
    'Monthly statement',
    'Dashboard'
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 mb-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            <span>BotSailor & WhatsApp Engine Live Simulator</span>
          </div>
          <h1 className="text-2xl font-black font-headline text-surface-900 dark:text-surface-100">
            WhatsApp Operational Cockpit
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            Test natural language flows, automated WhatsApp registration, property listing, and rent logging in real-time.
          </p>
        </div>

        {/* Persona Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-surface-500">Test as:</span>
          <select
            value={selectedPersona.id}
            onChange={e => {
              const p = personas.find(item => item.id === e.target.value);
              if (p) handlePersonaChange(p);
            }}
            className="px-3.5 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-xs font-bold text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
          >
            {personas.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Instructions & Quick Chips */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-850 shadow-xs space-y-3">
            <h3 className="font-headline font-bold text-sm text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Interactive Quick Commands</span>
            </h3>
            <p className="text-xs text-surface-500 leading-relaxed">
              Tap any button below to immediately dispatch it to the WhatsApp assistant. Any data created here updates the Web Dashboard instantly!
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {quickPrompts.map(p => (
                <button
                  key={p}
                  onClick={() => handleSendMessage(p)}
                  className="px-3 py-1.5 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-brand-500 hover:text-surface-950 text-surface-700 dark:text-surface-300 text-xs font-bold transition-all shadow-2xs"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>BotSailor & WhatsApp Native Sync</span>
            </div>
            <p className="text-[11px] leading-relaxed text-surface-600 dark:text-surface-400">
              When deployed to production with your BotSailor subscription, every message received at your webhook endpoint (<code>/webhook/botsailor</code>) executes this exact same engine.
            </p>
          </div>
        </div>

        {/* Right Side: Smartphone Device Frame */}
        <div className="lg:col-span-7 flex justify-center w-full">
          <div className="w-full max-w-md rounded-3xl sm:rounded-[2.5rem] bg-surface-950 p-2 sm:p-3 shadow-2xl border-2 sm:border-4 border-surface-800">
            {/* Phone Screen */}
            <div className="rounded-2xl sm:rounded-[2rem] bg-[#0c1317] text-white flex flex-col h-[520px] sm:h-[580px] overflow-hidden relative">
              {/* WhatsApp Header */}
              <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between shadow-md shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-500 text-surface-950 flex items-center justify-center font-black text-xs">
                    LP
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white">Locari Assistant 🏠</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>online • official PM OS</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-surface-400">
                  {selectedPersona.phone}
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
                {messages.map(m => {
                  const isUser = m.sender === 'user';

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs whitespace-pre-wrap leading-relaxed ${
                          isUser
                            ? 'bg-[#005c4b] text-white rounded-br-xs'
                            : 'bg-[#202c33] text-surface-100 rounded-bl-xs'
                        }`}
                      >
                        {m.text}

                        <div className="flex items-center justify-end gap-1 text-[9px] text-surface-400 mt-1">
                          <span>{m.time}</span>
                          {isUser && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                        </div>
                      </div>

                      {m.actionTaken && (
                        <div className="text-[9px] font-bold uppercase tracking-wider text-brand-400 px-1">
                          ⚡ Action Executed: {m.actionTaken}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Input Bar */}
              <div className="bg-[#202c33] p-2.5 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Type a message (e.g. 'Overview', 'Add Property')..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  disabled={isSending}
                  className="flex-1 px-4 py-2.5 rounded-full bg-[#2a3942] text-xs text-white placeholder-surface-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={isSending || !inputText.trim()}
                  className="w-9 h-9 rounded-full bg-brand-500 hover:bg-brand-400 text-surface-950 flex items-center justify-center shrink-0 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
