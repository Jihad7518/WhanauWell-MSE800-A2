
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Save, 
  History, 
  Target, 
  Award, 
  Image as ImageIcon,
  Plus,
  Trash2,
  Globe,
  Calendar
} from 'lucide-react';
import { Organisation } from '../types';

interface OrganisationProfileProps {
  user: any;
}

const OrganisationProfile: React.FC<OrganisationProfileProps> = ({ user }) => {
  const [org, setOrg] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const res = await fetch('/api/organisation/me', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}` }
        });
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
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/organisation/me', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('whanauwell_token')}`
        },
        body: JSON.stringify(org)
      });
      const data = await res.json();
      if (data.success) {
        setOrg(data.data);
        setMessage({ type: 'success', text: 'Organisation profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  };

  const addImpactStory = () => {
    if (!org) return;
    const stories = org.impactStories || [];
    setOrg({
      ...org,
      impactStories: [...stories, { title: '', content: '', image: '' }]
    });
  };

  const removeImpactStory = (index: number) => {
    if (!org || !org.impactStories) return;
    const stories = [...org.impactStories];
    stories.splice(index, 1);
    setOrg({ ...org, impactStories: stories });
  };

  const updateImpactStory = (index: number, field: string, value: string) => {
    if (!org || !org.impactStories) return;
    const stories = [...org.impactStories];
    stories[index] = { ...stories[index], [field]: value };
    setOrg({ ...org, impactStories: stories });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!org) return <div>Organisation not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Organisation Profile</h1>
          <p className="text-slate-500">Manage how your organisation is presented to the public.</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 pb-20">
        {/* Basic Info */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Organisation Name</label>
              <input 
                type="text" 
                value={org.name}
                onChange={(e) => setOrg({ ...org, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Logo URL</label>
              <input 
                type="text" 
                value={org.logo || ''}
                onChange={(e) => setOrg({ ...org, logo: e.target.value })}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Founded Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="date" 
                  value={org.foundedAt ? org.foundedAt.split('T')[0] : ''}
                  onChange={(e) => setOrg({ ...org, foundedAt: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Track Record Summary</label>
              <input 
                type="text" 
                value={org.trackRecord || ''}
                onChange={(e) => setOrg({ ...org, trackRecord: e.target.value })}
                placeholder="e.g. Over 500 whānau supported since 2020"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Short Description</label>
            <textarea 
              value={org.description || ''}
              onChange={(e) => setOrg({ ...org, description: e.target.value })}
              rows={3}
              placeholder="A brief overview of what your organisation does..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Mission & History */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Our Mission</h3>
              </div>
              <textarea 
                value={org.mission || ''}
                onChange={(e) => setOrg({ ...org, mission: e.target.value })}
                rows={6}
                placeholder="What is your organisation's core purpose?"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <History className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Our History</h3>
              </div>
              <textarea 
                value={org.history || ''}
                onChange={(e) => setOrg({ ...org, history: e.target.value })}
                rows={6}
                placeholder="Tell the story of how your organisation started..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Impact Stories */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">Impact & Success Stories</h2>
            </div>
            <button 
              type="button"
              onClick={addImpactStory}
              className="flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-bold"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Story
            </button>
          </div>

          <div className="space-y-6">
            {org.impactStories?.map((story, index) => (
              <div key={index} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative group">
                <button 
                  type="button"
                  onClick={() => removeImpactStory(index)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Story Title</label>
                    <input 
                      type="text" 
                      value={story.title}
                      onChange={(e) => updateImpactStory(index, 'title', e.target.value)}
                      placeholder="e.g. Supporting the Smith Whānau"
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image URL (Optional)</label>
                    <input 
                      type="text" 
                      value={story.image || ''}
                      onChange={(e) => updateImpactStory(index, 'image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content</label>
                  <textarea 
                    value={story.content}
                    onChange={(e) => updateImpactStory(index, 'content', e.target.value)}
                    rows={4}
                    placeholder="Describe the impact or success story..."
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>
              </div>
            ))}
            {(!org.impactStories || org.impactStories.length === 0) && (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">
                <p className="text-slate-400">No impact stories added yet. Share your success!</p>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="fixed bottom-8 right-8 z-10">
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganisationProfile;
