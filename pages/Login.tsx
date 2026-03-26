
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, UserRole } from '../types';
import { ShieldCheck, ChevronRight, UserPlus, LogIn, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User, organisation: any, token?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(location.pathname === '/auth/register');
  
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/app/dashboard';

  useEffect(() => {
    setIsRegistering(location.pathname === '/auth/register');
  }, [location.pathname]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [orgCode, setOrgCode] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [loginType, setLoginType] = useState<'MEMBER' | 'ADMIN'>('MEMBER');
  const [showAdminField, setShowAdminField] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [allowPublic, setAllowPublic] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/public/settings');
        const data = await res.json();
        if (data.success) {
          setAllowPublic(data.data.allowPublicRegistration);
        }
      } catch (e) {
        console.error("Settings fetch failed", e);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    // For admin login, we don't strictly need orgCode if the email is unique globally (like Super Admin)
    // but the backend checks it if provided.
    const payload = isRegistering 
      ? { name, email, password, orgCode: loginType === 'MEMBER' ? orgCode : orgCode, adminCode }
      : { email, password, orgCode: loginType === 'MEMBER' ? orgCode : undefined };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (data.success) {
        if (isRegistering) {
          setIsRegistering(false);
          navigate('/auth/login');
          setError('Registration successful! Please login.');
        } else {
          try {
            onLogin(data.user, data.organisation, data.token);
            
            // Redirect Super Admins to the Command Centre by default
            const finalRedirect = data.user.role === 'SUPER_ADMIN' && redirectPath === '/app/dashboard' 
              ? '/app/admin' 
              : redirectPath;
              
            navigate(finalRedirect);
          } catch (callbackError) {
            console.error('Login callback error:', callbackError);
            setError('Error finalizing login. Please try again.');
          }
        }
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      if (error.name === 'AbortError') {
        setError('Login timed out. The server might be busy. Please try again.');
      } else {
        setError('Connection error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 relative">
      <Link to="/" className="absolute top-8 left-8 flex items-center text-slate-500 font-bold hover:text-indigo-600 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Website
      </Link>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">WhānauWell</h1>
          <p className="mt-2 text-indigo-100">Community Wellbeing & Stress Insight Platform</p>
        </div>

        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setLoginType('MEMBER')}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${loginType === 'MEMBER' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Member {isRegistering ? 'Signup' : 'Login'}
          </button>
          <button 
            onClick={() => setLoginType('ADMIN')}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${loginType === 'ADMIN' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Admin {isRegistering ? 'Signup' : 'Login'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className={`p-3 rounded-lg text-sm font-medium ${error.includes('successful') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {error}
            </div>
          )}

          {isRegistering && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="name@organisation.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {loginType === 'MEMBER' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 flex justify-between">
                Organisation Invite Code
                <span className={`text-[10px] font-bold uppercase ${allowPublic ? 'text-slate-400' : 'text-indigo-500'}`}>
                  {allowPublic ? 'Optional' : 'Required'}
                </span>
              </label>
              <input
                type="text"
                required={!allowPublic}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. WHANAU-01"
                value={orgCode}
                onChange={(e) => setOrgCode(e.target.value)}
              />
              <p className="text-[10px] text-slate-400 mt-1 italic">
                {allowPublic 
                  ? "Leave blank to join the global community, or enter your hub's code."
                  : "Ask your coordinator for your community's unique code."}
              </p>
            </div>
          )}

          {isRegistering && loginType === 'ADMIN' && (
            <div className="pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-600 mb-1">Organisation Admin Invite Code</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  placeholder="e.g. ADM-XXXX-XXXX"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                />
                <p className="text-[9px] text-slate-400 mt-1">
                  Enter the unique security code provided when your organisation was approved.
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-indigo-200"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{isRegistering ? 'Create Account' : 'Continue to Dashboard'}</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
          
          <div className="pt-4 text-center">
            <button 
              type="button"
              onClick={() => {
                const newPath = isRegistering ? '/auth/login' : '/auth/register';
                navigate(`${newPath}${location.search}`);
                setError('');
              }}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center justify-center mx-auto space-x-1"
            >
              {isRegistering ? (
                <><LogIn className="w-4 h-4" /> <span>Already have an account? Login</span></>
              ) : (
                <><UserPlus className="w-4 h-4" /> <span>Need an account? Register with invite code</span></>
              )}
            </button>
          </div>

          <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-semibold pt-4">
            Enterprise Grade Isolation • Data Sovereignty
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
