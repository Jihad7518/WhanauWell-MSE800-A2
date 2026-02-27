
import React from 'react';
import { ShieldCheck, Users, Heart, Globe } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-20">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">About WhānauWell</h1>
        <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
          Empowering communities through data sovereignty and holistic wellbeing coordination.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
          <p className="text-slate-600 leading-relaxed">
            To provide community organisations with the tools they need to support their members while respecting individual privacy and cultural values.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Community Driven</h3>
          <p className="text-slate-600 leading-relaxed">
            WhānauWell is designed for community hubs, health trusts, and local initiatives that put people at the heart of their work.
          </p>
        </div>
      </div>

      <div className="bg-slate-50 p-12 rounded-3xl space-y-8">
        <h2 className="text-3xl font-bold text-slate-900 text-center">Built for Waitaha</h2>
        <p className="text-slate-600 text-center leading-relaxed">
          Originally developed to support the Waitaha Health Trust, WhānauWell has grown into a multi-tenant platform that can be adapted for any community organisation looking to bridge the gap between service delivery and wellbeing insight.
        </p>
      </div>
    </div>
  );
};

export default About;
