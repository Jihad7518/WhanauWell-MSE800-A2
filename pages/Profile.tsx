
import React from 'react';
import { User } from '../types';
import { User as UserIcon, Mail, Shield, Building, Calendar, Activity } from 'lucide-react';

interface ProfileProps {
  user: User;
  organisation: any;
}

const Profile: React.FC<ProfileProps> = ({ user, organisation }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Your Profile</h1>
        <p className="text-slate-500">Manage your personal information and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold mx-auto mb-4">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-slate-500 text-sm">{user.role.replace('_', ' ')}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-slate-500">
                  <Calendar className="w-4 h-4 mr-2" /> Programmes
                </div>
                <span className="font-bold text-slate-900">3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-slate-500">
                  <Activity className="w-4 h-4 mr-2" /> Check-ins
                </div>
                <span className="font-bold text-slate-900">12</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                  <UserIcon className="w-4 h-4 mr-2 text-slate-400" />
                  {user.name}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                  <Mail className="w-4 h-4 mr-2 text-slate-400" />
                  {user.email}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Organisation</label>
                <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                  <Building className="w-4 h-4 mr-2 text-slate-400" />
                  {organisation.name}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Access Level</label>
                <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                  <Shield className="w-4 h-4 mr-2 text-slate-400" />
                  {user.role}
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-100">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
