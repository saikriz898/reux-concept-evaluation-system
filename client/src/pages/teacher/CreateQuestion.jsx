import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Loader2
} from 'lucide-react';

const CreateQuestion = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    subjectId: '',
    topicId: '',
    type: 'mcq',
    difficulty: 'medium',
    questionText: '',
    marks: 10,
    options: [
      { id: '1', text: '', is_correct: false },
      { id: '2', text: '', is_correct: false },
    ],
    correctOptionId: '',
    conceptTags: '',
    expectedKeywords: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/academic/subjects');
        setSubjects(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleAddOption = () => {
    const newId = (formData.options.length + 1).toString();
    setFormData({
      ...formData,
      options: [...formData.options, { id: newId, text: '', is_correct: false }]
    });
  };

  const handleOptionChange = (id, text) => {
    setFormData({
      ...formData,
      options: formData.options.map(o => o.id === id ? { ...o, text } : o)
    });
  };

  const handleSetCorrect = (id) => {
    setFormData({
      ...formData,
      correctOptionId: id,
      options: formData.options.map(o => ({ ...o, is_correct: o.id === id }))
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.type === 'mcq' && !formData.correctOptionId) {
      return toast.error('Please select a correct option');
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        conceptTags: formData.conceptTags.split(',').map(t => t.trim()),
        expectedKeywords: formData.expectedKeywords.split(',').map(k => k.trim())
      };
      await axios.post('/questions', payload);
      toast.success('Question created successfully!');
      navigate('/teacher/questions');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create New Question</h1>
          <p className="text-slate-500">Add a new evaluation unit to the question bank.</p>
        </div>
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
              <select 
                required
                className="input-field"
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              >
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Question Type</label>
              <select 
                className="input-field"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="mcq">Multiple Choice (MCQ)</option>
                <option value="explanation">Explanation / Subjective</option>
                <option value="code">Code Implementation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Question Text</label>
            <textarea 
              required
              className="input-field min-h-[120px]"
              placeholder="Enter the question text here..."
              value={formData.questionText}
              onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty</label>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: d })}
                    className={`flex-1 py-2 rounded-lg border-2 font-bold capitalize transition-all ${
                      formData.difficulty === d ? 
                      (d === 'easy' ? 'border-success bg-success/5 text-success' : 
                       d === 'medium' ? 'border-warning bg-warning/5 text-warning' : 
                       'border-danger bg-danger/5 text-danger') : 
                      'border-slate-100 text-slate-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Marks</label>
              <input 
                type="number"
                required
                className="input-field"
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {formData.type === 'mcq' ? (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold">Options</h3>
              <button type="button" onClick={handleAddOption} className="text-primary text-sm font-bold flex items-center gap-1">
                <Plus size={16} /> Add Option
              </button>
            </div>
            <div className="space-y-4">
              {formData.options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-4">
                  <button 
                    type="button"
                    onClick={() => handleSetCorrect(option.id)}
                    className={`w-6 h-6 rounded-full border-2 shrink-0 transition-all ${
                      formData.correctOptionId === option.id ? 'border-success bg-success' : 'border-slate-200'
                    }`}
                  />
                  <input 
                    type="text"
                    required
                    placeholder={`Option ${index + 1}`}
                    className="input-field"
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, options: formData.options.filter(o => o.id !== option.id) })}
                    className="p-2 text-slate-300 hover:text-danger transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card space-y-6">
            <h3 className="font-bold">AI Evaluation Settings</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Expected Keywords (Comma separated)</label>
              <input 
                type="text"
                className="input-field"
                placeholder="e.g. recursion, stack, memory, base case"
                value={formData.expectedKeywords}
                onChange={(e) => setFormData({ ...formData, expectedKeywords: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Concept Tags (Comma separated)</label>
              <input 
                type="text"
                className="input-field"
                placeholder="e.g. DSA, Algorithms, Memory Management"
                value={formData.conceptTags}
                onChange={(e) => setFormData({ ...formData, conceptTags: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-4">
          <button type="button" onClick={() => navigate(-1)} className="btn bg-white text-slate-600 border border-slate-200">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary px-8">
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Question</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestion;
