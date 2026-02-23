
import React, { useState } from 'react';
import { User, UserRole, Programme } from '../types';
import { Plus, Search, MapPin, Clock, Users, ExternalLink, Trash2 } from 'lucide-react';

interface ProgrammesProps {
  user: User;
}

const Programmes: React.FC<ProgrammesProps> = ({ user }) => {
  const isCoordinator = user.role === UserRole.COORDINATOR || user.role === UserRole.ORG_ADMIN;
  
  const [programmes, setProgrammes] = useState<Programme[]>([
    {
      id: '1',
      title: 'Waitaha Yoga in the Park',
      description: 'Morning rejuvenation sessions focusing on breathing and community connection.',
      organisationId: user.organisationId,
      coordinatorId: 'coord_1',
      startDate: '2023-11-20',
      participants: ['u1', 'u2', 'u3']
    },
    {
      id: '2',
      title: 'Tech-Free Whānau Connect',
      description: 'Weekly potluck and board game evenings to disconnect from digital stress.',
      organisationId: user.organisationId,
      coordinatorId: 'coord_2',
      startDate: '2023-12-05',
      participants: ['u5', 'u10']
    },
    {
      id: '3',
      title: 'Youth Mentorship Programme',
      description: 'Supporting high school students with exam stress and career guidance.',
      organisationId: user.organisationId,
      coordinatorId: 'coord_1',
      startDate: '2024-01-15',
      participants: ['u20', 'u21', 'u22', 'u23', 'u24']
    }
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Community Programmes</h1>
          <p className="text-slate-500">Manage and join local wellbeing initiatives.</p>
        </div>
        {isCoordinator && (
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create New Programme</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
        <div className="flex-1 flex items-center px-4">
          <Search className="w-5 h-5 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search programmes..." 
            className="w-full bg-transparent border-none outline-none py-2 text-slate-600"
          />
        </div>
        <div className="h-8 w-px bg-slate-200"></div>
        <button className="px-6 py-2 text-slate-500 font-medium hover:text-indigo-600">Filters</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {programmes.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                  Health & Wellbeing
                </span>
                <h3 className="text-xl font-bold text-slate-900">{p.title}</h3>
              </div>
              <div className="flex space-x-2">
                {isCoordinator && (
                  <button className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6 line-clamp-2">
              {p.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-sm text-slate-500">
                <Clock className="w-4 h-4 mr-2 text-indigo-400" />
                Starts {new Date(p.startDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <Users className="w-4 h-4 mr-2 text-indigo-400" />
                {p.participants.length} Enrolled
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
               <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                     <img src={`https://picsum.photos/seed/${p.id}${i}/32/32`} alt="user" />
                   </div>
                 ))}
                 <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 text-indigo-600 text-[10px] flex items-center justify-center font-bold">
                   +{p.participants.length}
                 </div>
               </div>
               
               <button className={`px-6 py-2 rounded-xl font-bold transition-all ${
                 p.participants.includes(user.id) 
                 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                 : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
               }`}>
                 {p.participants.includes(user.id) ? 'Already Enrolled' : 'Join Programme'}
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Programmes;
