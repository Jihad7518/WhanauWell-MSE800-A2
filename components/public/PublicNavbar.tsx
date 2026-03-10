
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { User, Organisation } from '../../types';

interface PublicNavbarProps {
  user: User | null;
  organisation: Organisation | null;
  onLogout: () => void;
}

const PublicNavbar: React.FC<PublicNavbarProps> = ({ user, organisation, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Programmes', path: '/programmes' },
    { label: 'Host a Hub', path: '/host-hub' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className={`text-xl font-black tracking-tight ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
            WhānauWell
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`font-bold text-sm transition-colors ${
                location.pathname === link.path 
                ? 'text-indigo-600' 
                : isScrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-indigo-100 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link 
                to="/app/dashboard"
                className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <button 
                onClick={onLogout}
                className={`p-2 rounded-xl transition-colors ${isScrolled ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-indigo-200 hover:text-white hover:bg-white/10'}`}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <Link 
                to="/auth/login"
                className={`font-bold text-sm ${isScrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-indigo-100 hover:text-white'}`}
              >
                Log In
              </Link>
              <Link 
                to="/auth/register"
                className="bg-white text-indigo-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden p-2 rounded-xl ${isScrolled ? 'text-slate-900' : 'text-white'}`}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 space-y-6 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-slate-900 py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-6 border-t border-slate-100 flex flex-col space-y-4">
            {user ? (
              <>
                <Link 
                  to="/app/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-center"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full text-rose-600 font-bold py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-slate-600 font-bold py-2 text-center"
                >
                  Log In
                </Link>
                <Link 
                  to="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
