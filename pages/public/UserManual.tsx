
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

const ScreenshotPlaceholder: React.FC<{ title: string; description: string; role?: string }> = ({ title, description, role }) => (
  <div className="bg-slate-100 rounded-3xl overflow-hidden border-4 border-slate-200 shadow-xl relative group aspect-video flex flex-col items-center justify-center p-8 text-center space-y-4">
    <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
      <Camera className="w-8 h-8" />
    </div>
    <div className="space-y-2">
      <h4 className="font-black text-slate-900 uppercase tracking-tight">{title}</h4>
      <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">{description}</p>
    </div>
    {role && (
      <div className="absolute top-4 right-4">
        <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">
          {role}
        </span>
      </div>
    )}
    <div className="absolute inset-0 border-2 border-dashed border-slate-300 rounded-[20px] m-4 pointer-events-none"></div>
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
      <p className="text-[10px] font-bold text-slate-400 italic">[ User: Replace with actual screenshot ]</p>
    </div>
  </div>
);

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
      <div className="bg-slate-900 text-white py-32 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Official Documentation v1.0</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
            WhānauWell <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">User Manual</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            A comprehensive guide for members, coordinators, and administrators to navigate the WhānauWell ecosystem.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full -mr-40 -mt-40 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full -ml-20 -mb-20 blur-[80px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-4 gap-16">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">Documentation Index</p>
            {sections.map((section) => (
              <a 
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center space-x-4 px-6 py-4 rounded-2xl text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-100/50 transition-all group border border-transparent hover:border-slate-100"
              >
                <section.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black uppercase tracking-tight">{section.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-32 pb-32">
          {/* Introduction */}
          <section id="intro" className="scroll-mt-32 space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl font-black text-slate-900 tracking-tight">Introduction</h2>
              <div className="h-2 w-24 bg-indigo-600 rounded-full"></div>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                WhānauWell is a holistic wellbeing platform designed to empower community organisations 
                with ethical data tools. It bridges the gap between community service delivery and real-time 
                wellbeing insights, ensuring that every whānau receives the support they need.
              </p>
            </div>
            
            <div className="bg-white p-12 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50">
              <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Platform Roles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-indigo-200">
                    <User className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-slate-900 mb-3 uppercase tracking-tight">Whānau Members</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">The heart of the platform. Users who participate in programmes and track their wellbeing.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-emerald-200">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-slate-900 mb-3 uppercase tracking-tight">Org Admins</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">Organisation leaders who manage local programmes, members, and community insights.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-rose-200">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-slate-900 mb-3 uppercase tracking-tight">Super Admins</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">Platform owners who manage organisation onboarding, global settings, and system health.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section id="getting-started" className="scroll-mt-32 space-y-16">
            <div className="space-y-6">
              <h2 className="text-5xl font-black text-slate-900 tracking-tight">Getting Started</h2>
              <div className="h-2 w-24 bg-emerald-600 rounded-full"></div>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                Whether you are a new member or a potential partner organisation, joining WhānauWell is simple.
              </p>
            </div>

            <div className="space-y-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">1</div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Join an Organisation</h3>
                  </div>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    To join WhānauWell, you must first apply to a local organisation. Browse the "Organisations" page to find a provider in your area.
                  </p>
                  <div className="space-y-4">
                    {[
                      'Visit the Organisation profile page',
                      'Click "Apply to Join"',
                      'Fill in your details and reason for joining'
                    ].map((step, i) => (
                      <div key={i} className="flex items-center space-x-3 text-slate-500 font-bold">
                        <ArrowRight className="w-5 h-5 text-indigo-600" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <ScreenshotPlaceholder 
                  title="Organisation Profile Page" 
                  description="Screenshot of the public organisation profile page showing the 'Apply to Join' button."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="md:order-last space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">2</div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Register with Invite Code</h3>
                  </div>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Once your application is approved, you will receive an **Invite Code** via email. 
                    Use this code on the registration page to create your account.
                  </p>
                  <div className="p-6 bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl text-sm text-amber-800 font-bold">
                    The Invite Code ensures you are connected to the correct organisation and that your data is managed by the right team.
                  </div>
                </div>
                <ScreenshotPlaceholder 
                  title="Registration Page" 
                  description="Screenshot of the registration form where users enter their details and the invite code."
                />
              </div>
            </div>
          </section>

          {/* Member Guide */}
          <section id="member" className="scroll-mt-32 space-y-16">
            <div className="space-y-6">
              <h2 className="text-5xl font-black text-slate-900 tracking-tight">Whānau Member Guide</h2>
              <div className="h-2 w-24 bg-rose-600 rounded-full"></div>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                As a member, your dashboard is your personal wellbeing hub.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
                <div className="w-16 h-16 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-600 shadow-inner">
                  <Activity className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Daily Stress Checks</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    Complete a quick 10-question assessment daily to track your stress levels. 
                    This helps your coordinators understand when you might need extra support.
                  </p>
                </div>
                <ScreenshotPlaceholder 
                  title="Stress Check Interface" 
                  description="Screenshot of the stress check questionnaire showing the slider or scale inputs."
                  role="Member"
                />
              </div>

              <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
                <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 shadow-inner">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Browse Programmes</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    Discover community events, workshops, and health programmes. 
                    You can enroll directly from the platform and see your upcoming schedule.
                  </p>
                </div>
                <ScreenshotPlaceholder 
                  title="Programmes Browser" 
                  description="Screenshot of the 'Browse Programmes' page showing the list of available community activities."
                  role="Member"
                />
              </div>
            </div>
          </section>

          {/* Org Admin Guide */}
          <section id="org-admin" className="scroll-mt-32 space-y-16">
            <div className="space-y-6">
              <h2 className="text-5xl font-black text-slate-900 tracking-tight">Organisation Admin Guide</h2>
              <div className="h-2 w-24 bg-indigo-600 rounded-full"></div>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                Organisation Admins manage the local community and coordinate wellbeing efforts.
              </p>
            </div>

            <div className="space-y-12">
              <div className="bg-white p-12 rounded-[48px] border border-slate-100 shadow-2xl shadow-indigo-100/50 space-y-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-xl">
                      <LayoutDashboard className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Admin Dashboard</h3>
                  </div>
                  <div className="flex space-x-2">
                    <span className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest">Applications</span>
                    <span className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest">Members</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-xl font-black text-slate-900 flex items-center uppercase tracking-tight">
                        <Mail className="w-5 h-5 mr-3 text-indigo-600" />
                        Managing Applications
                      </h4>
                      <p className="text-slate-500 leading-relaxed font-medium">
                        Review new member requests. You can **Approve** (which generates an invite code) or **Reject** with a reason.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xl font-black text-slate-900 flex items-center uppercase tracking-tight">
                        <Users className="w-5 h-5 mr-3 text-indigo-600" />
                        Member Management
                      </h4>
                      <p className="text-slate-500 leading-relaxed font-medium">
                        View your entire community list, update member roles (Member, Coordinator, Admin), or remove users if necessary.
                      </p>
                    </div>
                  </div>
                  <ScreenshotPlaceholder 
                    title="Admin Dashboard View" 
                    description="Screenshot of the Org Admin dashboard showing the applications queue and member stats."
                    role="Org Admin"
                  />
                </div>
              </div>

              <div className="bg-white p-12 rounded-[48px] border border-slate-100 shadow-2xl shadow-emerald-100/50 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-emerald-600 text-white rounded-3xl flex items-center justify-center shadow-xl">
                      <Settings className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Profile Customisation</h3>
                  </div>
                  <p className="text-lg text-slate-600 leading-relaxed font-medium">
                    Navigate to **Organisation Profile** to manage how your organisation appears to the public. 
                    Update your mission, history, and add **Impact Stories** to showcase your work.
                  </p>
                </div>
                <ScreenshotPlaceholder 
                  title="Organisation Profile Editor" 
                  description="Screenshot of the profile editing interface where admins update their public information."
                  role="Org Admin"
                />
              </div>
            </div>
          </section>

          {/* Super Admin Guide */}
          <section id="super-admin" className="scroll-mt-32 space-y-16">
            <div className="space-y-6">
              <h2 className="text-5xl font-black text-slate-900 tracking-tight">Super Admin Guide</h2>
              <div className="h-2 w-24 bg-slate-900 rounded-full"></div>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                Super Admins oversee the entire WhānauWell ecosystem.
              </p>
            </div>

            <div className="bg-slate-900 text-white p-16 rounded-[64px] space-y-16 shadow-2xl shadow-slate-900/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black uppercase tracking-tighter">Platform Onboarding</h3>
                    <p className="text-slate-400 text-lg leading-relaxed font-medium">
                      Use the **Onboard Organisation** feature to bring new partners onto the platform. 
                      This creates a unique database partition and generates initial credentials.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {[
                      { title: 'Global Insights', desc: 'Monitor aggregated wellbeing trends across all organisations.' },
                      { title: 'System Health', desc: 'Track CPU, Memory, and Database performance in real-time.' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start space-x-4 bg-white/5 p-6 rounded-3xl border border-white/10">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 mt-1" />
                        <div>
                          <p className="font-black uppercase tracking-tight text-white">{item.title}</p>
                          <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <ScreenshotPlaceholder 
                  title="Super Admin Control Panel" 
                  description="Screenshot of the global administration dashboard showing system metrics and organisation requests."
                  role="Super Admin"
                />
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-32 space-y-16">
            <div className="space-y-6">
              <h2 className="text-5xl font-black text-slate-900 tracking-tight">FAQ & Support</h2>
              <div className="h-2 w-24 bg-indigo-600 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { q: "I haven't received my invite code. What should I do?", a: "Check your spam folder first. If it's not there, contact your organisation admin directly or use the contact form on our website." },
                { q: "Can I join multiple organisations?", a: "Currently, each account is linked to a single organisation to ensure data integrity and local coordination." },
                { q: "Is my data shared with other organisations?", a: "No. Your data is only visible to the coordinators and admins of the organisation you joined. Super Admins only see aggregated, anonymous trends." },
                { q: "How do I reset my password?", a: "Go to the login page and click 'Forgot Password' to receive a reset link via email." },
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all space-y-4">
                  <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight">{item.q}</h4>
                  <p className="text-slate-500 leading-relaxed font-medium">{item.a}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-16 rounded-[64px] text-center space-y-8 shadow-2xl shadow-indigo-200">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-md">
                <HelpCircle className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Still need help?</h3>
                <p className="text-indigo-100 text-lg font-medium max-w-md mx-auto">Our support team is available Mon-Fri, 9am - 5pm to assist with any technical issues.</p>
              </div>
              <button className="bg-white text-indigo-600 px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl">
                Contact Support Team
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserManual;
