import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
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
  TrendingUp
} from 'lucide-react';
import { clsx } from 'clsx';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { label: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'My Exams', path: '/student/exams', icon: <FileText size={20} /> },
    { label: 'Results', path: '/student/results', icon: <BookOpen size={20} /> },
    { label: 'Profile', path: '/student/profile', icon: <User size={20} /> },
  ];

  const teacherLinks = [
    { label: 'Dashboard', path: '/teacher/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Question Bank', path: '/teacher/questions', icon: <BookOpen size={20} /> },
    { label: 'Exams', path: '/teacher/exams', icon: <FileText size={20} /> },
    { label: 'Reports', path: '/teacher/reports', icon: <TrendingUp size={20} /> },
  ];

  const links = user?.role === 'student' ? studentLinks : teacherLinks;

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
          <div className="text-sm font-medium text-slate-500">
            Welcome back, <span className="text-slate-900 font-bold">{user?.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-primary transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm">
              {user?.name?.charAt(0)}
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
