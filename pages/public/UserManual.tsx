
import React from 'react';
import { 
  BookOpen, 
  User, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  LayoutDashboard,
  Calendar,
  Activity,
  Users,
  Mail,
  Settings,
  Camera,
  Lock
} from 'lucide-react';

const UserManual: React.FC = () => {
  const sections = [
    { id: 'intro', title: 'Introduction', icon: BookOpen },
    { id: 'getting-started', title: 'Getting Started', icon: CheckCircle2 },
    { id: 'member', title: 'Whānau Member Guide', icon: User },
    { id: 'org-admin', title: 'Organisation Admin Guide', icon: Building2 },
    { id: 'super-admin', title: 'Super Admin Guide', icon: ShieldCheck },
    { id: 'faq', title: 'FAQ & Support', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-indigo-900 text-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full text-indigo-200 text-xs font-bold uppercase tracking-widest mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Official Documentation</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            WhānauWell <br />
            <span className="text-indigo-400">User Manual</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl leading-relaxed">
            Everything you need to know about using, managing, and scaling the WhānauWell platform. 
            From daily check-ins to global platform administration.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Contents</p>
            {sections.map((section) => (
              <a 
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all group"
              >
                <section.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold">{section.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-24 pb-32">
          {/* Introduction */}
          <section id="intro" className="scroll-mt-24 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900">Introduction</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                WhānauWell is a holistic wellbeing platform designed to empower community organisations (Hubs) 
                with ethical data tools. It bridges the gap between community service delivery and real-time 
                wellbeing insights, ensuring that every whānau receives the support they need.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Platform Architecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                    <User className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Whānau Members</h4>
                  <p className="text-xs text-slate-500">The heart of the platform. Users who participate in programmes and track their wellbeing.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 text-emerald-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Hub Admins</h4>
                  <p className="text-xs text-slate-500">Organisation leaders who manage local programmes, members, and community insights.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center mb-4 text-rose-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Super Admins</h4>
                  <p className="text-xs text-slate-500">Platform owners who manage Hub onboarding, global settings, and system health.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section id="getting-started" className="scroll-mt-24 space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900">Getting Started</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Whether you are a new member or a potential Hub partner, joining WhānauWell is simple.
              </p>
            </div>

            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                    <h3 className="text-2xl font-bold text-slate-900">Join a Hub</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    To join WhānauWell, you must first apply to a local Hub. Browse the "Organisations" page to find a Hub in your area.
                  </p>
                  <ul className="space-y-3 text-sm text-slate-500">
                    <li className="flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-indigo-500" /> Visit the Hub profile page</li>
                    <li className="flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-indigo-500" /> Click "Apply to Join"</li>
                    <li className="flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-indigo-500" /> Fill in your details and reason for joining</li>
                  </ul>
                </div>
                <div className="bg-white rounded-3xl overflow-hidden border-4 border-slate-200 shadow-2xl relative group">
                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                      <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="bg-white rounded-md px-2 py-0.5 text-[8px] text-slate-400 flex-1 truncate">whanauwell.org/organisations/waitaha-health</div>
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80" 
                    alt="Hub Application Preview" 
                    className="w-full aspect-video object-cover transition-all group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  <p className="absolute bottom-4 left-4 text-[10px] font-black text-white bg-indigo-600 px-2 py-1 rounded shadow-lg uppercase tracking-widest">Preview: Hub Application Page</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="bg-white rounded-3xl overflow-hidden border-4 border-slate-200 shadow-2xl relative group md:order-last">
                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                      <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="bg-white rounded-md px-2 py-0.5 text-[8px] text-slate-400 flex-1 truncate">whanauwell.org/auth/register</div>
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80" 
                    alt="Registration Preview" 
                    className="w-full aspect-video object-cover transition-all group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  <p className="absolute bottom-4 left-4 text-[10px] font-black text-white bg-indigo-600 px-2 py-1 rounded shadow-lg uppercase tracking-widest">Preview: Registration Page</p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <h3 className="text-2xl font-bold text-slate-900">Register with Invite Code</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Once your application is approved, you will receive an **Invite Code** via email. 
                    Use this code on the registration page to create your account.
                  </p>
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 font-medium">
                    Note: The Invite Code ensures you are connected to the correct Hub and that your data is managed by the right team.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Member Guide */}
          <section id="member" className="scroll-mt-24 space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900">Whānau Member Guide</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                As a member, your dashboard is your personal wellbeing hub.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Daily Stress Checks</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Complete a quick 10-question assessment daily to track your stress levels. 
                  This helps your Hub coordinators understand when you might need extra support.
                </p>
                <div className="bg-white rounded-2xl overflow-hidden border-2 border-slate-100 shadow-lg relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80" 
                    alt="Stress Check Preview" 
                    className="w-full aspect-video object-cover transition-all group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <p className="absolute bottom-2 left-2 text-[8px] font-black text-white bg-rose-600 px-1.5 py-0.5 rounded shadow-lg uppercase tracking-widest">Preview: Stress Check Page</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Browse Programmes</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Discover community events, workshops, and health programmes. 
                  You can enroll directly from the platform and see your upcoming schedule.
                </p>
                <div className="bg-white rounded-2xl overflow-hidden border-2 border-slate-100 shadow-lg relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1504868584819-f8e905263543?auto=format&fit=crop&w=600&q=80" 
                    alt="Programmes List Preview" 
                    className="w-full aspect-video object-cover transition-all group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <p className="absolute bottom-2 left-2 text-[8px] font-black text-white bg-indigo-600 px-1.5 py-0.5 rounded shadow-lg uppercase tracking-widest">Preview: Programmes List</p>
                </div>
              </div>
            </div>
          </section>

          {/* Org Admin Guide */}
          <section id="org-admin" className="scroll-mt-24 space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900">Organisation Admin Guide</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Hub Admins manage the local community and coordinate wellbeing efforts.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                  <LayoutDashboard className="w-6 h-6 mr-3 text-indigo-600" />
                  Admin Dashboard Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-indigo-500" />
                        Managing Applications
                      </h4>
                      <p className="text-sm text-slate-500">
                        Review new member requests. You can **Approve** (which generates an invite code) or **Reject** with a reason.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 flex items-center">
                        <Users className="w-4 h-4 mr-2 text-indigo-500" />
                        Member Management
                      </h4>
                      <p className="text-sm text-slate-500">
                        View your entire community list, update member roles (Member, Coordinator, Admin), or remove users if necessary.
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-3xl overflow-hidden border-4 border-slate-200 shadow-2xl relative group">
                    <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      </div>
                      <div className="bg-white rounded-md px-2 py-0.5 text-[8px] text-slate-400 flex-1 truncate">whanauwell.org/app/dashboard</div>
                    </div>
                    <img 
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" 
                      alt="Admin Dashboard Preview" 
                      className="w-full aspect-square object-cover transition-all group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <p className="absolute bottom-4 left-4 text-[10px] font-black text-white bg-indigo-600 px-2 py-1 rounded shadow-lg uppercase tracking-widest">Preview: Admin Dashboard</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                  <Settings className="w-6 h-6 mr-3 text-indigo-600" />
                  Hub Customisation
                </h3>
                <p className="text-slate-600 mb-6">
                  Navigate to **Organisation Profile** to manage how your Hub appears to the public. 
                  You can update your mission, history, and add **Impact Stories** to showcase your work.
                </p>
                <div className="bg-white rounded-3xl overflow-hidden border-4 border-slate-200 shadow-2xl relative group h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" 
                    alt="Org Profile Preview" 
                    className="w-full h-full object-cover transition-all group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <p className="absolute bottom-4 left-4 text-[10px] font-black text-white bg-indigo-600 px-2 py-1 rounded shadow-lg uppercase tracking-widest">Preview: Org Profile Settings</p>
                </div>
              </div>
            </div>
          </section>

          {/* Super Admin Guide */}
          <section id="super-admin" className="scroll-mt-24 space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900">Super Admin Guide</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Super Admins oversee the entire WhānauWell ecosystem.
              </p>
            </div>

            <div className="bg-slate-900 text-white p-12 rounded-[48px] space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Platform Onboarding</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Use the **Onboard Hub** feature to bring new organisations onto the platform. 
                    This creates a unique database partition and generates the initial admin credentials for the Hub.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1" />
                      <div>
                        <p className="font-bold">Global Insights</p>
                        <p className="text-xs text-slate-500">Monitor aggregated wellbeing trends across all Hubs.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1" />
                      <div>
                        <p className="font-bold">System Health</p>
                        <p className="text-xs text-slate-500">Track CPU, Memory, and Database performance in real-time.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 relative group shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80" 
                    alt="Super Admin Preview" 
                    className="w-full aspect-video object-cover transition-all group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <p className="absolute bottom-4 left-4 text-[10px] font-black text-white bg-rose-600 px-2 py-1 rounded shadow-lg uppercase tracking-widest">Preview: Super Admin Dashboard</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-24 space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900">FAQ & Support</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Common questions and troubleshooting tips.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { q: "I haven't received my invite code. What should I do?", a: "Check your spam folder first. If it's not there, contact your Hub admin directly or use the contact form on our website." },
                { q: "Can I join multiple Hubs?", a: "Currently, each account is linked to a single Hub to ensure data integrity and local coordination." },
                { q: "Is my data shared with other organisations?", a: "No. Your data is only visible to the coordinators and admins of the Hub you joined. Super Admins only see aggregated, anonymous trends." },
                { q: "How do I reset my password?", a: "Go to the login page and click 'Forgot Password' to receive a reset link via email." },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                  <h4 className="font-bold text-slate-900">{item.q}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>

            <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 text-center space-y-4">
              <h3 className="text-xl font-bold text-indigo-900">Still need help?</h3>
              <p className="text-indigo-700 text-sm">Our support team is available Mon-Fri, 9am - 5pm.</p>
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
                Contact Support
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserManual;
