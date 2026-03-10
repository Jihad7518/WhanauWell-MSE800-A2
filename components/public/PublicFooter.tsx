
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-black tracking-tight text-slate-900">WhānauWell</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Empowering communities with ethical wellbeing tools and data sovereignty.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link></li>
            <li><Link to="/programmes" className="hover:text-indigo-600 transition-colors">Programmes</Link></li>
            <li><Link to="/host-hub" className="hover:text-indigo-600 transition-colors font-bold text-indigo-600">Host a Hub</Link></li>
            <li><Link to="/about" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/privacy" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-indigo-600 transition-colors">Consent Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-6">Contact</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li className="flex items-center"><Mail className="w-4 h-4 mr-2" /> support@whanauwell.org</li>
            <li className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Waitaha Community Hub</li>
            <li className="flex items-center"><Phone className="w-4 h-4 mr-2" /> 0800-WHANAU</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} WhānauWell. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><ShieldCheck className="w-5 h-5" /></a>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
