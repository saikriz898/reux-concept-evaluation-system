import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import StudentDashboard from './pages/student/Dashboard';
import ExamsList from './pages/student/ExamsList';
import ResultsList from './pages/student/ResultsList';
import ResultDetail from './pages/student/ResultDetail';
import ProfilePage from './pages/student/Profile';
import TeacherDashboard from './pages/teacher/Dashboard';
import QuestionBank from './pages/teacher/QuestionBank';
import CreateQuestion from './pages/teacher/CreateQuestion';
import TeacherExamsList from './pages/teacher/ExamsList';
import CreateExam from './pages/teacher/CreateExam';
import ExamAttempt from './pages/student/ExamAttempt';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="exams" element={<ExamsList />} />
          <Route path="results" element={<ResultsList />} />
          <Route path="results/:id" element={<ResultDetail />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="exam/:id" element={<ExamAttempt />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="questions" element={<QuestionBank />} />
          <Route path="questions/create" element={<CreateQuestion />} />
          <Route path="exams" element={<TeacherExamsList />} />
          <Route path="exams/create" element={<CreateExam />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
