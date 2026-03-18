
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { User as UserIcon, Mail, Shield, Hash, Loader2 } from 'lucide-react';

interface MembersProps {
  user: User;
}

const Members: React.FC<MembersProps> = ({ user }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [promoting, setPromoting] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setMembers(data.data);
      } else {
        if (response.status === 400 || response.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else {
          setError(data.message || 'Failed to fetch members');
        }
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (memberId: string, currentRole: string) => {
    const newRole = currentRole === 'MEMBER' ? 'COORDINATOR' : 'MEMBER';
    const confirmMsg = newRole === 'COORDINATOR' 
      ? 'Are you sure you want to promote this member to Coordinator? They will be able to create and manage programmes.'
      : 'Are you sure you want to demote this coordinator to Member?';
    
    if (!confirm(confirmMsg)) return;

    setPromoting(memberId);
    try {
      const response = await fetch(`/api/members/${memberId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await response.json();
      if (data.success) {
        setMembers(members.map(m => m._id === memberId ? data.data : m));
      } else {
        alert(data.message || 'Failed to update role');
      }
    } catch (err) {
      alert('Connection error');
    } finally {
      setPromoting(null);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading members...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Organisation Members</h1>
        <p className="text-slate-500">Manage users and roles within your community hub.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl flex items-center space-x-3">
          <Hash className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((member) => (
                <tr key={member._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold overflow-hidden border border-indigo-50">
                        {member.profilePicture ? (
                          <img src={member.profilePicture} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          member.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{member.name}</p>
                        <p className="text-xs text-slate-500">ID: {member._id.substring(0, 8)}...</p>
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
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-slate-300" />
                      {member.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role === UserRole.ORG_ADMIN && 
                     member.role !== UserRole.ORG_ADMIN && 
                     member.role !== UserRole.SUPER_ADMIN && 
                     member._id !== user.id && (
                      <button
                        onClick={() => handlePromote(member._id, member.role)}
                        disabled={promoting === member._id}
                        className="text-indigo-600 hover:text-indigo-900 font-semibold text-sm flex items-center justify-end space-x-1 ml-auto"
                      >
                        {promoting === member._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Shield className="w-4 h-4" />
                            <span>{member.role === 'MEMBER' ? 'Promote' : 'Demote'}</span>
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Members;
