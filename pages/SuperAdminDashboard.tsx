
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
  ChevronRight,
  Megaphone,
  XCircle,
  Edit,
  History,
  Heart,
  Database,
  RefreshCw
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
  const [activeTab, setActiveTab] = useState<'overview' | 'organisations' | 'users' | 'programmes' | 'tickets' | 'settings' | 'org-applications'>('overview');
  const [organisations, setOrganisations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [orgApplications, setOrgApplications] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newOrg, setNewOrg] = useState({ name: '', code: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [broadcastHistory, setBroadcastHistory] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [wellbeingInsights, setWellbeingInsights] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [platformSettings, setPlatformSettings] = useState<any>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showProgrammeModal, setShowProgrammeModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingBroadcast, setEditingBroadcast] = useState<any>(null);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const [newProgramme, setNewProgramme] = useState({
    title: '',
    publicSummary: '',
    memberDetails: '',
    visibility: 'GLOBAL',
    startDate: '',
    location: '',
    category: 'Wellbeing'
  });

  const fetchData = async () => {
    console.log('Fetching dashboard data...');
    try {
      const token = localStorage.getItem('whanauwell_token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const headers = { 'Authorization': `Bearer ${token}` };

      const [orgsRes, statsRes, usersRes, progsRes, broadcastsRes, logsRes, insightsRes, ticketsRes, settingsRes, healthRes, orgAppsRes] = await Promise.all([
        fetch('/api/admin/organisations', { headers }),
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/programmes', { headers }),
        fetch('/api/admin/broadcasts', { headers }),
        fetch('/api/admin/logs', { headers }),
        fetch('/api/admin/wellbeing-insights', { headers }),
        fetch('/api/admin/tickets', { headers }),
        fetch('/api/admin/settings', { headers }),
        fetch('/api/admin/health', { headers }),
        fetch('/api/admin/org-applications', { headers })
      ]);
      
      const results = await Promise.all([
        orgsRes.json(), statsRes.json(), usersRes.json(), progsRes.json(), 
        broadcastsRes.json(), logsRes.json(), insightsRes.json(), 
        ticketsRes.json(), settingsRes.json(), healthRes.json(), orgAppsRes.json()
      ]);

      const [
        orgsData, statsData, usersData, progsData, broadcastsData, 
        logsData, insightsData, ticketsData, settingsData, healthData, orgAppsData
      ] = results;
      
      console.log('Data fetched successfully:', {
        orgs: orgsData.data?.length,
        users: usersData.data?.length,
        programmes: progsData.data?.length
      });

      if (orgsData.success) setOrganisations(orgsData.data);
      if (statsData.success) setStats(statsData.data);
      if (usersData.success) setUsers(usersData.data);
      if (progsData.success) setProgrammes(progsData.data);
      if (broadcastsData.success) setBroadcastHistory(broadcastsData.data);
      if (logsData.success) setLogs(logsData.data);
      if (insightsData.success) setWellbeingInsights(insightsData.data);
      if (ticketsData.success) setTickets(ticketsData.data);
      if (settingsData.success) setPlatformSettings(settingsData.data);
      if (healthData.success) setSystemHealth(healthData.data);
      if (orgAppsData.success) setOrgApplications(orgAppsData.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to refresh dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleUpdateTicket = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/tickets/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}`
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Ticket updated');
        fetchData();
      }
    } catch (err) {
      setError('Failed to update ticket');
    }
  };

  const handleUpdateOrgApplication = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/org-applications/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}`
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Application updated');
        fetchData();
      }
    } catch (err) {
      setError('Failed to update application');
    }
  };

  const handleSeedData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/seed-data', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Platform data initialized successfully!');
        fetchData();
      } else {
        setError(data.message || 'Failed to seed data');
      }
    } catch (err) {
      setError('Connection error while seeding');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}`
        },
        body: JSON.stringify(platformSettings)
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Settings saved');
        setShowSettingsModal(false);
        fetchData();
      }
    } catch (err) {
      setError('Failed to save settings');
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all system logs? This cannot be undone.')) return;
    try {
      const response = await fetch('/api/admin/logs', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Logs cleared');
        fetchData();
      }
    } catch (err) {
      setError('Failed to clear logs');
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBroadcast ? `/api/admin/broadcasts/${editingBroadcast._id}` : '/api/admin/broadcast';
      const method = editingBroadcast ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}`
        },
        body: JSON.stringify({ message: broadcastMessage, type: 'ANNOUNCEMENT' })
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(editingBroadcast ? 'Broadcast updated!' : 'Broadcast sent successfully!');
        setBroadcastMessage('');
        setShowBroadcastModal(false);
        setEditingBroadcast(null);
        fetchData();
      }
    } catch (err) {
      setError('Failed to process broadcast');
    }
  };

  const handleCreateProgramme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/programmes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}`
        },
        body: JSON.stringify(newProgramme)
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Global programme hosted successfully!');
        setShowProgrammeModal(false);
        setNewProgramme({
          title: '',
          publicSummary: '',
          memberDetails: '',
          visibility: 'GLOBAL',
          startDate: '',
          location: '',
          category: 'Wellbeing'
        });
        fetchData();
      }
    } catch (err) {
      setError('Failed to host programme');
    }
  };

  const deleteBroadcast = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/broadcasts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Broadcast deleted');
        fetchData();
      }
    } catch (err) {
      setError('Failed to delete broadcast');
    }
  };

  const downloadAuditReport = async () => {
    try {
      const response = await fetch('/api/admin/audit-report', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `whanauwell_audit_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to generate report');
    }
  };

  const toggleMaintenance = () => {
    setIsMaintenanceMode(!isMaintenanceMode);
    setSuccess(`Maintenance mode ${!isMaintenanceMode ? 'enabled' : 'disabled'}`);
  };

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
          <button 
            onClick={fetchData}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
          <button 
            onClick={() => setShowLogsModal(true)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all flex items-center space-x-2"
          >
            <History className="w-4 h-4" />
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
          { id: 'org-applications', label: 'Hub Requests', icon: Mail },
          { id: 'users', label: 'Global Users', icon: Users },
          { id: 'programmes', label: 'Global Programmes', icon: Calendar },
          { id: 'tickets', label: 'Support Desk', icon: Megaphone },
          { id: 'settings', label: 'Platform Settings', icon: ShieldCheck },
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
            {/* System Health Widget */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">System Health</h3>
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">CPU Usage</span>
                    <span className="font-mono font-bold">{systemHealth?.cpu || 0}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${systemHealth?.cpu || 0}%` }} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Memory</span>
                    <span className="font-mono font-bold">{systemHealth?.memory || 0}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${systemHealth?.memory || 0}%` }} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 p-3 rounded-xl">
                      <p className="text-[10px] text-slate-500 uppercase font-black">Latency</p>
                      <p className="text-sm font-bold">{systemHealth?.apiLatency || 0}ms</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl">
                      <p className="text-[10px] text-slate-500 uppercase font-black">Uptime</p>
                      <p className="text-sm font-bold">{Math.floor((systemHealth?.uptime || 0) / 3600)}h</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wellbeing Heatmap / Bar Chart */}
            <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Wellbeing Comparison</h3>
                  <p className="text-slate-500 text-sm font-medium">Average stress scores across all hubs.</p>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span>Healthy</span>
                  <div className="w-3 h-3 bg-rose-500 rounded-full ml-2"></div>
                  <span>High Stress</span>
                </div>
              </div>
              <div className="h-[300px] w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wellbeingInsights.map(i => ({ name: i.org.name, score: i.avgStress }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} domain={[0, 10]} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                      {wellbeingInsights.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.avgStress > 7 ? '#f43f5e' : entry.avgStress > 4 ? '#f59e0b' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Wellbeing Insights (List View) */}
            <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Global Wellbeing Insights</h3>
                  <p className="text-slate-500 text-sm font-medium">Aggregated stress levels across all organisations.</p>
                </div>
                <div className="bg-rose-50 px-4 py-2 rounded-xl flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span className="text-rose-700 font-bold text-xs">Live Monitoring</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {wellbeingInsights.length === 0 ? (
                  <div className="py-20 text-center">
                    <Activity className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">Insufficient data for wellbeing trends.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wellbeingInsights.map((insight) => (
                      <div key={insight._id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-black text-slate-900">{insight.org.name}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{insight.org.code}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            insight.avgStress > 7 ? 'bg-rose-100 text-rose-700' : 
                            insight.avgStress > 4 ? 'bg-amber-100 text-amber-700' : 
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {insight.avgStress > 7 ? 'High Stress' : insight.avgStress > 4 ? 'Moderate' : 'Healthy'}
                          </div>
                        </div>
                        <div className="flex items-end justify-between">
                          <div className="flex-1 mr-4">
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-1000 ${
                                  insight.avgStress > 7 ? 'bg-rose-500' : 
                                  insight.avgStress > 4 ? 'bg-amber-500' : 
                                  'bg-emerald-500'
                                }`}
                                style={{ width: `${(insight.avgStress / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-xl font-black text-slate-900">{insight.avgStress.toFixed(1)}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Based on {insight.count} checks</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions & Recent Orgs */}
            <div className="space-y-8">
              <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4">Master Controls</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowBroadcastModal(true)}
                      className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group"
                    >
                      <span className="font-bold text-sm">Broadcast Announcement</span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={toggleMaintenance}
                      className={`w-full flex items-center justify-between p-4 ${isMaintenanceMode ? 'bg-rose-500/20 text-rose-200' : 'bg-white/10 text-white'} hover:bg-white/20 rounded-2xl transition-all group`}
                    >
                      <span className="font-bold text-sm">{isMaintenanceMode ? 'Disable Maintenance' : 'System Maintenance'}</span>
                      <div className={`w-2 h-2 rounded-full ${isMaintenanceMode ? 'bg-rose-500 animate-pulse' : 'bg-white/40'}`}></div>
                    </button>
                    <button 
                      onClick={downloadAuditReport}
                      className="w-full flex items-center justify-between p-4 bg-indigo-500 hover:bg-indigo-400 rounded-2xl transition-all group"
                    >
                      <span className="font-bold text-sm">Generate Audit Report</span>
                      <ArrowUpRight className="w-4 h-4 text-white/40" />
                    </button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              </div>

              {/* Broadcast Modal */}
              {showBroadcastModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                  <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="bg-slate-900 p-10 text-white">
                      <h2 className="text-2xl font-black">Global Broadcast</h2>
                      <p className="text-slate-400 text-sm mt-1">Send a message to every active user on the platform.</p>
                    </div>
                    <form onSubmit={handleBroadcast} className="p-10 space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Message</label>
                        <textarea 
                          required
                          rows={4}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700 resize-none"
                          placeholder="Type your announcement here..."
                          value={broadcastMessage}
                          onChange={e => setBroadcastMessage(e.target.value)}
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button 
                          type="button" 
                          onClick={() => setShowBroadcastModal(false)}
                          className="flex-1 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs"
                        >
                          Send Now
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

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

              {/* Broadcast History */}
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-slate-900">Broadcast History</h3>
                  <Megaphone className="w-4 h-4 text-slate-300" />
                </div>
                <div className="space-y-4">
                  {broadcastHistory.length === 0 ? (
                    <p className="text-center py-4 text-slate-400 text-sm italic">No past announcements.</p>
                  ) : (
                    broadcastHistory.slice(0, 5).map((b) => (
                      <div key={b._id} className="p-4 bg-slate-50 rounded-2xl group relative">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                    <button 
                      onClick={() => {
                        setBroadcastMessage(b.message);
                        setEditingBroadcast(b);
                        setShowBroadcastModal(true);
                      }}
                      className="text-slate-300 hover:text-indigo-500 transition-colors opacity-0 group-hover:opacity-100 mr-2"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteBroadcast(b._id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                        </div>
                        <p className="text-xs text-slate-600 font-medium line-clamp-2">{b.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hub Requests Tab */}
      {activeTab === 'org-applications' && (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-slate-50">
            <h2 className="text-xl font-black text-slate-900">Hub Onboarding Requests</h2>
            <p className="text-slate-400 text-sm font-medium">Review and manage requests from new organisations (Hubs) wanting to join the platform.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Organisation</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Reason</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orgApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">No onboarding requests found.</td>
                  </tr>
                ) : (
                  orgApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <span className="font-bold text-slate-900 block">{app.name}</span>
                        <span className="text-xs text-slate-400">{new Date(app.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-bold text-slate-700 block">{app.contactName}</span>
                        <span className="text-xs text-slate-400">{app.email}</span>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-xs text-slate-600 max-w-xs line-clamp-2">{app.reason}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                          app.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                          app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleUpdateOrgApplication(app._id, 'APPROVED')}
                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleUpdateOrgApplication(app._id, 'REJECTED')}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
                  <tr 
                    key={org._id} 
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedOrg(org)}
                  >
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
                  <tr 
                    key={user._id} 
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
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
            <button 
              onClick={() => setShowProgrammeModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center space-x-2"
            >
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
                        {prog.visibility === 'PUBLIC' || prog.visibility === 'GLOBAL' ? <Globe className="w-3 h-3 inline mr-1" /> : <Lock className="w-3 h-3 inline mr-1" />}
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

      {/* Platform Logs Modal */}
      {showLogsModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Platform Logs</h2>
                <p className="text-slate-400 text-sm mt-1">Real-time system events and audit trail.</p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleClearLogs}
                  className="px-4 py-2 bg-rose-500/10 text-rose-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all"
                >
                  Clear All Logs
                </button>
                <button onClick={() => setShowLogsModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <XCircle className="w-8 h-8" />
                </button>
              </div>
            </div>
            <div className="p-10 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {logs.length === 0 ? (
                  <p className="text-center py-20 text-slate-400 italic">No system logs available.</p>
                ) : (
                  logs.map((log) => (
                    <div key={log._id} className="flex items-start space-x-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors border-b border-slate-50">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        log.type === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' :
                        log.type === 'WARNING' ? 'bg-amber-50 text-amber-600' :
                        log.type === 'ERROR' ? 'bg-rose-50 text-rose-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        <Activity className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-slate-900">{log.event}</p>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{log.details}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          {log.userId && (
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                              User: {log.userId.name}
                            </span>
                          )}
                          {log.organisationId && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                              Org: {log.organisationId.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Host Global Programme Modal */}
      {showProgrammeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 p-10 text-white">
              <h2 className="text-3xl font-black tracking-tight">Host Global Programme</h2>
              <p className="text-indigo-100 text-sm mt-2 font-medium">Create a programme accessible across the entire platform.</p>
            </div>
            <form onSubmit={handleCreateProgramme} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Programme Title</label>
                <input 
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                  placeholder="e.g. Mindfulness for All"
                  value={newProgramme.title}
                  onChange={e => setNewProgramme({...newProgramme, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                <select 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                  value={newProgramme.category}
                  onChange={e => setNewProgramme({...newProgramme, category: e.target.value})}
                >
                  <option>Wellbeing</option>
                  <option>Community</option>
                  <option>Education</option>
                  <option>Health</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Start Date</label>
                <input 
                  type="date"
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                  value={newProgramme.startDate}
                  onChange={e => setNewProgramme({...newProgramme, startDate: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Public Summary</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700 resize-none"
                  placeholder="Brief description for everyone..."
                  value={newProgramme.publicSummary}
                  onChange={e => setNewProgramme({...newProgramme, publicSummary: e.target.value})}
                />
              </div>
              <div className="flex space-x-4 md:col-span-2 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowProgrammeModal(false)}
                  className="flex-1 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs"
                >
                  Launch Programme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Organisation Details Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-emerald-600 p-10 text-white flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-black tracking-tight">{selectedOrg.name}</h2>
                <p className="text-emerald-100 text-sm mt-1 font-black uppercase tracking-widest">Hub ID: {selectedOrg.code}</p>
              </div>
              <button onClick={() => setSelectedOrg(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <XCircle className="w-8 h-8" />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-6 rounded-3xl text-center">
                  <p className="text-2xl font-black text-slate-900">{selectedOrg.userCount}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Members</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl text-center">
                  <p className="text-2xl font-black text-slate-900">{selectedOrg.programmeCount}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Programmes</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl text-center">
                  <p className="text-2xl font-black text-slate-900">Active</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Status</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Hub Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-3 border-b border-slate-50">
                    <span className="text-slate-400 text-sm font-medium">Created On</span>
                    <span className="text-slate-900 text-sm font-bold">{new Date(selectedOrg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-50">
                    <span className="text-slate-400 text-sm font-medium">Invite Code</span>
                    <span className="text-indigo-600 text-sm font-black">{selectedOrg.code}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 p-10 text-white flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-indigo-500 rounded-[32px] flex items-center justify-center text-4xl font-black mb-6 shadow-2xl shadow-indigo-500/20">
                {selectedUser.name.charAt(0)}
              </div>
              <h2 className="text-3xl font-black tracking-tight">{selectedUser.name}</h2>
              <p className="text-slate-400 text-sm mt-1 font-medium">{selectedUser.email}</p>
              <div className="mt-4 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                {selectedUser.role.replace('_', ' ')}
              </div>
            </div>
            <div className="p-10 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">Organisation</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{selectedUser.organisationId?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">Joined On</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Desk Tab */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Support Desk</h2>
              <p className="text-slate-400 text-sm font-medium">Manage and respond to support tickets submitted by users and organisation administrators.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Organisation</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Priority</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">No support tickets found.</td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <span className="font-bold text-slate-900 block">{ticket.subject}</span>
                        <span className="text-xs text-slate-400 font-medium">From: {ticket.userId?.name}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-slate-700">{ticket.organisationId?.name}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                          ticket.priority === 'URGENT' ? 'bg-rose-100 text-rose-700' :
                          ticket.priority === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <select 
                          value={ticket.status}
                          onChange={(e) => handleUpdateTicket(ticket._id, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase outline-none cursor-pointer ${
                            ticket.status === 'OPEN' ? 'bg-indigo-50 text-indigo-600' :
                            ticket.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' :
                            'bg-slate-50 text-slate-600'
                          }`}
                        >
                          <option value="OPEN">Open</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </td>
                      <td className="px-8 py-5">
                        <button 
                          onClick={() => setSelectedTicket(ticket)}
                          className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
                        >
                          <ArrowUpRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Support Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 p-10 text-white flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black tracking-tight">{selectedTicket.subject}</h2>
                <p className="text-indigo-100 text-sm mt-1 font-medium">Ticket ID: {selectedTicket._id}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <XCircle className="w-8 h-8" />
              </button>
            </div>
            <div className="p-10 space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-indigo-600 shadow-sm">
                    {selectedTicket.userId?.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{selectedTicket.userId?.name}</p>
                    <p className="text-xs text-slate-400">{selectedTicket.userId?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">{selectedTicket.organisationId?.name}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Hub Admin</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message</label>
                <div className="p-6 bg-slate-50 rounded-3xl text-slate-700 text-sm leading-relaxed border border-slate-100">
                  {selectedTicket.message}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Priority</label>
                  <div className={`px-4 py-3 rounded-2xl font-bold text-sm ${
                    selectedTicket.priority === 'URGENT' ? 'bg-rose-50 text-rose-600' :
                    selectedTicket.priority === 'HIGH' ? 'bg-amber-50 text-amber-600' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    {selectedTicket.priority}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Status</label>
                  <select 
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateTicket(selectedTicket._id, e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-bold text-sm text-slate-700"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={() => setSelectedTicket(null)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Platform Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Platform Settings</h2>
            <p className="text-slate-400 text-sm font-medium mb-10">Configure global parameters and system behavior.</p>

            <div className="mb-12 p-8 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-indigo-900">System Initialization</h3>
                <p className="text-indigo-600/70 text-sm">Populate the platform with comprehensive sample data for testing.</p>
              </div>
              <button 
                onClick={handleSeedData}
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center space-x-2 disabled:opacity-50"
              >
                <Database className="w-5 h-5" />
                <span>{loading ? 'Seeding...' : 'Seed Sample Data'}</span>
              </button>
            </div>
            
            <form onSubmit={handleUpdateSettings} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Platform Name</label>
                  <input 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                    value={platformSettings?.platformName || ''}
                    onChange={e => setPlatformSettings({...platformSettings, platformName: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stress Check Interval (Days)</label>
                  <input 
                    type="number"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                    value={platformSettings?.defaultStressCheckInterval || 7}
                    onChange={e => setPlatformSettings({...platformSettings, defaultStressCheckInterval: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                  <div>
                    <p className="font-black text-slate-900">Allow Public Registration</p>
                    <p className="text-xs text-slate-400 font-medium">Allow users to sign up without an invite code. (If off, users must apply for access)</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setPlatformSettings({...platformSettings, allowPublicRegistration: !platformSettings?.allowPublicRegistration})}
                    className={`w-14 h-8 rounded-full transition-all relative ${platformSettings?.allowPublicRegistration ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${platformSettings?.allowPublicRegistration ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                  <div>
                    <p className="font-black text-slate-900">Maintenance Mode</p>
                    <p className="text-xs text-slate-400 font-medium">Restrict access to the platform for maintenance. (Only Super Admins can log in)</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setPlatformSettings({...platformSettings, maintenanceMode: !platformSettings?.maintenanceMode})}
                    className={`w-14 h-8 rounded-full transition-all relative ${platformSettings?.maintenanceMode ? 'bg-rose-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${platformSettings?.maintenanceMode ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 p-10 text-white flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Ticket Details</h2>
                <p className="text-slate-400 text-sm mt-1 font-black uppercase tracking-widest">ID: {selectedTicket._id}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <XCircle className="w-8 h-8" />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-2">
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Subject</h4>
                <p className="text-xl font-bold text-slate-800">{selectedTicket.subject}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Message</h4>
                <div className="p-6 bg-slate-50 rounded-3xl text-slate-600 font-medium leading-relaxed">
                  {selectedTicket.message}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">From Organisation</p>
                  <p className="font-bold text-slate-900">{selectedTicket.organisationId?.name}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Submitted By</p>
                  <p className="font-bold text-slate-900">{selectedTicket.userId?.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}
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
