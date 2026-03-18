
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  CheckCircle2, 
  UserPlus, 
  Mail, 
  MessageSquare, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

const MemberApplication: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orgIdFromUrl = searchParams.get('org');
  
  const [organisations, setOrganisations] = useState<any[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    organisationId: orgIdFromUrl || '',
    message: '',
    documentId: '',
    idType: 'National ID',
    reason: '',
    howDidYouHear: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await fetch('/api/public/organisations');
        const data = await res.json();
        if (data.success) {
          const filtered = data.data.filter((o: any) => o.code !== 'MASTER');
          setOrganisations(filtered);
          
          if (orgIdFromUrl) {
            const found = filtered.find((o: any) => o._id === orgIdFromUrl);
            if (found) setSelectedOrg(found);
          }
        }
      } catch (err) {
        console.error('Failed to fetch organisations');
      }
    };
    fetchOrgs();
  }, [orgIdFromUrl]);

  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setFormData({ ...formData, organisationId: id });
    const found = organisations.find(o => o._id === id);
    setSelectedOrg(found || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/public/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Failed to submit application');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-24 pb-20 max-w-2xl mx-auto px-6 text-center space-y-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-emerald-50 p-12 rounded-[48px] border border-emerald-100 space-y-6"
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">Application Received!</h2>
          <p className="text-slate-600 leading-relaxed">
            Thank you for your interest in joining <strong>{selectedOrg?.name || 'the organisation'}</strong>. 
            The hub coordinator will review your request and send an invite code to <strong>{formData.email}</strong> if approved.
          </p>
          <div className="pt-6">
            <Link 
              to="/"
              className="inline-flex items-center text-indigo-600 font-bold hover:translate-x-1 transition-transform"
            >
              Return Home <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left Column: Info */}
      <div className="space-y-8">
        <Link to="/" className="inline-flex items-center text-indigo-600 font-bold hover:text-indigo-700">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Apply for <span className="text-indigo-600">Membership</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
            WhānauWell is a community-first platform. To ensure privacy and data sovereignty, you need an invite code from an organisation to join their hub.
          </p>
        </div>

        <div className="space-y-6">
          {[
            { 
              icon: Building2, 
              title: "Select Your Hub", 
              desc: "Choose the community organisation you belong to or wish to join." 
            },
            { 
              icon: Mail, 
              title: "Receive Invite", 
              desc: "Approved members receive a unique invite code via email." 
            },
            { 
              icon: ShieldCheck, 
              title: "Ethical Data", 
              desc: "Your data remains yours, protected by our indigenous-first privacy principles." 
            }
          ].map((item, i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-10 md:p-12 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                required
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">Phone Number</label>
              <input 
                type="tel"
                placeholder="+64 123 4567"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">Organisation</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select 
                required
                value={formData.organisationId}
                onChange={handleOrgChange}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
              >
                <option value="">Select an organisation</option>
                {organisations.map(org => (
                  <option key={org._id} value={org._id}>{org.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">ID Type</label>
              <select 
                required
                value={formData.idType}
                onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
              >
                <option value="National ID">National ID</option>
                <option value="Passport">Passport</option>
                <option value="Driver License">Driver License</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">Document ID / Number</label>
              <input 
                required
                type="text"
                placeholder="ID Number"
                value={formData.documentId}
                onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">Detailed Reason for Joining</label>
            <textarea 
              required
              rows={3}
              placeholder="Why do you want to join this specific organisation?"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">How did you hear about us?</label>
            <input 
              type="text"
              placeholder="e.g., Social media, friend, community event..."
              value={formData.howDidYouHear}
              onChange={(e) => setFormData({ ...formData, howDidYouHear: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">Additional Message (Optional)</label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
              <textarea 
                rows={2}
                placeholder="Any other comments..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold">
              {error}
            </div>
          )}

          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Apply for Membership'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default MemberApplication;
