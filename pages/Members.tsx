
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { User as UserIcon, Mail, Shield, Hash, Loader2, AlertCircle, CheckCircle2, X, Search } from 'lucide-react';

interface MembersProps {
  user: User;
}

const Members: React.FC<MembersProps> = ({ user }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [promoting, setPromoting] = useState<string | null>(null);
  
  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    memberId: string;
    currentRole: string;
    message: string;
  }>({
    isOpen: false,
    memberId: '',
    currentRole: '',
    message: ''
  });

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}`
        }
      });
      
      if (!response.ok) {
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If not JSON, we'll use the status text
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error('Non-JSON response body:', text.substring(0, 200));
        throw new Error("Server returned non-JSON response. This usually means a 404 or a server crash.");
      }

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
    } catch (err: any) {
      console.error('Fetch members error:', err);
      setError(err.message || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async () => {
    const { memberId, currentRole } = confirmModal;
    const newRole = currentRole === 'MEMBER' ? 'COORDINATOR' : 'MEMBER';
    
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
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
        setNotification({ type: 'success', message: `Successfully updated role to ${newRole.toLowerCase()}` });
      } else {
        setNotification({ type: 'error', message: data.message || 'Failed to update role' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Connection error' });
    } finally {
      setPromoting(null);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const openConfirmModal = (memberId: string, currentRole: string) => {
    const newRole = currentRole === 'MEMBER' ? 'COORDINATOR' : 'MEMBER';
    const message = newRole === 'COORDINATOR' 
      ? 'Are you sure you want to promote this member to Coordinator? They will be able to create and manage programmes.'
      : 'Are you sure you want to demote this coordinator to Member?';
    
    setConfirmModal({
      isOpen: true,
      memberId,
      currentRole,
      message
    });
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <p className="text-slate-500">Manage users and roles within your organisation.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl flex items-center space-x-3">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {notification && (
        <div className={`p-4 rounded-xl flex items-center justify-between animate-in slide-in-from-top duration-300 ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
        }`}>
          <div className="flex items-center space-x-3">
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
          <button onClick={() => setNotification(null)} className="p-1 hover:bg-white/50 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center">
        <div className="flex-1 flex items-center px-4">
          <Search className="w-5 h-5 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search members by name, email or role..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none outline-none py-2 text-slate-600" 
          />
        </div>
      </div>

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
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">No members found matching your search.</td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
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
                        {(user.role === UserRole.ORG_ADMIN || user.role === UserRole.COORDINATOR) && (
                          <p className="text-xs text-slate-500">ID: {member._id.substring(0, 8)}...</p>
                        )}
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
                    {(user.role === UserRole.ORG_ADMIN || user.role === UserRole.COORDINATOR) ? (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-slate-300" />
                        {member.email}
                      </div>
                    ) : (
                      <span className="text-slate-300 italic">Hidden</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role === UserRole.ORG_ADMIN && 
                     member.role !== UserRole.ORG_ADMIN && 
                     member.role !== UserRole.SUPER_ADMIN && 
                     member._id !== user.id && (
                      <button
                        onClick={() => openConfirmModal(member._id, member.role)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
              <h3 className="text-lg font-black text-slate-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-indigo-500" />
                Confirm Role Change
              </h3>
              <button 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="p-2 hover:bg-white rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                {confirmModal.message}
              </p>
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePromote}
                  className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
