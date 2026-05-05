import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';
import { 
  Save, 
  X, 
  Search, 
  Plus, 
  Check,
  Loader2,
  Calendar,
  Clock
} from 'lucide-react';
import { clsx } from 'clsx';

const CreateExam = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [batches, setBatches] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    batchId: '',
    instructions: '',
    durationMinutes: 60,
    startTime: '',
    endTime: '',
    totalMarks: 0,
    tabSwitchLimit: 3,
    shuffleQuestions: true,
    shuffleOptions: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, batchRes] = await Promise.all([
          axios.get('/academic/subjects'),
          axios.get('/academic/batches') // Need to implement
        ]);
        setSubjects(subRes.data);
        setBatches(batchRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.subjectId) {
      axios.get(`/questions?subjectId=${formData.subjectId}&status=published`)
        .then(res => setQuestions(res.data));
    }
  }, [formData.subjectId]);

  const toggleQuestion = (q) => {
    if (selectedQuestions.find(sq => sq.id === q.id)) {
      setSelectedQuestions(prev => prev.filter(sq => sq.id !== q.id));
      setFormData(prev => ({ ...prev, totalMarks: prev.totalMarks - q.marks }));
    } else {
      setSelectedQuestions(prev => [...prev, q]);
      setFormData(prev => ({ ...prev, totalMarks: prev.totalMarks + q.marks }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        questionIds: selectedQuestions.map(q => q.id)
      };
      await axios.post('/exams', payload);
      toast.success('Exam created successfully!');
      navigate('/teacher/exams');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create New Examination</h1>
          <p className="text-slate-500">Step {step} of 2: {step === 1 ? 'Exam Details' : 'Select Questions'}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <div className={clsx("w-8 h-1 rounded-full transition-all", step >= 1 ? "bg-primary" : "bg-slate-200")} />
            <div className={clsx("w-8 h-1 rounded-full transition-all", step >= 2 ? "bg-primary" : "bg-slate-200")} />
          </div>
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={24} />
          </button>
        </div>
      </div>

      {step === 1 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Exam Title</label>
                <input 
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Unit 1 Midterm Assessment"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                  <select 
                    className="input-field"
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Batch</label>
                  <select 
                    className="input-field"
                    value={formData.batchId}
                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                  >
                    <option value="">Select Batch</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.name} - Sec {b.section}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Instructions</label>
                <textarea 
                  className="input-field min-h-[100px]"
                  placeholder="Enter exam rules and instructions..."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                />
              </div>
            </div>

            <div className="card space-y-6">
              <h3 className="font-bold text-slate-900">Schedule & Duration</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (Mins)</label>
                  <input 
                    type="number"
                    className="input-field"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Start Time</label>
                  <input 
                    type="datetime-local"
                    className="input-field"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">End Time</label>
                  <input 
                    type="datetime-local"
                    className="input-field"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card space-y-6">
              <h3 className="font-bold text-slate-900">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <span className="text-sm font-medium">Shuffle Questions</span>
                  <button 
                    onClick={() => setFormData({ ...formData, shuffleQuestions: !formData.shuffleQuestions })}
                    className={clsx("w-10 h-6 rounded-full transition-all relative", formData.shuffleQuestions ? "bg-primary" : "bg-slate-300")}
                  >
                    <div className={clsx("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", formData.shuffleQuestions ? "left-5" : "left-1")} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <span className="text-sm font-medium">Shuffle Options</span>
                  <button 
                    onClick={() => setFormData({ ...formData, shuffleOptions: !formData.shuffleOptions })}
                    className={clsx("w-10 h-6 rounded-full transition-all relative", formData.shuffleOptions ? "bg-primary" : "bg-slate-300")}
                  >
                    <div className={clsx("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", formData.shuffleOptions ? "left-5" : "left-1")} />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tab Switch Limit</label>
                  <input 
                    type="number"
                    className="input-field"
                    value={formData.tabSwitchLimit}
                    onChange={(e) => setFormData({ ...formData, tabSwitchLimit: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            
            <button 
              disabled={!formData.title || !formData.subjectId}
              onClick={() => setStep(2)}
              className="btn btn-primary w-full py-4 text-lg"
            >
              Continue to Questions
              <Plus size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card flex items-center justify-between bg-primary text-white border-none">
            <div>
              <p className="text-sm opacity-80">Total Selected Questions</p>
              <p className="text-2xl font-bold">{selectedQuestions.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Total Marks</p>
              <p className="text-2xl font-bold">{formData.totalMarks}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900">Available Questions</h3>
              <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
                {questions.map(q => (
                  <div 
                    key={q.id}
                    onClick={() => toggleQuestion(q)}
                    className={clsx(
                      "p-4 rounded-xl border-2 cursor-pointer transition-all",
                      selectedQuestions.find(sq => sq.id === q.id) 
                      ? "border-primary bg-primary/5" 
                      : "border-slate-100 bg-white hover:border-slate-200"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase text-slate-500">{q.type}</span>
                      <span className="text-sm font-bold text-slate-400">{q.marks}M</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 line-clamp-2">{q.questionText}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900">Exam Preview</h3>
              <div className="card space-y-4 bg-slate-50 border-dashed border-2">
                {selectedQuestions.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    No questions selected yet.
                  </div>
                ) : (
                  selectedQuestions.map((q, i) => (
                    <div key={q.id} className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 bg-white border border-slate-200 rounded flex items-center justify-center font-bold text-xs">{i + 1}</div>
                      <p className="flex-1 truncate text-slate-600">{q.questionText}</p>
                      <button onClick={(e) => { e.stopPropagation(); toggleQuestion(q); }} className="text-danger p-1">
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center gap-4 pt-6">
                <button onClick={() => setStep(1)} className="btn bg-white text-slate-600 border border-slate-200 px-8">
                  Back
                </button>
                <button 
                  disabled={selectedQuestions.length === 0 || loading}
                  onClick={handleSubmit}
                  className="btn btn-primary flex-1 py-3"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Check size={20} /> Finalize & Create Exam</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateExam;
