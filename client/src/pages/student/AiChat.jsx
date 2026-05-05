import React, { useState, useEffect, useRef } from 'react';
import axios from '../../api/axios';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const AiChat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am MindBridge AI. How can I help you understand your academic concepts today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await axios.post('/ai/chat', {
        message: input,
        history: messages.slice(-5) // Send last 5 messages for context
      });

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Sparkles className="text-primary" />
            AI Doubt Solver
          </h1>
          <p className="text-slate-500">Verify your concepts and clear academic doubts with MindBridge AI.</p>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'assistant', content: 'Hello! I am MindBridge AI. How can I help you understand your academic concepts today?' }])}
          className="btn btn-outline text-danger hover:bg-danger/5 border-slate-200"
        >
          <Trash2 size={18} />
          Clear Chat
        </button>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "flex items-start gap-4 max-w-[80%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                m.role === 'user' ? "bg-primary text-white" : "bg-slate-100 text-primary"
              )}>
                {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={clsx(
                "p-4 rounded-2xl text-sm leading-relaxed",
                m.role === 'user' 
                  ? "bg-primary text-white rounded-tr-none" 
                  : "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100",
                m.isError && "bg-red-50 text-red-600 border-red-100"
              )}>
                {m.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-primary flex items-center justify-center animate-pulse">
                <Bot size={20} />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100">
                <Loader2 size={20} className="animate-spin text-primary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your doubt here... (e.g. Explain how Dijkstra's algorithm works)"
              className="w-full py-4 pl-6 pr-16 rounded-2xl bg-white border border-slate-200 focus:border-primary outline-none shadow-sm transition-all text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
            >
              <Send size={20} />
            </button>
          </form>
          <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
            <AlertCircle size={12} />
            AI will guide you but won't provide full code solutions
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
