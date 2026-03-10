
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Mail, Send, CheckCircle2, ArrowRight, ShieldCheck, Users, Globe } from 'lucide-react';

const HostHub: React.FC = () => {
  const [form, setForm] = useState({ name: '', contactName: '', email: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/public/apply-org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center space-y-8">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-100">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Application Received!</h1>
        <p className="text-xl text-slate-500 max-w-xl mx-auto leading-relaxed">
          Thank you for your interest in WhānauWell. Our platform administrators will review your request and contact you shortly to discuss onboarding your organisation.
        </p>
        <div className="pt-8">
          <a href="/" className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
            Return Home <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-10">
          <div className="space-y-6">
            <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">
              For Organisations
            </span>
            <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Empower Your <span className="text-indigo-600">Community</span> with WhānauWell.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              WhānauWell provides the digital infrastructure for health trusts, community groups, and wellness organisations to manage their programmes and monitor whānau wellbeing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: ShieldCheck, title: 'Secure Data', desc: 'Enterprise-grade security for whānau information.' },
              { icon: Users, title: 'Member Management', desc: 'Easily manage enrollments and participation.' },
              { icon: Globe, title: 'Public Discovery', desc: 'Showcase your programmes to the wider community.' },
              { icon: Building2, title: 'Custom Branding', desc: 'Your own dedicated hub for your organisation.' },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-3xl space-y-3">
                <feature.icon className="w-6 h-6 text-indigo-600" />
                <h3 className="font-bold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 space-y-8"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900">Apply to Host</h2>
            <p className="text-slate-500 font-medium">Tell us about your organisation and we'll get in touch.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Organisation Name</label>
              <div className="relative">
                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  required
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium"
                  placeholder="e.g. Waitaha Health Trust"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Person</label>
                <input 
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium"
                  placeholder="Your Name"
                  value={form.contactName}
                  onChange={e => setForm({...form, contactName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    required
                    type="email"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium"
                    placeholder="name@org.com"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Why do you want to join?</label>
              <textarea 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium min-h-[120px]"
                placeholder="Briefly describe your organisation's mission..."
                value={form.reason}
                onChange={e => setForm({...form, reason: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center space-x-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Submit Application</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default HostHub;
