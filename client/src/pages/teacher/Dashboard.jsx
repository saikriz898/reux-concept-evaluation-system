import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { 
  Users, 
  FileText, 
  HelpCircle, 
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const TeacherDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/dashboard/teacher');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = [
    { name: 'Unit 1', score: 65 },
    { name: 'Unit 2', score: 42 },
    { name: 'Unit 3', score: 78 },
    { name: 'Unit 4', score: 55 },
    { name: 'Unit 5', score: 82 },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teacher Overview</h1>
          <p className="text-slate-500">Manage your students, questions, and evaluations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-outline">
            Import Questions
          </button>
          <button className="btn btn-primary">
            <Plus size={20} />
            Create Exam
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-primary text-white border-none relative overflow-hidden group">
          <div className="relative z-10">
            <Users className="mb-4 opacity-80" size={32} />
            <p className="text-sm font-medium opacity-80">Total Enrolled Students</p>
            <p className="text-4xl font-bold">{stats?.totalStudents || 0}</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="card">
          <FileText className="mb-4 text-secondary" size={32} />
          <p className="text-sm font-medium text-slate-500">Active Exams</p>
          <p className="text-4xl font-bold">{stats?.totalExams || 0}</p>
        </div>
        <div className="card">
          <HelpCircle className="mb-4 text-success" size={32} />
          <p className="text-sm font-medium text-slate-500">Question Bank Size</p>
          <p className="text-4xl font-bold">{stats?.totalQuestions || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Topic Mastery Chart */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-bold mb-8">Class Average by Topic</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score < 50 ? '#EF4444' : '#4F46E5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="card">
          <h3 className="text-lg font-bold mb-6">Pending Work</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-danger/5 border border-danger/10">
              <p className="text-sm font-bold text-danger mb-1">Manual Review Needed</p>
              <p className="text-xs text-slate-600 mb-3">3 students flagged for high similarity in Unit 2 Midterm.</p>
              <button className="text-xs font-bold text-danger flex items-center gap-1 hover:underline">
                Review Now <ArrowRight size={14} />
              </button>
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-sm font-bold text-primary mb-1">Results to Publish</p>
              <p className="text-xs text-slate-600 mb-3">Unit 1 Quiz evaluations complete for 45 students.</p>
              <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                View & Publish <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
