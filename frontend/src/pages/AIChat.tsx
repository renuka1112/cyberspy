import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  Bot, 
  User, 
  ShieldAlert, 
  FileText, 
  Globe, 
  History,
  Terminal,
  Cpu,
  Zap,
  Sparkles
} from 'lucide-react';

import axios from 'axios';

const AIChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { 
      id: 1, 
      type: 'ai', 
      text: "Hello! I am SIMBA (Security Intelligence Multi-Agent Bot). How can I help you secure your perimeter today?",
      timestamp: new Date().toLocaleTimeString() 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('http://localhost:8000/api/chat', { message: input });
      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: response.data.response,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: "I'm having trouble connecting to my neural core. Please ensure the CyberSpy Backend is active.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "Scan current network",
    "Latest threat reports",
    "How to analyze PCAP?",
    "Check file for malware"
  ];

  return (
    <div className="h-[calc(100vh-64px)] p-8 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tighter uppercase flex items-center gap-3">
             <Bot className="text-cyber-blue" />
             SIMBA Intelligence
          </h1>
          <p className="text-gray-400">CyberSpy's Neural Security Assistant</p>
        </div>
        <div className="flex gap-4">
           <button className="p-3 glass-morphism rounded-xl text-gray-400 hover:text-white transition-all"><History size={20} /></button>
           <button className="p-3 glass-morphism rounded-xl text-gray-400 hover:text-white transition-all"><Terminal size={20} /></button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Chat Window */}
        <div className="flex-1 glass-morphism rounded-3xl flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide" ref={scrollRef}>
             <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-4 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                         msg.type === 'user' ? 'bg-cyber-purple' : 'bg-cyber-blue shadow-neon-blue'
                       }`}>
                          {msg.type === 'user' ? <User size={20} className="text-white" /> : <Bot size={20} className="text-cyber-black" />}
                       </div>
                       <div className="space-y-1">
                          <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                            msg.type === 'user' 
                              ? 'bg-cyber-purple/20 border border-cyber-purple/50 text-white shadow-[0_0_15px_rgba(188,0,255,0.1)]' 
                              : 'bg-gray-900/80 border border-white/10 text-gray-100 shadow-lg backdrop-blur-md'
                          }`}>
                             {msg.text}
                          </div>
                          <div className={`text-[10px] font-mono text-gray-500 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                             {msg.timestamp}
                          </div>
                       </div>
                    </div>
                  </motion.div>
                ))}
             </AnimatePresence>
             {isTyping && (
               <div className="flex justify-start">
                  <div className="flex gap-4 max-w-[80%]">
                     <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyber-blue shadow-neon-blue">
                        <Bot size={20} className="text-cyber-black" />
                     </div>
                     <div className="p-4 rounded-2xl bg-gray-900/80 border border-white/10 flex gap-1">
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-cyber-blue rounded-full" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-cyber-blue rounded-full" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-cyber-blue rounded-full" />
                     </div>
                  </div>
               </div>
             )}
          </div>

          <div className="p-6 border-t border-white border-opacity-5 space-y-4">
             <div className="flex gap-2">
                {suggestions.map((s) => (
                  <button 
                    key={s} 
                    onClick={() => { setInput(s); }}
                    className="px-3 py-1.5 rounded-full bg-white bg-opacity-5 border border-white border-opacity-10 text-[10px] text-gray-400 hover:text-cyber-blue hover:border-cyber-blue transition-all uppercase font-bold"
                  >
                    {s}
                  </button>
                ))}
             </div>
             <form onSubmit={handleSend} className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask SIMBA about threats, files, or network security..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue/50 focus:bg-black/60 transition-all pr-32 backdrop-blur-sm"
                />
                <div className="absolute right-2 top-2 bottom-2 flex gap-2">
                   <button type="button" className="p-2 text-gray-500 hover:text-white transition-colors"><Mic size={20} /></button>
                   <button type="submit" className="px-6 rounded-xl bg-cyber-blue text-cyber-black font-bold flex items-center gap-2 hover:shadow-neon-blue transition-all">
                      <Send size={18} />
                   </button>
                </div>
             </form>
          </div>
        </div>

        {/* Sidebar Intel */}
        <div className="w-80 flex flex-col gap-6">
           <div className="glass-morphism p-6 rounded-3xl bg-gradient-to-br from-cyber-blue/10 to-transparent">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                 <Sparkles size={20} className="text-cyber-blue" />
                 AI Capabilities
              </h3>
              <div className="space-y-4">
                 <div className="flex gap-4">
                    <div className="p-3 rounded-xl bg-white bg-opacity-5 text-cyber-blue"><ShieldAlert size={18} /></div>
                    <div>
                       <div className="text-sm font-bold text-white uppercase">Threat Explainer</div>
                       <div className="text-xs text-gray-500">Demystifying CVEs and attack vectors.</div>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="p-3 rounded-xl bg-white bg-opacity-5 text-cyber-green"><FileText size={18} /></div>
                    <div>
                       <div className="text-sm font-bold text-white uppercase">Policy Audit</div>
                       <div className="text-xs text-gray-500">Analyze firewall and security rules.</div>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="p-3 rounded-xl bg-white bg-opacity-5 text-cyber-purple"><Globe size={18} /></div>
                    <div>
                       <div className="text-sm font-bold text-white uppercase">OSINT Engine</div>
                       <div className="text-xs text-gray-500">Scanning surface & deep web leaks.</div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass-morphism p-6 rounded-3xl flex-1 relative overflow-hidden">
              <h3 className="text-lg font-bold text-white mb-4">Neural Status</h3>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-[10px] text-gray-500 uppercase mb-2">
                       <span>Inference Speed</span>
                       <span>0.4ms/token</span>
                    </div>
                    <div className="h-1 bg-white bg-opacity-5 rounded-full overflow-hidden">
                       <motion.div animate={{ width: '92%' }} className="h-full bg-cyber-blue" />
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[10px] text-gray-500 uppercase mb-2">
                       <span>Context Window</span>
                       <span>128k Tokens</span>
                    </div>
                    <div className="h-1 bg-white bg-opacity-5 rounded-full overflow-hidden">
                       <motion.div animate={{ width: '45%' }} className="h-full bg-cyber-purple" />
                    </div>
                 </div>
              </div>
              
              <div className="mt-10 p-4 rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-5">
                 <div className="flex items-center gap-3 mb-2">
                    <Cpu size={16} className="text-cyber-yellow" />
                    <span className="text-xs font-bold text-white">HARDWARE ACCEL</span>
                 </div>
                 <p className="text-[10px] text-gray-600 leading-relaxed font-mono">
                    SIMBA is currently distributed across 4 H100 GPU clusters for real-time traffic inference.
                 </p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-cyber-blue/5 to-transparent pointer-events-none"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
