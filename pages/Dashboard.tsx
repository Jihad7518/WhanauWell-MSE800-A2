
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Activity, 
  BrainCircuit, 
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardProps {
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('/api/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
        });
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);

        if (user.role === 'ORG_ADMIN') {
          const appsRes = await fetch('/api/admin/applications', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
          });
          const appsData = await appsRes.json();
          if (appsData.success) setApplications(appsData.data);
        }
      } catch (error) {
        console.error('Fetch data error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.role]);

  const handleApproveApplication = async (appId: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${appId}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setApplications(applications.map(app => app._id === appId ? { ...app, status: 'APPROVED', inviteCodeSent: data.code } : app));
      }
    } catch (err) {
      console.error('Approval error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stressDistribution = stats?.stressStats ? [
    { name: 'Low', value: stats.stressStats.low || 0, color: '#10b981' },
    { name: 'Moderate', value: stats.stressStats.moderate || 0, color: '#f59e0b' },
    { name: 'High', value: stats.stressStats.high || 0, color: '#ef4444' }
  ].filter(d => d.value > 0) : [];

  const participationData = stats?.participationTrend?.length > 0 
    ? stats.participationTrend 
    : [
        { week: 'Week 1', count: 0 },
        { week: 'Week 2', count: 0 },
        { week: 'Week 3', count: 0 },
        { week: 'Week 4', count: 0 }
      ];

  const StatCard = ({ title, value, icon: Icon, trend, color, to }: any) => {
    const CardContent = (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all h-full">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
          </div>
          {trend && (
            <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3 mr-1" />
              {trend}
            </span>
          )}
        </div>
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
    );

    if (to) {
      return <Link to={to} className="block h-full">{CardContent}</Link>;
    }
    return CardContent;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-2xl overflow-hidden border-2 border-white shadow-sm">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              user.name.charAt(0)
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Kia ora, {user.name}!</h1>
            <p className="text-slate-500">Welcome to your WhānauWell dashboard.</p>
          </div>
        </div>
        <div className="flex space-x-3">
          {(user.role === 'ORG_ADMIN' || user.role === 'COORDINATOR') && (
            <div className="hidden lg:flex items-center px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl mr-2">
              <div className="text-left">
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Invite Code</p>
                <p className="text-sm font-mono font-bold text-indigo-700">{localStorage.getItem('whanauwell_org_code') || 'WHANAU-01'}</p>
              </div>
            </div>
          )}
          <Link 
            to="/app/stress"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Daily Stress Check</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Programmes" 
          value={stats?.programmesCount || 0} 
          icon={Calendar} 
          color="bg-indigo-600" 
          to="/app/programmes"
        />
        <StatCard 
          title="Community Members" 
          value={stats?.membersCount || 0} 
          icon={Users} 
          trend="+12%" 
          color="bg-emerald-600" 
          to="/app/members"
        />
        <StatCard 
          title="Wellbeing Checks" 
          value={stats?.stressStats?.total || 0} 
          icon={Activity} 
          color="bg-amber-600" 
          to="/app/stress"
        />
        <StatCard 
          title="Avg. Stress Score" 
          value={stats?.stressStats?.averageScore?.toFixed(1) || '0.0'} 
          icon={BrainCircuit} 
          color="bg-rose-600" 
          to="/app/stress"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Participation Trends</h2>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last 4 Weeks</div>
          </div>
          <div className="h-80 w-full min-h-[320px]">
            {participationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={participationData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Activity className="w-12 h-12 mb-2 opacity-20" />
                <p>Not enough data yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-8">Stress Distribution</h2>
          <div className="h-64 w-full relative min-h-[256px]">
            {stressDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stressDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stressDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <BrainCircuit className="w-12 h-12 mb-2 opacity-20" />
                <p>No assessments yet</p>
              </div>
            )}
            {stressDistribution.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">{stats.stressStats.total}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Total Checks</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 space-y-3">
            {stressDistribution.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: d.color}}></div>
                  <span className="text-sm font-medium text-slate-600">{d.name} Risk</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{Math.round((d.value / stats.stressStats.total) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {user.role === 'ORG_ADMIN' && applications.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-indigo-50/30">
            <h2 className="font-bold text-slate-900 flex items-center">
              <Users className="w-5 h-5 mr-2 text-indigo-500" />
              Membership Applications
              <span className="ml-2 px-2 py-0.5 bg-indigo-600 text-white text-[10px] rounded-full">
                {applications.filter(a => a.status === 'PENDING').length} New
              </span>
            </h2>
          </div>
          <div className="divide-y divide-slate-50">
            {applications.map((app) => (
              <div key={app._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold">
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{app.name}</p>
                    <p className="text-sm text-slate-500">{app.email}</p>
                    {app.message && <p className="text-xs text-slate-400 italic mt-1">"{app.message}"</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {app.status === 'PENDING' ? (
                    <>
                      <button 
                        onClick={() => handleApproveApplication(app._id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                      >
                        Approve & Send Code
                      </button>
                      <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
                        Decline
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Approved (Code: {app.inviteCodeSent})
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-500" />
              Recent Activity
            </h2>
            <Link to="/app/programmes" className="text-indigo-600 text-sm font-bold hover:text-indigo-800">View All</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {stats?.recentActivities?.length > 0 ? stats.recentActivities.map((activity: any, i: number) => (
              <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'programme' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
                    {activity.type === 'programme' ? <Calendar className="w-5 h-5" /> : <BrainCircuit className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{activity.title}</p>
                    <p className="text-xs text-slate-500">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </div>
            )) : (
              <div className="p-10 text-center text-slate-400">No recent activity</div>
            )}
          </div>
        </div>

        <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Community Support</h2>
            <p className="text-indigo-100 mb-8 max-w-md">
              Our coordinators are here to support your wellbeing journey. Join a programme or complete a check-in to get personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/app/programmes"
                className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center"
              >
                Browse Programmes
              </Link>
              <button className="bg-indigo-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center">
                Contact Coordinator
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
