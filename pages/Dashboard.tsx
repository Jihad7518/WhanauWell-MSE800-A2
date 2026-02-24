
import React, { useState, useEffect } from 'react';
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
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
        });
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Fetch stats error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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

  const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Kia ora, {user.name}!</h1>
          <p className="text-slate-500">Welcome to your WhānauWell dashboard.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => onNavigate('stress')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Daily Stress Check</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Programmes" 
          value={stats?.programmesCount || 0} 
          icon={Calendar} 
          color="bg-indigo-600" 
        />
        <StatCard 
          title="Community Members" 
          value={stats?.membersCount || 0} 
          icon={Users} 
          trend="+12%" 
          color="bg-emerald-600" 
        />
        <StatCard 
          title="Wellbeing Checks" 
          value={stats?.stressStats?.total || 0} 
          icon={Activity} 
          color="bg-amber-600" 
        />
        <StatCard 
          title="Avg. Stress Score" 
          value={stats?.stressStats?.averageScore?.toFixed(1) || '0.0'} 
          icon={BrainCircuit} 
          color="bg-rose-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Community Stress Trends</h2>
            <select className="bg-slate-50 border-none rounded-lg text-sm font-medium px-3 py-1 outline-none">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            {stats?.stressStats?.total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Low', count: stats.stressStats.low || 0 },
                  { name: 'Moderate', count: stats.stressStats.moderate || 0 },
                  { name: 'High', count: stats.stressStats.high || 0 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#ef4444" />
                  </Bar>
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
          <div className="h-64 w-full relative">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-500" />
              Recent Activity
            </h2>
            <button className="text-indigo-600 text-sm font-bold hover:text-indigo-800">View All</button>
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
              <button 
                onClick={() => onNavigate('programmes')}
                className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center"
              >
                Browse Programmes
              </button>
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
