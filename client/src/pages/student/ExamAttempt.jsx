import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';
import { 
  Clock, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Save,
  Send,
  MonitorOff,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const ExamAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState(null);

  // Anti-cheat: Tab switching detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => {
          const newValue = prev + 1;
          toast.error(`Warning: Tab switch detected (${newValue}/${exam?.tabSwitchLimit || 3})`, {
            icon: '⚠️',
          });
          if (newValue >= (exam?.tabSwitchLimit || 3)) {
            // Auto-submit or flag
            submitExam(true);
          }
          return newValue;
        });
      }
    };

    const handleContextMenu = (e) => e.preventDefault();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [exam]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const { data: attempt } = await axios.post('/attempts/start', { examId: id });
        setAttemptId(attempt.id);
        
        const { data: examData } = await axios.get(`/exams/${id}`);
        setExam(examData);
        setTimeLeft(examData.durationMinutes * 60);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to start exam');
        navigate('/student/dashboard');
      }
    };
    fetchExam();
  }, [id]);

  // Auto-save response whenever it changes
  useEffect(() => {
    if (!attemptId) return;
    
    const questionId = exam?.examQuestions[currentQuestionIndex]?.questionId;
    const currentResponse = responses[questionId];
    if (!currentResponse) return;

    const timer = setTimeout(async () => {
      try {
        await axios.post('/attempts/response', {
          attemptId,
          response: currentResponse
        });
      } catch (err) {
        console.error('Auto-save failed', err);
      }
    }, 2000); // Debounce save by 2s

    return () => clearTimeout(timer);
  }, [responses, currentQuestionIndex, attemptId]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 && exam) {
      submitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, exam]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleResponseChange = (questionId, value, type) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        questionId,
        type,
        ...(type === 'mcq' ? { selectedOptionId: value } : 
           type === 'code' ? { codeText: value } : 
           { explanationText: value }),
        timeSpent: (prev[questionId]?.timeSpent || 0) + 1
      }
    }));
  };

  const submitExam = async (isFlagged = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const payload = {
        attemptId,
        responses: Object.values(responses),
        isFlagged,
        tabSwitchCount: tabSwitches
      };
      await axios.post('/attempts/submit', payload);
      toast.success('Exam submitted successfully!');
      navigate('/student/dashboard');
    } catch (err) {
      toast.error('Failed to submit exam');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!exam) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="text-center">
        <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
        <p className="text-slate-500 font-medium">Loading your exam environment...</p>
      </div>
    </div>
  );

  const currentQuestion = exam.examQuestions[currentQuestionIndex].question;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Exam Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-lg">{exam.title}</h1>
          {exam.subject && (
            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase tracking-wider">
              {exam.subject.name}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-8">
          <div className={clsx(
            "flex items-center gap-2 font-mono font-bold text-lg px-4 py-1.5 rounded-lg border-2",
            timeLeft < 300 ? "text-danger border-danger/20 bg-danger/5 animate-pulse" : "text-slate-700 border-slate-100 bg-slate-50"
          )}>
            <Clock size={20} />
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={() => confirm('Are you sure you want to submit?') && submitExam()} 
            disabled={isSubmitting}
            className="btn btn-primary px-6"
          >
            <Send size={18} />
            Submit Exam
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto p-6 hidden lg:block">
          <div className="mb-8">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              <span>Progress</span>
              <span>{Math.round((Object.keys(responses).length / exam.examQuestions.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${(Object.keys(responses).length / exam.examQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h3 className="font-bold mb-4 text-slate-900">Question Map</h3>
          <div className="grid grid-cols-5 gap-3">
            {exam.examQuestions.map((eq, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestionIndex(i)}
                className={clsx(
                  "w-10 h-10 rounded-lg font-bold text-sm flex items-center justify-center transition-all",
                  currentQuestionIndex === i ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" :
                  responses[eq.questionId] ? "bg-success/10 text-success border border-success/20" :
                  "bg-slate-50 text-slate-400 border border-slate-100 hover:border-slate-300"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <div className="mt-12 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="text-amber-800 font-bold text-sm flex items-center gap-2 mb-2">
              <AlertTriangle size={16} />
              Proctoring Active
            </h4>
            <p className="text-amber-700 text-xs leading-relaxed">
              Do not switch tabs or resize the window. All actions are being logged.
            </p>
          </div>
        </aside>

        {/* Question Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div className="card shadow-xl border-none">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                        {currentQuestionIndex + 1}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Question</span>
                        <span className="text-xs font-bold text-slate-900">Part of {exam.examQuestions.length}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Weightage</span>
                      <span className="text-sm font-bold text-primary">{currentQuestion.marks} Marks</span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 leading-relaxed mb-10">
                    {currentQuestion.questionText}
                  </h2>

                  {/* Response Input */}
                  {currentQuestion.type === 'mcq' ? (
                    <div className="grid grid-cols-1 gap-4">
                      {currentQuestion.options.map((option) => (
                        <label 
                          key={option.id}
                          className={clsx(
                            "flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all hover:bg-slate-50 group",
                            responses[currentQuestion.id]?.selectedOptionId === option.id 
                            ? "border-primary bg-primary/5 text-primary" 
                            : "border-slate-100 bg-white"
                          )}
                        >
                          <input 
                            type="radio" 
                            name="mcq"
                            className="hidden"
                            checked={responses[currentQuestion.id]?.selectedOptionId === option.id}
                            onChange={() => handleResponseChange(currentQuestion.id, option.id, 'mcq')}
                          />
                          <div className={clsx(
                            "w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all group-hover:border-primary",
                            responses[currentQuestion.id]?.selectedOptionId === option.id ? "border-primary" : "border-slate-300"
                          )}>
                            {responses[currentQuestion.id]?.selectedOptionId === option.id && <div className="w-3 h-3 bg-primary rounded-full" />}
                          </div>
                          <span className="font-semibold text-lg">{option.text}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <textarea 
                          className="w-full h-80 p-8 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none transition-all font-mono text-sm leading-relaxed bg-slate-50/30 focus:bg-white shadow-inner"
                          placeholder={currentQuestion.type === 'code' ? "// Write your code here..." : "Provide a detailed explanation..."}
                          value={responses[currentQuestion.id]?.explanationText || responses[currentQuestion.id]?.codeText || ''}
                          onPaste={(e) => e.preventDefault()}
                          onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value, currentQuestion.type)}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest px-2">
                        <div className="flex items-center gap-4">
                          <span>Auto-save enabled</span>
                          <span>Paste disabled</span>
                        </div>
                        <span>Character Count: {(responses[currentQuestion.id]?.explanationText || responses[currentQuestion.id]?.codeText || '').length}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-4">
                  <button 
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="btn btn-outline px-8 py-3 rounded-xl border-slate-200 hover:bg-white"
                  >
                    <ChevronLeft size={20} />
                    Previous Question
                  </button>
                  
                  <div className="hidden md:flex items-center gap-2">
                    {exam.examQuestions.map((_, i) => (
                      <div 
                        key={i} 
                        className={clsx(
                          "w-1.5 h-1.5 rounded-full transition-all duration-300",
                          i === currentQuestionIndex ? "w-6 bg-primary" : "bg-slate-200"
                        )} 
                      />
                    ))}
                  </div>

                  {currentQuestionIndex === exam.examQuestions.length - 1 ? (
                    <button 
                      onClick={() => confirm('Are you sure you want to finish?') && submitExam()}
                      disabled={isSubmitting}
                      className="btn btn-primary bg-success hover:bg-success/90 border-none px-8 py-3 rounded-xl shadow-lg shadow-success/20"
                    >
                      Finish Exam
                      <Send size={18} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.examQuestions.length - 1, prev + 1))}
                      className="btn btn-primary px-8 py-3 rounded-xl shadow-lg shadow-primary/20"
                    >
                      Next Question
                      <ChevronRight size={20} />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExamAttempt;
