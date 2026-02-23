
import React from 'react';
import { User, UserRole } from '../types';
import { User as UserIcon, Mail, Shield, Hash } from 'lucide-react';

interface MembersProps {
  user: User;
}

const Members: React.FC<MembersProps> = ({ user }) => {
  // Mock members data
  const members = [
    { id: '1', name: 'Aroha Thompson', email: 'aroha@community.org', role: UserRole.MEMBER, joined: '2023-05-12' },
    { id: '2', name: 'James Wilson', email: 'james@community.org', role: UserRole.COORDINATOR, joined: '2023-06-20' },
    { id: '3', name: 'Hana Maaka', email: 'hana@community.org', role: UserRole.MEMBER, joined: '2023-08-05' },
    { id: '4', name: 'Te Rangi', email: 'terangi@community.org', role: UserRole.MEMBER, joined: '2023-09-15' },
    { id: '5', name: 'Sarah Miller', email: 'sarah@community.org', role: UserRole.ORG_ADMIN, joined: '2023-01-10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Organisation Members</h1>
        <p className="text-slate-500">Manage users and roles within your community hub.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Member</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{member.name}</p>
                      <p className="text-xs text-slate-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" /> {member.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.role === UserRole.ORG_ADMIN ? 'bg-purple-100 text-purple-800' :
                    member.role === UserRole.COORDINATOR ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {member.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(member.joined).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-indigo-600 hover:text-indigo-900 font-semibold text-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Members;
