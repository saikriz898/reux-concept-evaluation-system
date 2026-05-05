import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Loader2, RefreshCw } from 'lucide-react';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) navigate('/register');
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) return toast.error('Please enter full OTP');
    
    setLoading(true);
    try {
      await axios.post('/auth/verify-otp', { email, token: otpValue, type: 'email_verify' });
      toast.success('Email verified successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Verify your email</h2>
        <p className="text-slate-500 mb-8">We've sent a 6-digit code to <span className="font-bold text-slate-900">{email}</span></p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength={1}
                className="w-12 h-14 border-2 border-slate-100 rounded-xl text-center text-xl font-bold focus:border-primary outline-none transition-all"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
              />
            ))}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 text-lg">
            {loading ? <Loader2 className="animate-spin" /> : 'Verify Account'}
          </button>
        </form>

        <div className="mt-8 text-sm text-slate-500">
          Didn't receive the code?{' '}
          {timer > 0 ? (
            <span className="text-slate-400">Resend in {timer}s</span>
          ) : (
            <button className="text-primary font-bold hover:underline flex items-center gap-1 mx-auto mt-2">
              <RefreshCw size={14} /> Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
