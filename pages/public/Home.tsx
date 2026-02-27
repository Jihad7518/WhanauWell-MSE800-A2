
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Users, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const Home: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-indigo-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://picsum.photos/seed/community/1920/1080?blur=4" 
            alt="Hero background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-4xl px-6 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
              Community Wellbeing, <span className="text-indigo-400">Simplified.</span>
            </h1>
            <p className="mt-6 text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
              WhānauWell helps organisations manage wellbeing programmes and monitor community stress levels ethically and culturally.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link 
              to="/programmes" 
              className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl flex items-center"
            >
              Browse Programmes <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              to="/auth/register" 
              className="bg-indigo-600 text-white border border-indigo-500 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl"
            >
              Join Our Community
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900">How WhānauWell Works</h2>
          <p className="text-slate-500 mt-4">A simple 3-step process to better community health.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              icon: Search, 
              title: "1. Browse", 
              desc: "Explore public wellbeing programmes designed for your community's needs." 
            },
            { 
              icon: LogIn, 
              title: "2. Join", 
              desc: "Create an account with your organisation's invite code to access member-only details." 
            },
            { 
              icon: Activity, 
              title: "3. Thrive", 
              desc: "Participate in programmes and track your wellbeing with our ethical stress assessment tools." 
            }
          ].map((step, i) => (
            <div key={i} className="text-center space-y-4 p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto">
                <step.icon className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy & Consent Summary */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <ShieldCheck className="w-16 h-16 text-indigo-400 mx-auto" />
          <h2 className="text-4xl font-bold">Privacy & Consent First</h2>
          <p className="text-xl text-slate-300 leading-relaxed">
            WhānauWell is built on the principle of data sovereignty. We never sell your data, and all wellbeing assessments are strictly confidential between you and your authorised organisation coordinators.
          </p>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-sm text-slate-400 italic">
            Note: WhānauWell provides wellbeing insights and is not a medical diagnosis tool. If you are in crisis, please contact professional health services immediately.
          </div>
          <Link to="/privacy" className="inline-block text-indigo-400 font-bold hover:underline">
            Read our full Privacy Policy
          </Link>
        </div>
      </section>
    </div>
  );
};

// Mock icons for the map since I can't import them inside the map easily without defining them
import { Search, LogIn, Activity } from 'lucide-react';

export default Home;
