import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNotificationStore } from '../../store/notificationStore';
import { 
  Trophy, 
  Clock, 
  Target, 
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/dashboard/student');
        setStats(data);
        
        addNotification({
          type: 'info',
          title: 'Welcome Back!',
          message: 'Check your latest AI evaluation results in the dashboard.',
          duration: 3000
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  const radarData = [
    { subject: 'Understanding', A: 78, fullMark: 100 },
    { subject: 'Reasoning', A: 65, fullMark: 100 },
    { subject: 'Depth', A: 45, fullMark: 100 },
    { subject: 'Correctness', A: 90, fullMark: 100 },
    { subject: 'Originality', A: 55, fullMark: 100 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p className="text-slate-500">Track your academic progress and AI evaluations.</p>
        </div>
        <button className="btn btn-primary">
          View Upcoming Exams
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Exams Taken</p>
            <p className="text-2xl font-bold">{stats?.totalExamsAttempted || 0}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-success">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Average Score</p>
            <p className="text-2xl font-bold">{stats?.averageScore || 0}%</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center text-warning">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Time Spent</p>
            <p className="text-2xl font-bold">12h 45m</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-danger/10 rounded-xl flex items-center justify-center text-danger">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Weak Concepts</p>
            <p className="text-2xl font-bold">{stats?.weakConcepts?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Performance Chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Performance Trend</h3>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 outline-none">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: 'Jan', score: 65 },
                { name: 'Feb', score: 72 },
                { name: 'Mar', score: 68 },
                { name: 'Apr', score: 85 },
                { name: 'May', score: 78 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#4F46E5" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Evaluation Breakdown */}
        <div className="card">
          <h3 className="text-lg font-bold mb-8">Conceptual Radar</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 10}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Recent Attempts</h3>
            <button className="text-primary text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {stats?.recentAttempts?.map((attempt, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{attempt.exam.title}</h4>
                    <p className="text-xs text-slate-500">{new Date(attempt.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">78/100</p>
                    <p className="text-[10px] text-success font-bold uppercase tracking-wider">Evaluated</p>
                  </div>
                  <button className="p-2 text-slate-400 group-hover:text-primary transition-colors">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Concepts */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-danger flex items-center gap-2">
              <Target size={20} />
              Weak Concepts
            </h3>
            <span className="px-2 py-1 bg-danger/10 text-danger text-[10px] font-bold rounded uppercase">Priority</span>
          </div>
          <div className="space-y-4">
            {stats?.weakConcepts?.map((concept, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">{concept.conceptTag}</span>
                  <span className="text-danger font-bold">{concept.avgScore}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-danger transition-all duration-1000" 
                    style={{ width: `${concept.avgScore}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <div className="pt-4">
              <button className="w-full btn btn-outline py-2 text-sm">
                Get Improvement Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
