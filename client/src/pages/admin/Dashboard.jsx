import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { 
  Users, 
  Shield, 
  Book, 
  Settings, 
  AlertCircle, 
  CheckCircle,
  MoreVertical,
  Search,
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExams: 0,
    systemHealth: 'Optimal',
    activeSessions: 0
  });

  useEffect(() => {
    // In a real app, fetch from backend
    setUsers([
      { id: 1, name: 'Dr. Smith', email: 'smith@college.edu', role: 'teacher', status: 'active' },
      { id: 2, name: 'John Doe', email: 'john@student.com', role: 'student', status: 'active' },
      { id: 3, name: 'Admin User', email: 'admin@reux.app', role: 'admin', status: 'active' },
    ]);
    setStats({
      totalUsers: 1250,
      totalExams: 84,
      systemHealth: 'Optimal',
      activeSessions: 12
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">System Administration</h1>
        <p className="text-slate-500">Manage global settings, users, and platform integrity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <Users className="text-primary mb-4" size={24} />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Users</p>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="card">
          <Book className="text-success mb-4" size={24} />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Exams</p>
          <p className="text-2xl font-bold">{stats.totalExams}</p>
        </div>
        <div className="card">
          <CheckCircle className="text-indigo-600 mb-4" size={24} />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Health</p>
          <p className="text-2xl font-bold text-success">{stats.systemHealth}</p>
        </div>
        <div className="card">
          <AlertCircle className="text-warning mb-4" size={24} />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Sessions</p>
          <p className="text-2xl font-bold">{stats.activeSessions}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold">User Management</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 ring-primary/20 transition-all outline-none"
                />
              </div>
              <button className="btn btn-primary py-2 px-4 text-xs">
                <UserPlus size={16} />
                Add User
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "px-2 py-1 rounded text-[10px] font-bold uppercase",
                        user.role === 'admin' ? "bg-indigo-100 text-indigo-600" :
                        user.role === 'teacher' ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-success" />
                        <span className="text-xs text-slate-600 capitalize">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-900 p-1"><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Shield size={20} className="text-primary" />
              Security Logs
            </h3>
            <div className="space-y-4">
              {[
                { event: 'Admin Login', time: '2 mins ago', ip: '192.168.1.1' },
                { event: 'Bulk CSV Import', time: '1 hour ago', ip: '10.0.0.42' },
                { event: 'Password Reset', time: '3 hours ago', ip: '172.16.0.5' }
              ].map((log, i) => (
                <div key={i} className="text-xs border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between font-bold mb-1">
                    <span>{log.event}</span>
                    <span className="text-slate-400">{log.time}</span>
                  </div>
                  <p className="text-slate-400 font-mono">IP: {log.ip}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors">
              View All Logs
            </button>
          </div>

          <div className="card bg-slate-900 text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Settings size={20} className="text-warning" />
              Quick Config
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Maintenance Mode</span>
                <div className="w-10 h-5 bg-slate-700 rounded-full relative">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-slate-400 rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Allow Self-Registration</span>
                <div className="w-10 h-5 bg-success/20 rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-success rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const clsx = (...classes) => classes.filter(Boolean).join(' ');

export default AdminDashboard;
