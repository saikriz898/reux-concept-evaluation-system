import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { 
  FileText, 
  Clock, 
  Calendar,
  AlertCircle,
  Play,
  CheckCircle,
  Eye
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNotificationStore } from '../../store/notificationStore';

const ExamsList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await axios.get('/exams/student'); // Need to implement this backend route
        setExams(data);
        if (data.length > 0) {
          addNotification({
            type: 'success',
            title: 'Exams Updated',
            message: `You have ${data.length} exams assigned.`,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Assigned Exams</h1>
        <p className="text-slate-500">View and attempt your scheduled academic evaluations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((exam) => (
          <div key={exam.id} className="card group hover:border-primary transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <FileText size={24} />
              </div>
                {exam.attemptStatus ? (
                  <span className={clsx(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    exam.attemptStatus === 'evaluated' ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  )}>
                    {exam.attemptStatus}
                  </span>
                ) : (
                  <span className={clsx(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    exam.status === 'ongoing' ? 'bg-success/10 text-success' : 'bg-slate-100 text-slate-500'
                  )}>
                    {exam.status}
                  </span>
                )}
            </div>

            <h3 className="text-xl font-bold mb-2">{exam.title}</h3>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2">{exam.instructions}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock size={16} />
                <span className="text-xs font-medium">{exam.durationMinutes} Mins</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar size={16} />
                <span className="text-xs font-medium">{new Date(exam.startTime).toLocaleDateString()}</span>
              </div>
            </div>

            {exam.attemptStatus === 'evaluated' ? (
              <Link to={`/student/results/${exam.attemptId}`} className="btn btn-outline w-full">
                <Eye size={18} />
                View Result
              </Link>
            ) : exam.attemptStatus === 'started' ? (
              <Link to={`/student/exam/${exam.id}`} className="btn btn-warning w-full">
                <Play size={18} />
                Resume Attempt
              </Link>
            ) : (
              <Link 
                to={`/student/exam/${exam.id}`} 
                className={clsx(
                  "btn w-full",
                  exam.status === 'ongoing' ? 'btn-primary' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                )}
                onClick={(e) => exam.status !== 'ongoing' && e.preventDefault()}
              >
                <Play size={18} />
                Start Attempt
              </Link>
            )}
          </div>
        ))}
        
        {exams.length === 0 && !loading && (
          <div className="col-span-full card py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No exams assigned</h3>
            <p className="text-slate-500">You don't have any pending evaluations at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamsList;
