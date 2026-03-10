
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Programme, User } from '../../types';
import { MapPin, Clock, Users, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, Loader2, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface PublicProgrammeDetailsProps {
  user: User | null;
}

const PublicProgrammeDetails: React.FC<PublicProgrammeDetailsProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', message: '' });
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Try authenticated endpoint first if user is logged in
        const endpoint = user ? `/api/programmes/${id}` : `/api/public/programmes/${id}`;
        const response = await fetch(endpoint, {
          headers: user ? { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` } : {}
        });
        const data = await response.json();
        if (data.success) {
          setProgramme(data.data);
        } else {
          setError(data.message || 'Programme not found');
        }
      } catch (err) {
        setError('Failed to load programme details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, user]);

  const handleJoin = async () => {
    if (!user) {
      navigate(`/auth/login?redirect=/programmes/${id}`);
      return;
    }

    setJoining(true);
    setError('');
    try {
      const response = await fetch(`/api/programmes/${id}/join`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Successfully joined the programme!');
        setProgramme(data.data);
      } else {
        setError(data.message || 'Failed to join');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);
    try {
      const response = await fetch('/api/public/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...applyForm,
          organisationId: programme?.organisationId
        })
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Application submitted! The Hub Admin will review your request and send an invite code to your email.');
        setShowApplyModal(false);
      } else {
        setError(data.message || 'Failed to submit application');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading programme details...</p>
      </div>
    );
  }

  if (error || !programme) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{error || 'Programme not found'}</h1>
        <Link to="/programmes" className="inline-flex items-center text-indigo-600 font-bold hover:underline">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to all programmes
        </Link>
      </div>
    );
  }

  const isEnrolled = user && programme.participants.includes(user.id);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <Link to="/programmes" className="inline-flex items-center text-slate-500 font-bold hover:text-indigo-600 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to programmes
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-6">
            <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={`https://picsum.photos/seed/${programme._id}/1200/800`} 
                alt={programme.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest text-indigo-600 shadow-lg">
                  {programme.category || 'Wellbeing'}
                </span>
              </div>
            </div>
            
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {programme.title}
            </h1>
          </div>

          <div className="space-y-8">
            <div className="prose prose-slate max-w-none">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Programme Overview</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                {programme.publicSummary}
              </p>
            </div>

            {user && programme.memberDetails && (
              <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-6">
                <div className="flex items-center space-x-3 text-indigo-900">
                  <ShieldCheck className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Member-Only Details</h3>
                </div>
                <div className="markdown-body text-indigo-800 leading-relaxed">
                  <ReactMarkdown>{programme.memberDetails}</ReactMarkdown>
                </div>
              </div>
            )}

            {!user && (
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 text-center space-y-4">
                <Users className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-xl font-bold text-slate-800">Want to see more?</h3>
                <p className="text-slate-500">Log in as a member to access full programme details, resources, and meeting links.</p>
                <div className="flex flex-col space-y-3">
                  <Link to="/auth/login" className="w-full bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all">
                    Log In to Access
                  </Link>
                  <button 
                    onClick={() => setShowApplyModal(true)}
                    className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
                  >
                    Apply for Membership
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 sticky top-24 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center text-slate-600">
                <Clock className="w-6 h-6 mr-4 text-indigo-500" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Next Session</p>
                  <p className="font-bold">{new Date(programme.startDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center text-slate-600">
                <MapPin className="w-6 h-6 mr-4 text-indigo-500" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Location</p>
                  <p className="font-bold">{programme.location || 'Waitaha Hub'}</p>
                </div>
              </div>

              <div className="flex items-center text-slate-600">
                <Users className="w-6 h-6 mr-4 text-indigo-500" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Enrolled</p>
                  <p className="font-bold">{programme.participants.length} Participants</p>
                </div>
              </div>
            </div>

            {success && (
              <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="text-sm font-bold">{success}</p>
              </div>
            )}

            <button 
              onClick={handleJoin}
              disabled={joining || isEnrolled}
              className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center space-x-2 ${
                isEnrolled 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
              }`}
            >
              {joining ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isEnrolled ? (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  <span>Already Enrolled</span>
                </>
              ) : (
                <span>Join Programme</span>
              )}
            </button>

            <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
              Secure Enrollment • Data Protected
            </p>
          </div>
        </div>
      </div>
      {/* Membership Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Apply to Join</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Request an Invite Code</p>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleApply} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <input 
                  required
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium"
                  placeholder="John Doe"
                  value={applyForm.name}
                  onChange={e => setApplyForm({...applyForm, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <input 
                  required
                  type="email"
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium"
                  placeholder="john@example.com"
                  value={applyForm.email}
                  onChange={e => setApplyForm({...applyForm, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Why do you want to join?</label>
                <textarea 
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium min-h-[100px]"
                  placeholder="Tell us a bit about yourself..."
                  value={applyForm.message}
                  onChange={e => setApplyForm({...applyForm, message: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                disabled={applying}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center"
              >
                {applying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicProgrammeDetails;
