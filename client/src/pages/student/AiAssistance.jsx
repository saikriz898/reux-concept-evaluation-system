import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { 
  Sparkles, 
  Target, 
  Brain, 
  Zap,
  ArrowRight,
  Search,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

const AiAssistance = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        // In a real app, this would call an AI service to predict questions based on weak concepts
        const { data } = await axios.get('/dashboard/student');
        
        // Mocking predicted questions based on weak concepts
        const mockPredictions = (data.weakConcepts || []).map(concept => ({
          id: Math.random(),
          title: `Predicted Question on ${concept.conceptTag}`,
          description: `Based on your recent performance in ${concept.conceptTag}, this area is likely to appear in upcoming evaluations.`,
          difficulty: 'High',
          probability: '85%',
          concept: concept.conceptTag
        }));

        setPredictions(mockPredictions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  return (
    <div className="space-y-8">
      <div className="relative p-8 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold">MindBridge AI Insights</h1>
          </div>
          <p className="text-indigo-100 max-w-2xl text-lg">
            Our specialized MindBridge AI engine analyzes your performance patterns to predict likely examination topics and generate targeted practice questions.
          </p>
        </div>
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Target className="text-primary" size={24} />
            Predicted Topics & Questions
          </h3>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : predictions.length === 0 ? (
            <div className="card text-center py-20">
              <Brain size={48} className="mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500">Not enough data to generate predictions. Take more exams!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {predictions.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card group hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-full">
                      Probability: {p.probability}
                    </span>
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                      <Zap size={12} className="text-warning" />
                      {p.difficulty} Difficulty
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{p.title}</h4>
                  <p className="text-sm text-slate-500 mb-6">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-slate-400" />
                      <span className="text-xs text-slate-600 font-medium">{p.concept}</span>
                    </div>
                    <button className="flex items-center gap-2 text-primary font-bold text-sm">
                      Generate Practice Question
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="card bg-slate-900 text-white">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Zap className="text-warning" size={20} />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-left flex items-center justify-between">
                <span className="text-sm font-medium">Mock Exam Generator</span>
                <ArrowRight size={16} className="text-slate-400" />
              </button>
              <button className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-left flex items-center justify-between">
                <span className="text-sm font-medium">Concept Mastery Path</span>
                <ArrowRight size={16} className="text-slate-400" />
              </button>
              <button className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-left flex items-center justify-between">
                <span className="text-sm font-medium">Topic Wise Analysis</span>
                <ArrowRight size={16} className="text-slate-400" />
              </button>
            </div>
          </div>

          <div className="card border-dashed border-2 border-slate-200 bg-transparent">
            <h3 className="text-lg font-bold mb-4">How it works?</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              MindBridge AI uses a deep neural network trained on millions of academic data points to identify semantic gaps in your understanding. By correlating your errors with specific concept nodes, it can pinpoint with high accuracy which topics you should prioritize for your upcoming exams.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              Engine Status: Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistance;
