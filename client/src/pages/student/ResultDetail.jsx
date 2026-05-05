import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileText,
  Download,
  Share2
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';

const ResultDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { data } = await axios.get(`/attempts/${id}`); // Need to implement
        setAttempt(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  const radarData = [
    { subject: 'Understanding', A: 85 },
    { subject: 'Reasoning', A: 70 },
    { subject: 'Depth', A: 60 },
    { subject: 'Correctness', A: 90 },
    { subject: 'Originality', A: 50 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary font-semibold transition-colors">
          <ChevronLeft size={20} />
          Back to Results
        </button>
        <div className="flex gap-3">
          <button className="btn btn-outline border-slate-200">
            <Share2 size={18} />
            Share
          </button>
          <button className="btn btn-primary">
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Summary Card */}
          <div className="card bg-slate-900 text-white border-none overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-sm opacity-60 font-bold uppercase tracking-widest mb-2">Final Evaluation</p>
              <h1 className="text-3xl font-black mb-6">{attempt.exam.title}</h1>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-xs opacity-60 mb-1">Score Obtained</p>
                  <p className="text-3xl font-bold">78<span className="text-sm opacity-40">/100</span></p>
                </div>
                <div>
                  <p className="text-xs opacity-60 mb-1">Grade</p>
                  <p className="text-3xl font-bold text-success">A</p>
                </div>
                <div>
                  <p className="text-xs opacity-60 mb-1">Percentile</p>
                  <p className="text-3xl font-bold">84th</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
          </div>

          {/* Detailed Responses */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Question-wise Analysis</h3>
            {attempt.responses.map((resp, i) => (
              <div key={resp.id} className="card space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600">{i + 1}</span>
                    <span className="text-sm font-bold text-primary uppercase">{resp.responseType}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-slate-900">{resp.evaluationResult?.overallScore}</span>
                    <span className="text-sm text-slate-400">/{resp.evaluationResult?.maxMarks}</span>
                  </div>
                </div>

                <p className="font-bold text-slate-800 leading-relaxed">{resp.question.questionText}</p>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-3">Your Response</p>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {resp.explanationText || resp.codeText || `Selected: ${resp.selectedOptionId}`}
                  </p>
                </div>

                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <p className="text-xs font-bold text-primary uppercase mb-3 flex items-center gap-2">
                    <AlertCircle size={14} />
                    AI Insights & Feedback
                  </p>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {resp.evaluationResult?.feedback}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {/* Radar Chart */}
          <div className="card">
            <h3 className="font-bold text-slate-900 mb-6">Skill Profile</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 10}} />
                  <Radar
                    name="Student"
                    dataKey="A"
                    stroke="#4F46E5"
                    fill="#4F46E5"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 text-center mt-4">
              Based on AI analysis of your reasoning and depth in subjective answers.
            </p>
          </div>

          {/* Improvement Tips */}
          <div className="card space-y-6">
            <h3 className="font-bold text-slate-900">Improvement Areas</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-warning/10 rounded-lg flex items-center justify-center text-warning">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Deepen Concept Analysis</h4>
                  <p className="text-xs text-slate-500 mt-1">Try to explain 'Why' instead of just 'How' in your subjective answers.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-success/10 rounded-lg flex items-center justify-center text-success">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Great Originality</h4>
                  <p className="text-xs text-slate-500 mt-1">Your code examples were unique and showed genuine thought.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDetail;
