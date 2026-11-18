import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, UtensilsCrossed, AlertCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('expired') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    sessionExpired ? 'Your session expired. Please log in again.' : null
  );

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/login', {
        email: email.trim(),
        password,
      });

      if (res.data?.success && res.data?.token && res.data?.admin) {
        login(res.data.token, res.data.admin);
        navigate('/admin/dashboard', { replace: true });
      } else {
        setErrorMessage(res.data?.message || 'Authentication failed.');
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      const msg = err.response?.data?.message || 'Invalid credentials or login rate-limit reached. Please verify and try again.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-deepbrown-950 text-saffron-500 flex items-center justify-center mx-auto shadow-xl border-2 border-saffron-600">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <h1 className="font-serif font-black text-2xl sm:text-3xl text-deepbrown-950">
          SHREE JI FAST FOOD
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-saffron-800 uppercase tracking-wider">
          Authorized Staff & Admin Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-cream-300 space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-deepbrown-800 bg-cream-100 p-2.5 rounded-xl border border-cream-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Secure Admin Authentication Session</span>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-300 text-red-800 p-3.5 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-deepbrown-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@shreejifastfood.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-sm text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-deepbrown-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-sm text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-deepbrown-muted hover:text-deepbrown-900"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-saffron-600 hover:bg-saffron-700 text-white py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-deepbrown-muted border-t border-cream-200">
            <span className="block">Shree Ji Fast Food Management System</span>
            <span className="text-[11px] text-cream-500 block mt-1">
              Protected by rate limiting & encrypted session cookies.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
