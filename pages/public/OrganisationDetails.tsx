
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  Users, 
  Target, 
  History, 
  Award, 
  ArrowLeft,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

const OrganisationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const res = await fetch(`/api/public/organisations/${id}`);
        const data = await res.json();
        if (data.success) {
          setOrg(data.data);
        }
      } catch (err) {
        console.error('Fetch org error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Organisation not found</h2>
        <Link to="/" className="text-indigo-600 mt-4 inline-block">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://picsum.photos/seed/org/1920/1080?blur=4" 
            alt="Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link to="/" className="inline-flex items-center text-indigo-400 font-bold mb-8 hover:text-indigo-300">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-3xl bg-white p-4 flex items-center justify-center shadow-2xl">
              {org.logo ? (
                <img src={org.logo} alt={org.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              ) : (
                <Building2 className="w-16 h-16 text-indigo-600" />
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight">{org.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <span className="flex items-center text-indigo-300">
                  <Calendar className="w-4 h-4 mr-2" /> Founded {org.foundedAt ? new Date(org.foundedAt).getFullYear() : 'N/A'}
                </span>
                <span className="flex items-center text-indigo-300">
                  <Users className="w-4 h-4 mr-2" /> {org.memberCount} Members
                </span>
                <span className="flex items-center text-indigo-300">
                  <Activity className="w-4 h-4 mr-2" /> {org.programmeCount} Active Programmes
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* About */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">About Us</h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              {org.description || 'Dedicated to community wellbeing and whānau support.'}
            </p>
            {org.trackRecord && (
              <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start space-x-4">
                <CheckCircle2 className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <h4 className="font-bold text-indigo-900">Our Track Record</h4>
                  <p className="text-indigo-700">{org.trackRecord}</p>
                </div>
              </div>
            )}
          </section>

          {/* Mission & History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {org.mission && (
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">{org.mission}</p>
              </section>
            )}
            {org.history && (
              <section className="space-y-4">
                <div className="flex items-center space-x-3">
                  <History className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-2xl font-bold text-slate-900">Our History</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">{org.history}</p>
              </section>
            )}
          </div>

          {/* Impact Stories */}
          {org.impactStories && org.impactStories.length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center space-x-3">
                <Award className="w-6 h-6 text-indigo-600" />
                <h2 className="text-3xl font-bold text-slate-900">Impact & Success Stories</h2>
              </div>
              <div className="grid grid-cols-1 gap-8">
                {org.impactStories.map((story: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col md:flex-row"
                  >
                    {story.image && (
                      <div className="md:w-1/3 h-48 md:h-auto">
                        <img src={story.image} alt={story.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="p-8 flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-4">{story.title}</h4>
                      <p className="text-slate-600 leading-relaxed">{story.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm sticky top-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Join this Organisation</h3>
            <p className="text-slate-500 mb-8">If you are a member of {org.name}, you can apply to join their WhānauWell hub.</p>
            <Link 
              to={`/apply?org=${org._id}`}
              className="block w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-center hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Apply for Membership
            </Link>
            <div className="mt-8 pt-8 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center">
                WhānauWell ensures your data sovereignty and privacy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganisationDetails;
