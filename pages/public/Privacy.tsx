
import React from 'react';
import { Shield, Lock, EyeOff, FileText } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Privacy & Data Handling</h1>
        <p className="text-xl text-slate-500">Plain English explanations of how we protect your information.</p>
      </div>

      <div className="space-y-12">
        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Data Sovereignty</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Your data belongs to you. WhānauWell acts as a secure vault where your information is stored. We do not share, sell, or trade your personal information with third-party advertisers or data brokers.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Informed Consent</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Every time you participate in a wellbeing assessment, we ask for your explicit consent. You can choose not to save your results, and you can request the deletion of your records at any time through your programme coordinator.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <EyeOff className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Confidentiality</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Wellbeing assessments are confidential. Only authorised coordinators within your specific organisation have access to your results to provide you with the best possible support. Other members of your community cannot see your personal data.
          </p>
        </section>

        <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 space-y-4">
          <h3 className="text-lg font-bold text-amber-900 flex items-center">
            <Shield className="w-5 h-5 mr-2" /> Important Notice
          </h3>
          <p className="text-sm text-amber-800 leading-relaxed">
            WhānauWell is a support tool and does not provide medical advice or clinical diagnosis. Our platform is designed to facilitate community wellbeing coordination and should not replace professional medical consultation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
