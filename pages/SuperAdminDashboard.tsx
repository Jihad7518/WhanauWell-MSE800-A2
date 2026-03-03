
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Users, 
  Building2, 
  Calendar, 
  Activity, 
  Search, 
  Copy, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Organisation } from '../types';

const SuperAdminDashboard: React.FC = () => {
  const [organisations, setOrganisations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newOrg, setNewOrg] = useState({ name: '', code: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [orgsRes, statsRes] = await Promise.all([
        fetch('/api/admin/organisations', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
        }),
        fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
        })
      ]);
      
      const orgsData = await orgsRes.json();
      const statsData = await statsRes.json();
      
      if (orgsData.success) setOrganisations(orgsData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/admin/organisations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}`
        },
        body: JSON.stringify(newOrg)
      });
      
      const data = await response.json();
      if (data.success) {
        setSuccess(`Organisation "${newOrg.name}" created successfully!`);
        setNewOrg({ name: '', code: '' });
        setShowModal(false);
        fetchData();
      } else {
        setError(data.message || 'Failed to create organisation');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(text);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading Platform Command Centre...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
            <ShieldCheck className="w-8 h-8 text-indigo-600 mr-3" />
            Platform Command Centre
          </h1>
          <p className="text-slate-500">Manage global organisations and platform health.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Organisation</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Organisations', value: stats?.totalOrgs, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Programmes', value: stats?.totalProgrammes, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Assessments', value: stats?.totalAssessments, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{stat.value || 0}</p>
          </div>
        ))}
      </div>

      {/* Organisations Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Registered Organisations</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter orgs..." 
              className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Organisation</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Invite Code</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Members</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Programmes</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {organisations.map((org) => (
                <tr key={org._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-3">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="font-bold text-slate-900">{org.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => copyToClipboard(org.code)}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-lg group hover:bg-indigo-50 transition-all"
                    >
                      <code className="text-xs font-mono font-bold text-slate-600 group-hover:text-indigo-600">{org.code}</code>
                      {copySuccess === org.code ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400 group-hover:text-indigo-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-600">{org.userCount} Users</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-600">{org.programmeCount} Programmes</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-md">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Organisation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 p-8 text-white">
              <h2 className="text-2xl font-bold">Onboard Organisation</h2>
              <p className="text-indigo-100 text-sm mt-1">Create a new hub and generate an invite code.</p>
            </div>
            
            <form onSubmit={handleCreateOrg} className="p-8 space-y-6">
              {error && (
                <div className="p-4 bg-rose-50 text-rose-700 rounded-xl flex items-center text-sm font-medium">
                  <AlertCircle className="w-4 h-4 mr-2" /> {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Organisation Name</label>
                <input 
                  required 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="e.g. Waitaha Health Trust"
                  value={newOrg.name}
                  onChange={e => setNewOrg({...newOrg, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Invite Code (Unique)</label>
                <input 
                  required 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-mono" 
                  placeholder="e.g. WAITAHA-2024"
                  value={newOrg.code}
                  onChange={e => setNewOrg({...newOrg, code: e.target.value.toUpperCase().replace(/\s+/g, '-')})}
                />
                <p className="text-[10px] text-slate-400 italic">This code will be used by members to register.</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Create Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
