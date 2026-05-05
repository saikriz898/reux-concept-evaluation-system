import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Dumbbell,
  MessageSquare,
  ShieldAlert,
  Server,
  Search,
  HelpCircle,
  Users
} from 'lucide-react';
import { clsx } from 'clsx';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, removeNotification } = useNotificationStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { label: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'My Exams', path: '/student/exams', icon: <FileText size={20} /> },
    { label: 'Practice', path: '/student/practice', icon: <Dumbbell size={20} /> },
    { label: 'Doubt Solver', path: '/student/chat', icon: <MessageSquare size={20} className="text-primary" /> },
    { label: 'Results', path: '/student/results', icon: <BookOpen size={20} /> },
    { label: 'MindBridge AI', path: '/student/ai-assistance', icon: <Sparkles size={20} className="text-warning" /> },
    { label: 'Profile', path: '/student/profile', icon: <User size={20} /> },
  ];

  const teacherLinks = [
    { label: 'Dashboard', path: '/teacher/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'AI Generator', path: '/teacher/ai-generator', icon: <Sparkles size={20} className="text-primary" /> },
    { label: 'Question Bank', path: '/teacher/questions', icon: <HelpCircle size={20} /> },
    { label: 'My Exams', path: '/teacher/exams', icon: <FileText size={20} /> },
    { label: 'Reports', path: '/teacher/reports', icon: <TrendingUp size={20} /> },
  ];

  const adminLinks = [
    { label: 'Admin Panel', path: '/admin/dashboard', icon: <ShieldAlert size={20} className="text-danger" /> },
    { label: 'System Logs', path: '/admin/logs', icon: <Server size={20} /> },
    { label: 'User Management', path: '/admin/users', icon: <Users size={20} /> },
  ];

  const links = user?.role === 'teacher' ? teacherLinks : 
    user?.role === 'admin' ? [...adminLinks, ...teacherLinks] : 
    studentLinks;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={clsx(
        "bg-sidebar text-white transition-all duration-300 flex flex-col fixed h-full z-40",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className={clsx("flex items-center gap-3", !sidebarOpen && "hidden")}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold">R</div>
            <span className="text-xl font-bold tracking-tight">REUX</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={clsx(
                "sidebar-link",
                location.pathname === link.path && "active",
                !sidebarOpen && "justify-center px-0"
              )}
            >
              {link.icon}
              {sidebarOpen && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className={clsx(
              "flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white transition-colors",
              !sidebarOpen && "justify-center px-0"
            )}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={clsx(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "ml-64" : "ml-20"
      )}>
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-8">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm w-64 focus:w-80 focus:ring-2 ring-primary/20 transition-all outline-none"
              />
            </div>
            <div className="text-sm font-medium text-slate-500 border-l border-slate-100 pl-8">
              Welcome back, <span className="text-slate-900 font-bold">{user?.name || 'User not found'}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all flex items-center justify-center relative group"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full border-2 border-white group-hover:scale-125 transition-transform" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                      <h4 className="font-bold text-sm">Notifications</h4>
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                        {notifications.length} New
                      </span>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell size={32} className="mx-auto mb-2 text-slate-200" />
                          <p className="text-xs text-slate-400">No new notifications</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-50">
                          {notifications.map((n) => (
                            <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors group relative">
                              <div className="flex gap-3">
                                <div className={clsx(
                                  "w-2 h-2 rounded-full mt-1.5 shrink-0",
                                  n.type === 'error' ? "bg-red-500" : "bg-primary"
                                )}></div>
                                <div>
                                  <p className="text-xs font-bold text-slate-900">{n.title}</p>
                                  <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                                  <p className="text-[9px] text-slate-400 mt-1 uppercase font-medium">
                                    {formatDistanceToNow(new Date(n.id), { addSuffix: true })}
                                  </p>
                                </div>
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(n.id);
                                }}
                                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white rounded"
                              >
                                <X size={12} className="text-slate-400" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                      <button className="text-[10px] font-bold text-primary hover:underline">
                        Mark all as read
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm">
              {user?.name?.charAt(0) || '?'}
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
