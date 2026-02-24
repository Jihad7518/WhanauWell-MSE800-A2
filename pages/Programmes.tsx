
import React, { useState, useEffect } from 'react';
import { User, UserRole, Programme } from '../types';
import { Plus, Search, MapPin, Clock, Users, ExternalLink, Trash2, X, Info } from 'lucide-react';

interface ProgrammesProps {
  user: User;
}

const Programmes: React.FC<ProgrammesProps> = ({ user }) => {
  const isCoordinator = user.role === UserRole.COORDINATOR || user.role === UserRole.ORG_ADMIN;
  
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const [newProgramme, setNewProgramme] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    location: '',
    category: 'Health & Wellbeing'
  });

  const fetchProgrammes = async () => {
    try {
      const response = await fetch('/api/programmes', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setProgrammes(data.data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/programmes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}`
        },
        body: JSON.stringify(newProgramme)
      });
      const data = await response.json();
      if (data.success) {
        fetchProgrammes();
        setShowModal(false);
        setNewProgramme({ title: '', description: '', startDate: new Date().toISOString().split('T')[0], location: '', category: 'Health & Wellbeing' });
      }
    } catch (error) {
      console.error('Create error:', error);
    }
  };

  const handleJoinLeave = async (id: string, isJoining: boolean) => {
    const endpoint = `/api/programmes/${id}/${isJoining ? 'join' : 'leave'}`;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchProgrammes();
        if (selectedProgramme && selectedProgramme.id === id) {
          setSelectedProgramme(data.data);
        }
      }
    } catch (error) {
      console.error('Join/Leave error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this programme?')) return;
    try {
      const response = await fetch(`/api/programmes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchProgrammes();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Create New Programme</h2>
                <p className="text-indigo-100 text-sm">Launch a new community initiative.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Programme Title</label>
                <input required type="text" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Community Garden Workshop" value={newProgramme.title} onChange={e => setNewProgramme({...newProgramme, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea required rows={3} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Describe the goals..." value={newProgramme.description} onChange={e => setNewProgramme({...newProgramme, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Start Date</label>
                  <input required type="date" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={newProgramme.startDate} onChange={e => setNewProgramme({...newProgramme, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
                  <input type="text" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Community Hall" value={newProgramme.location} onChange={e => setNewProgramme({...newProgramme, location: e.target.value})} />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all">Create Programme</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedProgramme && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="relative h-48 bg-indigo-600">
              <img src={`https://picsum.photos/seed/${selectedProgramme.id}/800/400`} className="w-full h-full object-cover opacity-50" alt="programme" />
              <button onClick={() => setSelectedProgramme(null)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
              <div className="absolute bottom-6 left-8 text-white">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                  {selectedProgramme.category || 'Health & Wellbeing'}
                </span>
                <h2 className="text-3xl font-bold">{selectedProgramme.title}</h2>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex flex-wrap gap-6 text-slate-600">
                <div className="flex items-center"><Clock className="w-5 h-5 mr-2 text-indigo-500" /> {new Date(selectedProgramme.startDate).toLocaleDateString()}</div>
                <div className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-indigo-500" /> {selectedProgramme.location || 'Waitaha Community Hub'}</div>
                <div className="flex items-center"><Users className="w-5 h-5 mr-2 text-indigo-500" /> {selectedProgramme.participants.length} Enrolled</div>
              </div>
              <div className="prose prose-slate max-w-none">
                <h4 className="text-lg font-bold text-slate-800 mb-2">About this programme</h4>
                <p className="text-slate-600 leading-relaxed">{selectedProgramme.description}</p>
              </div>
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Coordinator: <span className="font-bold text-slate-800">{(selectedProgramme as any).coordinatorId?.name || 'Community Leader'}</span>
                </div>
                <button 
                  onClick={() => handleJoinLeave(selectedProgramme.id, !selectedProgramme.participants.includes(user.id))}
                  disabled={selectedProgramme.participants.includes(user.id)}
                  className={`px-8 py-3 rounded-xl font-bold transition-all ${
                    selectedProgramme.participants.includes(user.id) 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                  }`}
                >
                  {selectedProgramme.participants.includes(user.id) ? 'Already Enrolled' : 'Join Programme'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Community Programmes</h1>
          <p className="text-slate-500">Manage and join local wellbeing initiatives.</p>
        </div>
        {isCoordinator && (
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create New Programme</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
        <div className="flex-1 flex items-center px-4">
          <Search className="w-5 h-5 text-slate-400 mr-2" />
          <input type="text" placeholder="Search programmes..." className="w-full bg-transparent border-none outline-none py-2 text-slate-600" />
        </div>
        <div className="h-8 w-px bg-slate-200"></div>
        <button className="px-6 py-2 text-slate-500 font-medium hover:text-indigo-600">Filters</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : programmes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No programmes found</h3>
          <p className="text-slate-500">Check back later or create a new one if you're a coordinator.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {programmes.map((p) => (
            <div key={p.id} onClick={() => setSelectedProgramme(p)} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                    {p.category || 'Health & Wellbeing'}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{p.title}</h3>
                </div>
                <div className="flex space-x-2">
                  {isCoordinator && (
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <p className="text-slate-600 mb-6 line-clamp-2">{p.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-sm text-slate-500">
                  <Clock className="w-4 h-4 mr-2 text-indigo-400" />
                  Starts {new Date(p.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <Users className="w-4 h-4 mr-2 text-indigo-400" />
                  {p.participants.length} Enrolled
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                      <img src={`https://picsum.photos/seed/${p.id}${i}/32/32`} alt="user" />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 text-indigo-600 text-[10px] flex items-center justify-center font-bold">
                    +{p.participants.length}
                  </div>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); handleJoinLeave(p.id, !p.participants.includes(user.id)); }}
                  disabled={p.participants.includes(user.id)}
                  className={`px-6 py-2 rounded-xl font-bold transition-all ${
                    p.participants.includes(user.id) 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                  }`}
                >
                  {p.participants.includes(user.id) ? 'Already Enrolled' : 'Join Programme'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Programmes;
