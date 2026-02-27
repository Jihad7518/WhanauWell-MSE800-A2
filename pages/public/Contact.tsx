
import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Get in Touch</h1>
        <p className="text-xl text-slate-500">Have questions about WhānauWell? We're here to help.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1 space-y-8">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-900">Email Us</h3>
            <p className="text-sm text-slate-500">support@whanauwell.org</p>
          </div>
          
          <div className="space-y-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-900">Community Support</h3>
            <p className="text-sm text-slate-500">Available Mon-Fri, 9am - 5pm</p>
          </div>
        </div>

        <div className="md:col-span-2">
          {submitted ? (
            <div className="bg-emerald-50 p-12 rounded-3xl border border-emerald-100 text-center space-y-4 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
              <h2 className="text-2xl font-bold text-emerald-900">Message Sent!</h2>
              <p className="text-emerald-700">Thank you for reaching out. Our team will get back to you shortly.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-emerald-600 font-bold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Your Name</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <input required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Subject</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Message</label>
                <textarea required rows={5} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Tell us more..."></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center">
                Send Message <Send className="ml-2 w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
