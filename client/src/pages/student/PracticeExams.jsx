import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { 
  Dumbbell, 
  Play, 
  Clock, 
  Trophy,
  History,
  Target,
  Sparkles,
  ArrowRight,
  Zap,
  Loader2,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

const PracticeExams = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tests');
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleStartPractice = async (mode, concept = null) => {
    try {
      const { data } = await axios.post('/attempts/practice/start', { mode, concept });
      navigate(`/student/exam/${data.examId}`); // Reuse ExamAttempt for practice
    } catch (err) {
      console.error('Failed to start practice', err);
    }
  };

  const practiceModes = [
    {
      id: 1,
      title: 'Quick Sprint',
      description: '10 questions, 15 minutes. Perfect for a fast concept check.',
      icon: <Zap className="text-warning" size={24} />,
      difficulty: 'Easy',
      questions: 10,
      time: '15m'
    },
    {
      id: 2,
      title: 'Full Mock Exam',
      description: '30 mixed questions covering all recent topics.',
      icon: <Dumbbell className="text-primary" size={24} />,
      difficulty: 'Medium',
      questions: 30,
      time: '60m'
    },
    {
      id: 3,
      title: 'MindBridge Mastery',
      description: 'AI-curated set focused specifically on your weak concepts.',
      icon: <Sparkles className="text-indigo-600" size={24} />,
      difficulty: 'Hard',
      questions: 25,
      time: '60m'
    }
  ];

  const exercises = [
    { id: 1, title: 'Algorithm Drill', topic: 'Sorting', count: 12, difficulty: 'Medium' },
    { id: 2, title: 'Concept Verification', topic: 'Memory Mgmt', count: 8, difficulty: 'Easy' },
    { id: 3, title: 'Syntax Mastery', topic: 'Python Logic', count: 15, difficulty: 'Medium' },
    { id: 4, title: 'Edge Case Testing', topic: 'Exception Handling', count: 10, difficulty: 'Hard' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Self-Improvement Zone</h1>
          <p className="text-slate-500">Choose between full practice exams or focused exercises.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('tests')}
            className={clsx(
              "px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'tests' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Practice Tests
          </button>
          <button 
            onClick={() => setActiveTab('exercises')}
            className={clsx(
              "px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'exercises' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Daily Exercises
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'tests' ? (
          <motion.div
            key="tests"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {practiceModes.map((mode, i) => (
              <div key={mode.id} className="card group hover:border-primary transition-all flex flex-col">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
                  {mode.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{mode.title}</h3>
                <p className="text-sm text-slate-500 mb-6 flex-1">{mode.description}</p>
                <div className="flex items-center gap-4 mb-6 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1"><Target size={14} />{mode.questions} Qs</span>
                  <span className="flex items-center gap-1"><Clock size={14} />{mode.time}</span>
                </div>
                <button onClick={() => handleStartPractice(mode.title)} className="btn btn-primary w-full">Start Test</button>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="exercises"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {exercises.map((ex, i) => (
              <div key={ex.id} className="card flex flex-row items-center justify-between group hover:border-success/30 transition-all p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-success">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{ex.title}</h4>
                    <p className="text-xs text-slate-500">{ex.topic} • {ex.count} questions</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={clsx(
                    "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest",
                    ex.difficulty === 'Easy' ? "bg-success/10 text-success" :
                    ex.difficulty === 'Medium' ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"
                  )}>
                    {ex.difficulty}
                  </span>
                  <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 group-hover:bg-success group-hover:text-white flex items-center justify-center transition-all">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="card">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <History className="text-slate-400" size={20} />
            Performance History
          </h3>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm font-bold text-xs">
                    {i === 1 ? 'PT' : 'EX'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{i === 1 ? 'Mock Exam #12' : 'Algorithm Drill'}</h4>
                    <p className="text-[10px] text-slate-400">2 hours ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-success">85%</p>
                  <p className="text-[10px] text-slate-400">Correct</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkles size={20} />
            AI Recommended Focus
          </h3>
          <p className="text-sm text-indigo-100 mb-6 leading-relaxed">
            Based on your MindBridge AI analysis, we recommend spending 20 minutes on **Binary Search Trees** today.
          </p>
          <button 
            onClick={() => handleStartPractice('Weak Concepts')}
            className="w-full py-3 rounded-xl bg-white text-indigo-600 font-bold text-sm hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
          >
            Practice Weak Concepts
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeExams;
