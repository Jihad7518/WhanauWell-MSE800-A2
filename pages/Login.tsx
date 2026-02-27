
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, ChevronRight, UserPlus, LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User, organisation: any, token?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [orgCode, setOrgCode] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showAdminField, setShowAdminField] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegistering 
      ? { name, email, password, orgCode, adminCode }
      : { email, password, orgCode };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (isRegistering) {
          setIsRegistering(false);
          setError('Registration successful! Please login.');
        } else {
          onLogin(data.user, data.organisation, data.token);
        }
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">WhānauWell</h1>
          <p className="mt-2 text-indigo-100">Community Wellbeing & Stress Insight Platform</p>
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

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 flex justify-between">
              Organisation Invite Code
              <span className="text-[10px] text-indigo-500 font-bold uppercase">Required</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="e.g. WHANAU-01"
              value={orgCode}
              onChange={(e) => setOrgCode(e.target.value)}
            />
            <p className="text-[10px] text-slate-400 mt-1 italic">
              Ask your coordinator for your community's unique code. (e.g. WHANAU-01)
            </p>
          </div>

          {isRegistering && (
            <div className="pt-2">
              <button 
                type="button"
                onClick={() => setShowAdminField(!showAdminField)}
                className="text-[10px] text-slate-500 hover:text-indigo-600 font-bold uppercase tracking-wider flex items-center"
              >
                {showAdminField ? '− Hide Admin Options' : '+ Register as Admin/Coordinator?'}
              </button>
              
              {showAdminField && (
                <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Admin Security Code</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="Enter admin secret"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                  />
                  <p className="text-[9px] text-slate-400 mt-1">
                    Only required for Organisation Admins. Leave blank for Member access.
                  </p>
                </div>
              )}
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
                setIsRegistering(!isRegistering);
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
