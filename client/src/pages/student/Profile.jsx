import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Camera,
  Save,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser({ ...user, ...formData });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Account Profile</h1>
        <p className="text-slate-500">Manage your personal information and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="card text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border-4 border-white shadow-lg overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={64} />
                )}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all">
                <Camera size={16} />
              </button>
            </div>
            <h3 className="text-xl font-bold">{user?.name}</h3>
            <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
          </div>

          <div className="card space-y-4">
            <h4 className="font-bold text-sm text-slate-900">Account Security</h4>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Shield size={16} />
                <span>Two-Factor Auth</span>
              </div>
              <span className="text-xs font-bold text-danger uppercase tracking-wider">Off</span>
            </div>
            <button className="w-full btn btn-outline py-2 text-xs">Change Password</button>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="card space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    className="input-field pl-10" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    disabled
                    className="input-field pl-10 bg-slate-50 cursor-not-allowed" 
                    value={formData.email}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    className="input-field pl-10" 
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button type="submit" disabled={loading} className="btn btn-primary px-8">
                {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
