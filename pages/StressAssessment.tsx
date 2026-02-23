
import React, { useState } from 'react';
import { User } from '../types';
import { 
  Moon, 
  Briefcase, 
  Smile, 
  ShieldCheck, 
  Info,
  CheckCircle2
} from 'lucide-react';

interface StressAssessmentProps {
  user: User;
}

const StressAssessment: React.FC<StressAssessmentProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    sleep: 5,
    workload: 5,
    mood: 5,
    consent: false
  });
  const [result, setResult] = useState<any>(null);

  const calculateStress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      alert("You must provide consent for your wellbeing data to be processed.");
      return;
    }

    // Business Logic (In actual app, this would be a call to StressService)
    const score = (10 - formData.sleep) + formData.workload + formData.mood;
    let classification: 'Low' | 'Moderate' | 'High' = 'Low';
    
    if (score > 10) classification = 'High';
    else if (score > 5) classification = 'Moderate';

    const mockResult = {
      score,
      classification,
      timestamp: new Date().toLocaleDateString(),
      advice: getAdvice(classification)
    };

    setResult(mockResult);
  };

  const getAdvice = (level: string) => {
    switch (level) {
      case 'Low': return 'You seem to be managing well. Keep maintaining your healthy routines!';
      case 'Moderate': return 'Your stress levels are elevated. Consider taking a short break or engaging in a social activity.';
      case 'High': return 'You are reporting high stress. We strongly recommend reaching out to your programme coordinator or a health professional.';
      default: return '';
    }
  };

  const Slider = ({ label, value, icon: Icon, field, description }: any) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">{label}</h4>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
        </div>
        <span className="text-2xl font-bold text-indigo-600">{value}</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => setFormData({ ...formData, [field]: parseInt(e.target.value) })}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
      <div className="flex justify-between text-xs text-slate-400 font-medium uppercase tracking-wider">
        <span>Lower</span>
        <span>Higher</span>
      </div>
    </div>
  );

  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className={`p-8 text-white text-center ${
            result.classification === 'High' ? 'bg-rose-500' : 
            result.classification === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'
          }`}>
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold">Assessment Complete</h2>
            <p className="opacity-80 mt-1">{result.timestamp}</p>
          </div>
          <div className="p-8 text-center space-y-6">
            <div>
              <p className="text-slate-500 uppercase tracking-widest font-bold text-xs mb-1">Your Stress Index</p>
              <div className="text-6xl font-black text-slate-900">{result.score}</div>
              <div className={`mt-2 inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${
                result.classification === 'High' ? 'bg-rose-100 text-rose-700' : 
                result.classification === 'Moderate' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {result.classification} Risk Profile
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 italic text-slate-600">
              "{result.advice}"
            </div>

            <button 
              onClick={() => setResult(null)}
              className="w-full py-4 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              Take Another Check
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Wellbeing Insight Check</h1>
        <p className="text-slate-500">How are you feeling today? This quick check helps our coordinators understand community trends and provides you with personal insight.</p>
      </div>

      <form onSubmit={calculateStress} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-12">
        <Slider 
          label="Sleep Quality" 
          description="How well rested do you feel today?"
          value={formData.sleep} 
          icon={Moon} 
          field="sleep" 
        />
        
        <Slider 
          label="Workload Intensity" 
          description="How demanding are your current responsibilities?"
          value={formData.workload} 
          icon={Briefcase} 
          field="workload" 
        />
        
        <Slider 
          label="Overall Mood" 
          description="General emotional state over the last 24 hours."
          value={formData.mood} 
          icon={Smile} 
          field="mood" 
        />

        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-start space-x-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-8">
            <div className="flex-shrink-0">
              <input
                type="checkbox"
                id="consent"
                required
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                className="w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 mt-1"
              />
            </div>
            <label htmlFor="consent" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
              <span className="font-bold text-indigo-900 block mb-1 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1 text-indigo-600" />
                Ethical Data Consent
              </span>
              I consent to WhānauWell storing my stress assessment data. I understand that my individual data is private, but aggregated trends will be visible to my organisation's coordinators to improve community support services.
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all text-lg"
          >
            Calculate Insight
          </button>
        </div>
      </form>

      <div className="mt-8 flex items-center justify-center space-x-4 text-slate-400 text-sm">
        <div className="flex items-center"><Info className="w-4 h-4 mr-1" /> Anonymous Data Aggregation</div>
        <div className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1" /> End-to-End Encryption</div>
      </div>
    </div>
  );
};

export default StressAssessment;
