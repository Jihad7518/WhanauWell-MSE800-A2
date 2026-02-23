
import React from 'react';
import { User, UserRole, Organisation } from '../types';
import { 
  LayoutDashboard, 
  Calendar, 
  Activity, 
  LogOut, 
  Settings,
  Users,
  ShieldCheck
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  organisation: Organisation;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: any) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, organisation, onLogout, currentPage, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: Object.values(UserRole) },
    { id: 'programmes', label: 'Programmes', icon: Calendar, roles: Object.values(UserRole) },
    { id: 'stress', label: 'Stress Check', icon: Activity, roles: [UserRole.MEMBER] },
    { id: 'members', label: 'Members', icon: Users, roles: [UserRole.ORG_ADMIN, UserRole.COORDINATOR] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
            <h1 className="text-xl font-bold tracking-tight">WhānauWell</h1>
          </div>
          <p className="text-xs text-indigo-300 mt-1 uppercase tracking-widest">{organisation.name}</p>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-1">
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id 
                ? 'bg-indigo-800 text-white shadow-inner' 
                : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-800">
          <button 
            onClick={() => onNavigate('profile')}
            className="w-full flex items-center space-x-3 mb-4 px-2 hover:bg-indigo-800 p-2 rounded-lg transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-indigo-300 truncate">{user.role.replace('_', ' ')}</p>
            </div>
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-indigo-200 hover:text-white hover:bg-red-600/20 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-800 capitalize">{currentPage}</h2>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onNavigate('profile')}
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
