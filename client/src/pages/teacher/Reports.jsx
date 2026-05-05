import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { 
  FileText, 
  Search, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Filter,
  CheckCircle,
  Clock,
  ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

const Reports = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attemptsLoading, setAttemptsLoading] = useState(false);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await axios.get('/exams');
        setExams(data);
        if (data.length > 0) {
          setSelectedExam(data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      const fetchAttempts = async () => {
        setAttemptsLoading(true);
        try {
          const { data } = await axios.get(`/attempts/exam/${selectedExam.id}`);
          setAttempts(data);
        } catch (err) {
          console.error(err);
        } finally {
          setAttemptsLoading(false);
        }
      };
      fetchAttempts();
    }
  }, [selectedExam]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading exams...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Academic Reports</h1>
          <p className="text-slate-500">Analyze student performance and evaluation insights.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Exams List Sidebar */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select Examination</h3>
          <div className="space-y-2">
            {exams.map((exam) => (
              <button
                key={exam.id}
                onClick={() => setSelectedExam(exam)}
                className={clsx(
                  "w-full text-left p-4 rounded-xl border-2 transition-all group",
                  selectedExam?.id === exam.id 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-slate-100 bg-white hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} className={selectedExam?.id === exam.id ? "text-primary" : "text-slate-400"} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{exam.title}</p>
                    <p className="text-[10px] opacity-60 uppercase">{exam.subject?.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Reports Content */}
        <div className="lg:col-span-3 space-y-6">
          {selectedExam ? (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Total Submissions</p>
                  <p className="text-3xl font-black text-slate-900">{attempts.length}</p>
                </div>
                <div className="card">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Class Average</p>
                  <p className="text-3xl font-black text-primary">
                    {attempts.length > 0 
                      ? Math.round((attempts.reduce((acc, a) => acc + a.totalScore, 0) / attempts.reduce((acc, a) => acc + a.totalMaxMarks, 0)) * 100)
                      : 0}%
                  </p>
                </div>
                <div className="card">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Highest Score</p>
                  <p className="text-3xl font-black text-success">
                    {attempts.length > 0 ? Math.max(...attempts.map(a => a.totalScore)) : 0}
                    <span className="text-sm text-slate-400">/{selectedExam.totalMarks}</span>
                  </p>
                </div>
              </div>

              {/* Submissions Table */}
              <div className="card p-0 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-bold text-slate-900">Student Submissions</h3>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200">
                      <Filter size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200">
                      <TrendingUp size={18} />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Student</th>
                        <th className="px-6 py-4">Submission Time</th>
                        <th className="px-6 py-4">Score</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attemptsLoading ? (
                        <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">Loading attempts...</td></tr>
                      ) : attempts.length === 0 ? (
                        <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">No submissions yet for this exam.</td></tr>
                      ) : (
                        attempts.map((attempt) => (
                          <tr key={attempt.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs text-slate-600">
                                  {attempt.student.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-sm text-slate-900">{attempt.student.name}</p>
                                  <p className="text-xs text-slate-500">{attempt.student.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Clock size={14} className="text-slate-400" />
                                {attempt.submittedAt ? format(new Date(attempt.submittedAt), 'MMM dd, hh:mm a') : 'Not submitted'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1 font-bold text-slate-900">
                                {attempt.totalScore}
                                <span className="text-[10px] text-slate-400 font-medium">/{attempt.totalMaxMarks}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={clsx(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                attempt.status === 'evaluated' ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                              )}>
                                {attempt.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link 
                                to={`/student/results/${attempt.id}`} 
                                className="p-2 text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <ArrowRight size={20} />
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="card py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <FileText size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Select an exam</h3>
              <p className="text-slate-500">Choose an examination from the sidebar to view detailed performance reports.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
