
import React from 'react';
import { User, UserRole } from '../types';
import { 
  Users, 
  Calendar, 
  Activity, 
  AlertTriangle,
  Heart,
  Target
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const isManagement = user.role === UserRole.ORG_ADMIN || user.role === UserRole.COORDINATOR;

  const mockStats = [
    { label: 'Active Programmes', value: '12', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Members', value: '482', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Avg. Wellbeing', value: '7.8', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-100' },
    { label: 'Risk Alerts', value: '4', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  const stressDistribution = [
    { name: 'Low', value: 65, color: '#10b981' },
    { name: 'Moderate', value: 25, color: '#f59e0b' },
    { name: 'High', value: 10, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Kia Ora, {user.name}!</h1>
          <p className="text-slate-500">Welcome back to the wellbeing hub.</p>
        </div>
        {!isManagement && (
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Daily Stress Check</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(isManagement ? mockStats : mockStats.slice(2)).map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Community Engagement Trends</h3>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 outline-none">
              <option>Last 6 Months</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stress Insights */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Stress Risk Distribution</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
             <div className="h-[200px] w-full mb-6">
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
             </div>
             <div className="space-y-3 w-full">
               {stressDistribution.map((item) => (
                 <div key={item.name} className="flex items-center justify-between text-sm">
                   <div className="flex items-center space-x-2">
                     <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                     <span className="text-slate-600 font-medium">{item.name} Risk</span>
                   </div>
                   <span className="font-bold text-slate-900">{item.value}%</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Recommended Support Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Mindfulness Basics', time: '15 mins', icon: Target, category: 'Wellness' },
            { title: 'Burnout Recovery', time: '45 mins', icon: Activity, category: 'High Priority' },
            { title: 'Social Connection', time: '30 mins', icon: Users, category: 'Community' },
          ].map((item, i) => (
            <div key={i} className="group p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{item.category}</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
              <p className="text-sm text-slate-500">Suggested duration: {item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
