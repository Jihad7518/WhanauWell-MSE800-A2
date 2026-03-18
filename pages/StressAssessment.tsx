
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StressQuestion, StressResult } from '../types';
import { BrainCircuit, ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, Info, ShieldCheck } from 'lucide-react';

const StressAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<StressQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<StressResult | null>(null);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/stress/questions');
        const data = await response.json();
        if (data.success) {
          setQuestions(data.data);
        }
      } catch (err) {
        console.error('Fetch questions error:', err);
        setError('Failed to load assessment questions.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleOptionSelect = (questionId: string, value: number) => {
    setResponses({ ...responses, [questionId]: value });
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const calculateStress = async () => {
    if (!consent) {
      setError('Please provide consent to save your assessment.');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const responseArray = Object.entries(responses).map(([questionId, value]) => ({
        questionId,
        value
      }));
      
      const response = await fetch('/api/stress/assess', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}`
        },
        body: JSON.stringify({ responses: responseArray, consentGiven: consent })
      });
      
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Failed to calculate stress level.');
      }
    } catch (err) {
      console.error('Assessment error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Loading assessment...</p>
      </div>
    );
  }

  if (result) {
    const getLevelColor = (level: string) => {
      switch (level) {
        case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        case 'Moderate': return 'text-amber-600 bg-amber-50 border-amber-100';
        case 'High': return 'text-rose-600 bg-rose-50 border-rose-100';
        default: return 'text-slate-600 bg-slate-50 border-slate-100';
      }
    };

    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full mb-6">
              <BrainCircuit className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Your Wellbeing Insight</h1>
            <p className="text-slate-500 mt-2">Based on your recent experiences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className={`p-8 rounded-2xl border-2 text-center flex flex-col items-center justify-center ${getLevelColor(result.classification)}`}>
              <span className="text-sm font-bold uppercase tracking-widest mb-2 opacity-70">Stress Level</span>
              <span className="text-5xl font-black mb-2">{result.classification}</span>
              <span className="text-lg font-medium opacity-80">Score: {result.score}/40</span>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Info className="w-5 h-5 mr-2 text-indigo-500" />
                What this means
              </h3>
              <p className="text-slate-600 leading-relaxed italic">
                "{result.explanation}"
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-500" />
              Recommended Next Steps
            </h3>
            <ul className="space-y-3">
              {result.recommendations?.map((rec, i) => (
                <li key={i} className="flex items-start text-slate-600">
                  <span className="w-5 h-5 bg-white rounded-full border border-slate-200 flex items-center justify-center text-[10px] font-bold mr-3 mt-0.5 shrink-0">{i+1}</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start space-x-3 text-amber-800 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>
              <strong>Disclaimer:</strong> This is not a medical diagnosis. If you are experiencing severe distress, please contact a healthcare professional or a crisis helpline immediately.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <button 
              onClick={() => navigate('/app/dashboard')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
              {currentStep + 1}
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Wellbeing Check-in</h2>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Question {currentStep + 1} of {questions.length}</p>
            </div>
          </div>
          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="min-h-[120px] mb-10">
          <h3 className="text-2xl font-bold text-slate-800 leading-tight">
            {currentQuestion.text}
          </h3>
          <p className="text-slate-500 mt-2 text-sm italic">Please select the option that best describes your experience over the last week.</p>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Never', value: 0 },
            { label: 'Almost Never', value: 1 },
            { label: 'Sometimes', value: 2 },
            { label: 'Fairly Often', value: 3 },
            { label: 'Very Often', value: 4 }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(currentQuestion.id, option.value)}
              className={`w-full p-4 rounded-2xl border-2 text-left font-bold transition-all flex justify-between items-center group ${
                responses[currentQuestion.id] === option.value
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <span>{option.label}</span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                responses[currentQuestion.id] === option.value
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-200 group-hover:border-indigo-300'
              }`}>
                {responses[currentQuestion.id] === option.value && <CheckCircle2 className="w-4 h-4" />}
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mt-10 pt-8 border-t border-slate-100">
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex items-center space-x-2 text-slate-400 hover:text-indigo-600 disabled:opacity-30 font-bold transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {currentStep === questions.length - 1 && responses[currentQuestion.id] ? (
            <div className="flex flex-col items-end space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                />
                <span className="text-xs text-slate-500 font-medium group-hover:text-slate-700 transition-colors">
                  I consent to WhānauWell securely storing this data for my wellbeing tracking.
                </span>
              </label>
              
              {error && <p className="text-rose-600 text-xs font-bold">{error}</p>}

              <button
                onClick={calculateStress}
                disabled={submitting || !consent}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center space-x-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Complete Assessment</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              disabled={!responses[currentQuestion.id]}
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 disabled:opacity-30 font-bold transition-colors"
            >
              <span>Next Question</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex items-start space-x-4">
        <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0" />
        <div>
          <h4 className="font-bold text-indigo-900 text-sm">Privacy & Ethics First</h4>
          <p className="text-indigo-700 text-xs mt-1 leading-relaxed">
            Your responses are encrypted and only accessible by you and authorized coordinators within your organisation to provide better support. We never sell your data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StressAssessment;
