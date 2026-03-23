
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

      <div className="pt-20 border-t border-slate-100">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-black text-slate-900">Project Credits</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            WhānauWell was developed as a capstone project for the <strong>MSE800</strong> course, focusing on community-led digital transformation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 text-center group hover:border-indigo-200 transition-all">
            <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white text-3xl font-black mx-auto mb-6 shadow-xl shadow-indigo-100 group-hover:scale-105 transition-transform">
              MJ
            </div>
            <h3 className="text-2xl font-black text-slate-900">Md Jihad</h3>
            <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4">Lead Full Stack Developer</p>
            <div className="pt-6 border-t border-slate-50">
              <p className="text-slate-400 text-xs font-medium">Student ID: 270738616</p>
            </div>
          </div>
          
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 text-center group hover:border-slate-300 transition-all">
            <div className="w-24 h-24 bg-slate-900 rounded-[32px] flex items-center justify-center text-white text-3xl font-black mx-auto mb-6 shadow-xl shadow-slate-200 group-hover:scale-105 transition-transform">
              AB
            </div>
            <h3 className="text-2xl font-black text-slate-900">Andre Bendetti</h3>
            <p className="text-slate-600 font-bold text-sm uppercase tracking-widest mb-4">Backend Systems Architect</p>
            <div className="pt-6 border-t border-slate-50">
              <p className="text-slate-400 text-xs font-medium">MSE800 Research Team</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-2 bg-slate-100 rounded-full text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
            MSE800 Course Project • 2026
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
