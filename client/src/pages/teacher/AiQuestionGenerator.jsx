import React, { useState } from 'react';
import axios from '../../api/axios';
import { 
  Sparkles, 
  Plus, 
  Brain, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AiQuestionGenerator = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    try {
      const { data } = await axios.post('/ai/generate-questions', { topic, difficulty });
      setGeneratedQuestions(data.questions);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-primary" />
            AI Question Generator
          </h1>
          <p className="text-slate-500">Generate high-quality exam questions using MindBridge AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="card h-fit">
          <h3 className="text-lg font-bold mb-6">Configuration</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subject / Topic</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Data Structures, Operating Systems"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Difficulty</label>
              <div className="flex gap-2">
                {['Easy', 'Medium', 'Hard'].map(d => (
                  <button 
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={clsx(
                      "flex-1 py-2 rounded-lg text-xs font-bold border transition-all",
                      difficulty === d ? "bg-primary text-white border-primary" : "bg-white text-slate-500 border-slate-200"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={!topic || isGenerating}
              className="w-full btn btn-primary py-3 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Brain size={18} />}
              Generate Questions
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <CheckCircle2 className="text-success" size={20} />
            Generated Drafts
          </h3>

          {!isGenerating && generatedQuestions.length === 0 && (
            <div className="card text-center py-20 border-dashed border-2">
              <Brain size={48} className="mx-auto mb-4 text-slate-200" />
              <p className="text-slate-400">Configure settings and click generate to see AI magic.</p>
            </div>
          )}

          {isGenerating && (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-40 bg-slate-50 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {generatedQuestions.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card group hover:border-primary/30 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-full">
                    {q.type}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Copy size={16} /></button>
                    <button className="p-2 text-slate-400 hover:text-success transition-colors"><Plus size={16} /></button>
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{q.questionText}</h4>
                <div className="text-xs text-slate-500 mb-6">
                  {q.type === 'mcq' ? (
                    <ul className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          {opt}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="italic">Subjective explanation expected.</p>
                  )}
                </div>
                <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                  Edit & Finalize <ChevronRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for clsx if missing
const clsx = (...classes) => classes.filter(Boolean).join(' ');

export default AiQuestionGenerator;
