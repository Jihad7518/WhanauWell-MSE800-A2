
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Programme } from '../../types';
import { Search, MapPin, Clock, Users, ArrowRight, Filter } from 'lucide-react';
import { motion } from 'motion/react';

const PublicProgrammes: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPublicProgrammes = async () => {
      try {
        const response = await fetch('/api/public/programmes');
        const data = await response.json();
        if (data.success) {
          setProgrammes(data.data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicProgrammes();
  }, []);

  const filteredProgrammes = programmes.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Community Programmes</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Explore public initiatives designed to support health, connection, and wellbeing in our community.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-2xl">
          <Search className="w-5 h-5 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search by title or category..." 
            className="w-full bg-transparent border-none outline-none py-3 text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-8 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 flex items-center hover:bg-slate-50 transition-all">
          <Filter className="w-5 h-5 mr-2" /> Filters
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredProgrammes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium text-lg">No public programmes found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProgrammes.map((p, i) => (
            <motion.div 
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${p._id}/600/400`} 
                  alt={p.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600">
                    {p.category || 'Wellbeing'}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {p.title}
                </h3>
                <p className="text-slate-600 line-clamp-3 text-sm leading-relaxed">
                  {p.publicSummary}
                </p>
                
                <div className="pt-4 space-y-2 border-t border-slate-50">
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock className="w-4 h-4 mr-2 text-indigo-400" />
                    Starts {new Date(p.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <MapPin className="w-4 h-4 mr-2 text-indigo-400" />
                    {p.location || 'Waitaha Community Centre'}
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  <Link 
                    to={`/programmes/${p._id}`}
                    className="w-full flex items-center justify-center px-6 py-3 bg-indigo-50 text-indigo-700 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    View Details <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicProgrammes;
