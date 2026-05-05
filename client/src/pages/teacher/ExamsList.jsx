import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { 
  FileText, 
  Plus, 
  Search, 
  Calendar, 
  Users,
  MoreVertical,
  CheckCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

const TeacherExamsList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await axios.get('/exams'); // Need to implement this backend route
        setExams(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Examinations</h1>
          <p className="text-slate-500">Create and manage academic assessments.</p>
        </div>
        <Link to="/teacher/exams/create" className="btn btn-primary">
          <Plus size={18} />
          Create Exam
        </Link>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search exams..." 
              className="input-field pl-10 h-10 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Exam Details</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submissions</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{exam.title}</h4>
                        <p className="text-xs text-slate-500">{exam.subject?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <Calendar size={14} className="text-slate-400" />
                        {format(new Date(exam.startTime), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <Clock size={14} className="text-slate-400" />
                        {format(new Date(exam.startTime), 'hh:mm a')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      exam.isPublished ? 'bg-success/10 text-success' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {exam.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Users size={16} className="text-slate-400" />
                      0 / 45
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherExamsList;
