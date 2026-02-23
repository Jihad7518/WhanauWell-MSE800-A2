
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, ChevronRight } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User, organisation: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [orgCode, setOrgCode] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.MEMBER);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication logic
    const mockOrg = { id: 'org_123', name: 'Waitaha Health Trust', code: orgCode || 'WHANAU-01' };
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0].toUpperCase(),
      email,
      role,
      organisationId: mockOrg.id
    };
    
    onLogin(mockUser, mockOrg);
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

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
            <label className="block text-sm font-semibold text-slate-700 mb-1">Organisation Code</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="e.g. WHANAU-01"
              value={orgCode}
              onChange={(e) => setOrgCode(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Select Role (Demo Mode)</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value={UserRole.MEMBER}>Member (Self-Check)</option>
              <option value={UserRole.COORDINATOR}>Coordinator (Programs)</option>
              <option value={UserRole.ORG_ADMIN}>Organisation Admin (Analytics)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-indigo-200"
          >
            <span>Continue to Dashboard</span>
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <p className="text-center text-xs text-slate-400 uppercase tracking-widest font-semibold pt-4">
            Enterprise Grade Isolation • Data Sovereignty
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
