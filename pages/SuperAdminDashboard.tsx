
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
  Loader2,
  LayoutDashboard,
  ArrowUpRight,
  Filter,
  MoreVertical,
  Mail,
  MapPin,
  Globe,
  Lock,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const SuperAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'organisations' | 'users' | 'programmes'>('overview');
  const [organisations, setOrganisations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newOrg, setNewOrg] = useState({ name: '', code: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [orgsRes, statsRes, usersRes, progsRes] = await Promise.all([
        fetch('/api/admin/organisations', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
        }),
        fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
        }),
        fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
        }),
        fetch('/api/admin/programmes', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
        })
      ]);
      
      const orgsData = await orgsRes.json();
      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const progsData = await progsRes.json();
      
      if (orgsData.success) setOrganisations(orgsData.data);
      if (statsData.success) setStats(statsData.data);
      if (usersData.success) setUsers(usersData.data);
      if (progsData.success) setProgrammes(progsData.data);
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
        <p className="text-slate-500 font-medium">Initializing Platform Command Centre...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Command Centre</h1>
            <div className="flex items-center space-x-2 text-slate-400 text-sm font-medium">
              <Globe className="w-3 h-3" />
              <span>Global Platform Management</span>
              <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
              <span className="text-emerald-500">Live Status: Healthy</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Platform Logs</span>
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Onboard Hub</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'organisations', label: 'Organisations', icon: Building2 },
          { id: 'users', label: 'Global Users', icon: Users },
          { id: 'programmes', label: 'Global Programmes', icon: Calendar },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Platform Users', value: stats?.totalUsers, sub: '+12% this month', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Active Communities', value: stats?.totalOrgs, sub: 'Across 4 regions', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Live Programmes', value: stats?.totalProgrammes, sub: '84% participation', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Wellbeing Checks', value: stats?.totalAssessments, sub: 'Daily average: 142', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:border-indigo-200 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-black text-slate-900 mt-1">{stat.value || 0}</p>
                <p className="text-xs text-slate-400 mt-2 font-medium">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Platform Activity Chart */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Platform Growth</h3>
                  <p className="text-slate-400 text-sm font-medium">User registration and engagement trends</p>
                </div>
                <select className="bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 px-4 py-2 outline-none">
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: 'Week 1', users: 40, checks: 240 },
                    { name: 'Week 2', users: 75, checks: 380 },
                    { name: 'Week 3', users: 120, checks: 520 },
                    { name: 'Week 4', users: 185, checks: 740 },
                  ]}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Area type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions & Recent Orgs */}
            <div className="space-y-8">
              <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4">Master Controls</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group">
                      <span className="font-bold text-sm">Broadcast Announcement</span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group">
                      <span className="font-bold text-sm">System Maintenance</span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-indigo-500 hover:bg-indigo-400 rounded-2xl transition-all group">
                      <span className="font-bold text-sm">Generate Audit Report</span>
                      <ArrowUpRight className="w-4 h-4 text-white/40" />
                    </button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              </div>

              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                <h3 className="font-black text-slate-900 mb-6">Recent Hubs</h3>
                <div className="space-y-6">
                  {organisations.slice(0, 3).map((org) => (
                    <div key={org._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{org.name}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{org.code}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900">{org.userCount}</p>
                        <p className="text-[10px] text-slate-400">Users</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Organisations Tab */}
      {activeTab === 'organisations' && (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Community Hubs</h2>
              <p className="text-slate-400 text-sm font-medium">Manage all registered organisations</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name or code..." 
                className="pl-11 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-80"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Organisation</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Invite Code</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Members</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Programmes</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {organisations.map((org) => (
                  <tr key={org._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-indigo-100 transition-colors">
                          <Building2 className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{org.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium">Registered: {new Date(org.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <button 
                        onClick={() => copyToClipboard(org.code)}
                        className="flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-xl group/code hover:bg-indigo-50 transition-all"
                      >
                        <code className="text-xs font-mono font-bold text-slate-600 group-hover/code:text-indigo-600">{org.code}</code>
                        {copySuccess === org.code ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400 group-hover/code:text-indigo-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-slate-300" />
                        <span className="text-sm font-bold text-slate-700">{org.userCount}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-300" />
                        <span className="text-sm font-bold text-slate-700">{org.programmeCount}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg">Operational</span>
                    </td>
                    <td className="px-8 py-5">
                      <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Global Member Directory</h2>
              <p className="text-slate-400 text-sm font-medium">Manage all users across the platform</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by name or email..." 
                  className="pl-11 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-80"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Member</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Organisation</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mr-4 font-black text-slate-400">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{user.name}</span>
                          <span className="text-xs text-slate-400 font-medium flex items-center">
                            <Mail className="w-3 h-3 mr-1" /> {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                        user.role === 'SUPER_ADMIN' ? 'bg-indigo-50 text-indigo-600' :
                        user.role === 'ORG_ADMIN' ? 'bg-blue-50 text-blue-600' :
                        user.role === 'COORDINATOR' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-slate-300" />
                        <span className="text-sm font-bold text-slate-700">{user.organisationId?.name || 'Global'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="flex items-center text-emerald-500 text-xs font-bold">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                        Active
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Programmes Tab */}
      {activeTab === 'programmes' && (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Global Programme Registry</h2>
              <p className="text-slate-400 text-sm font-medium">Monitor and host programmes across the platform</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Host Global Programme</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Programme</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Host Organisation</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Visibility</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Enrolled</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {programmes.map((prog) => (
                  <tr key={prog._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mr-4">
                          <Calendar className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{prog.title}</span>
                          <span className="text-xs text-slate-400 font-medium flex items-center">
                            <MapPin className="w-3 h-3 mr-1" /> {prog.location}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-slate-300" />
                        <span className="text-sm font-bold text-slate-700">{prog.organisationId?.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                        prog.visibility === 'PUBLIC' ? 'bg-emerald-50 text-emerald-600' :
                        prog.visibility === 'GLOBAL' ? 'bg-indigo-50 text-indigo-600' :
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {prog.visibility === 'PUBLIC' ? <Globe className="w-3 h-3 inline mr-1" /> : <Lock className="w-3 h-3 inline mr-1" />}
                        {prog.visibility}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-slate-300" />
                        <span className="text-sm font-bold text-slate-700">{prog.participants?.length || 0}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg">Ongoing</span>
                    </td>
                    <td className="px-8 py-5">
                      <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Organisation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 p-10 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-black tracking-tight">Onboard Hub</h2>
                <p className="text-indigo-100 text-sm mt-2 font-medium">Create a new community space on the platform.</p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            </div>
            
            <form onSubmit={handleCreateOrg} className="p-10 space-y-8">
              {error && (
                <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl flex items-center text-sm font-bold">
                  <AlertCircle className="w-4 h-4 mr-3" /> {error}
                </div>
              )}
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Organisation Name</label>
                <input 
                  required 
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700" 
                  placeholder="e.g. Waitaha Health Trust"
                  value={newOrg.name}
                  onChange={e => setNewOrg({...newOrg, name: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Invite Code (Unique)</label>
                <input 
                  required 
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-mono font-bold text-indigo-600" 
                  placeholder="e.g. WAITAHA-2024"
                  value={newOrg.code}
                  onChange={e => setNewOrg({...newOrg, code: e.target.value.toUpperCase().replace(/\s+/g, '-')})}
                />
                <p className="text-[10px] text-slate-400 font-medium italic">This code will be used by members to register for this hub.</p>
              </div>

              <div className="flex space-x-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs"
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
