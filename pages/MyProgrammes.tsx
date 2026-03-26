
import React, { useState, useEffect } from 'react';
import { User, Programme } from '../types';
import { Calendar, MapPin, Clock, Users, X, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MyProgrammesProps {
  user: User;
}

const MyProgrammes: React.FC<MyProgrammesProps> = ({ user }) => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchMyProgrammes = async () => {
    try {
      const response = await fetch('/api/my-programmes', {
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
    fetchMyProgrammes();
  }, []);

  const handleLeave = async (id: string) => {
    try {
      const response = await fetch(`/api/programmes/${id}/leave`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchMyProgrammes();
        setSelectedProgramme(null);
        setNotification({ type: 'success', message: 'Successfully left the programme.' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to leave programme.' });
    } finally {
      setTimeout(() => setNotification(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Details Modal */}
      {selectedProgramme && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="relative h-48 bg-indigo-600">
              <img src={`https://picsum.photos/seed/${selectedProgramme._id}/800/400`} className="w-full h-full object-cover opacity-50" alt="programme" />
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
                <p className="text-slate-600 leading-relaxed mb-4">{selectedProgramme.publicSummary}</p>
                {selectedProgramme.memberDetails && (
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <h5 className="text-sm font-bold text-indigo-900 mb-2">Member Resources & Schedule</h5>
                    <div className="text-sm text-indigo-800 whitespace-pre-wrap">
                      {selectedProgramme.memberDetails}
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Coordinator: <span className="font-bold text-slate-800">{(selectedProgramme as any).coordinatorId?.name || 'Community Leader'}</span>
                </div>
                <button 
                  onClick={() => handleLeave(selectedProgramme._id!)}
                  className="px-6 py-2 bg-white border border-rose-200 text-rose-600 rounded-xl font-bold hover:bg-rose-50 transition-all"
                >
                  Leave Programme
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Enrolled Programmes</h1>
          <p className="text-slate-500">View your schedule and access member-only resources.</p>
        </div>
        <Link to="/app/programmes" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Browse More</span>
        </Link>
      </div>

      {notification && (
        <div className={`p-4 rounded-xl flex items-center justify-between animate-in slide-in-from-top duration-300 ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
        }`}>
          <div className="flex items-center space-x-3">
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
          <button onClick={() => setNotification(null)} className="p-1 hover:bg-white/50 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {programmes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900">No active enrollments</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven't joined any community programmes yet. Browse the programmes to find activities that interest you.</p>
          <Link to="/app/programmes" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            Browse Programmes
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programmes.map((p) => (
            <div key={p._id} onClick={() => setSelectedProgramme(p)} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full">
              <div className="h-40 relative">
                <img src={`https://picsum.photos/seed/${p._id}/400/200`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                    {p.category || 'Health'}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{p.title}</h3>
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                    Starts {new Date(p.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                    {p.location || 'Community Hub'}
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                    Active Enrollment
                  </span>
                  <div className="text-indigo-600 font-bold text-xs flex items-center">
                    View Details
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProgrammes;
