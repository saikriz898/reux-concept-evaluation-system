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
  MonitorOff
} from 'lucide-react';
import { clsx } from 'clsx';

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

  if (!exam) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;

  const currentQuestion = exam.examQuestions[currentQuestionIndex].question;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Exam Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-lg">{exam.title}</h1>
          <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase tracking-wider">
            {exam.subject.name}
          </span>
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
          <h3 className="font-bold mb-4 text-slate-900">Questions</h3>
          <div className="grid grid-cols-5 gap-3">
            {exam.examQuestions.map((eq, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestionIndex(i)}
                className={clsx(
                  "w-10 h-10 rounded-lg font-bold text-sm flex items-center justify-center transition-all",
                  currentQuestionIndex === i ? "bg-primary text-white shadow-lg shadow-primary/20" :
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
              Do not switch tabs or resize the window. All actions are being logged for evaluation.
            </p>
          </div>
        </aside>

        {/* Question Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-bold text-primary uppercase tracking-widest">Question {currentQuestionIndex + 1}</span>
                <span className="text-sm font-bold text-slate-400">{currentQuestion.marks} Marks</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 leading-relaxed mb-8">
                {currentQuestion.questionText}
              </h2>

              {/* Response Input */}
              {currentQuestion.type === 'mcq' ? (
                <div className="space-y-4">
                  {currentQuestion.options.map((option) => (
                    <label 
                      key={option.id}
                      className={clsx(
                        "flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-slate-50",
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
                        "w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all",
                        responses[currentQuestion.id]?.selectedOptionId === option.id ? "border-primary" : "border-slate-300"
                      )}>
                        {responses[currentQuestion.id]?.selectedOptionId === option.id && <div className="w-3 h-3 bg-primary rounded-full" />}
                      </div>
                      <span className="font-medium">{option.text}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea 
                    className="w-full h-64 p-6 rounded-xl border-2 border-slate-100 focus:border-primary outline-none transition-all font-mono text-sm leading-relaxed"
                    placeholder={currentQuestion.type === 'code' ? "// Write your code here..." : "Explain your understanding..."}
                    value={responses[currentQuestion.id]?.explanationText || responses[currentQuestion.id]?.codeText || ''}
                    onPaste={(e) => e.preventDefault()}
                    onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value, currentQuestion.type)}
                  />
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>Press Tab to indent</span>
                    <span>Copy-paste is disabled</span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="btn btn-outline px-6"
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              <div className="text-slate-400 font-bold">
                {currentQuestionIndex + 1} / {exam.examQuestions.length}
              </div>
              <button 
                onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.examQuestions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === exam.examQuestions.length - 1}
                className="btn btn-primary px-6"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExamAttempt;
