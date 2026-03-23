
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, Search, MapPin, Users, Activity } from 'lucide-react';
import { motion } from 'motion/react';

const PublicOrganisations: React.FC = () => {
  const [organisations, setOrganisations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await fetch('/api/public/organisations');
        const data = await res.json();
        if (data.success) {
          // Filter out MASTER hub
          setOrganisations(data.data.filter((o: any) => o.code !== 'MASTER'));
        }
      } catch (err) {
        console.error('Failed to fetch organisations');
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  const filteredOrgs = organisations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleOrgs = filteredOrgs.slice(0, visibleCount);

  return (
    <div className="pt-24 pb-20 space-y-12">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-slate-900 rounded-[48px] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://picsum.photos/seed/orgs/1920/1080?blur=4" 
              alt="Background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10 max-w-3xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
              Our Partner <span className="text-indigo-400">Organisations</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              WhānauWell partners with community-led organisations to provide ethical, culturally appropriate wellbeing support across the globe.
            </p>
            
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search organisations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-slate-100 rounded-[32px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleOrgs.map((org, i) => (
              <motion.div
                key={org._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group flex flex-col h-full"
              >
                <div className="p-8 space-y-6 flex flex-col h-full">
                  <div className="flex items-start justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:scale-110 transition-transform">
                      {org.logo ? (
                        <img src={org.logo} alt={org.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Building2 className="w-8 h-8 text-indigo-600" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <Users className="w-3 h-3" />
                      <span>Partner</span>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{org.name}</h3>
                    <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
                      {org.description || 'Dedicated to community wellbeing and whānau support through integrated services.'}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <Link 
                      to={`/organisations/${org._id}`}
                      className="inline-flex items-center text-indigo-600 font-bold text-sm hover:translate-x-1 transition-transform"
                    >
                      View Profile <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      Est. {org.foundedAt ? new Date(org.foundedAt).getFullYear() : '2024'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {visibleCount < filteredOrgs.length && (
          <div className="mt-16 text-center">
            <button 
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="bg-white border-2 border-slate-200 text-slate-600 px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              See More Organisations
            </button>
          </div>
        )}

        {!loading && filteredOrgs.length === 0 && (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No organisations found</h3>
            <p className="text-slate-500">Try adjusting your search terms.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default PublicOrganisations;
