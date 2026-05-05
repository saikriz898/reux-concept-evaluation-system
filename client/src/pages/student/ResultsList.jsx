import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { 
  Trophy, 
  BarChart2, 
  ArrowRight,
  Search,
  CheckCircle2
} from 'lucide-react';

const ResultsList = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await axios.get('/attempts/results'); // Need to implement
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Evaluation Results</h1>
          <p className="text-slate-500">Review your performance and AI-generated feedback.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {results.map((result) => (
          <div key={result.id} className="card hover:shadow-md transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-success">
                  <Trophy size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{result.exam.title}</h3>
                  <p className="text-xs text-slate-500">{result.exam.subject.name} • Attempted on {new Date(result.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
                  <p className="text-2xl font-black text-slate-900">{result.totalScore}<span className="text-sm text-slate-400">/{result.totalMaxMarks}</span></p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-1 text-success font-bold">
                    <CheckCircle2 size={14} />
                    <span>Evaluated</span>
                  </div>
                </div>
                <Link to={`/student/results/${result.id}`} className="btn btn-outline border-slate-200 text-slate-600 group-hover:border-primary group-hover:text-primary">
                  View Analysis
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {results.length === 0 && !loading && (
          <div className="card py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <BarChart2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No results yet</h3>
            <p className="text-slate-500">Completed exam results will appear here after evaluation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsList;
