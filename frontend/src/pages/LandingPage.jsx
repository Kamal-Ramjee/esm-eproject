import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH REAL-TIME EXPOS ---
  useEffect(() => {
    const fetchExpos = async () => {
      try {
        // If your GET /api/expos route is public, no config is needed.
        // If it's private, uncomment the next 2 lines:
        // const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        // const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

        const { data } = await axios.get('http://localhost:5000/api/expos');
        setExpos(data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpos();
  }, []);

  return (
    <div className="font-sans text-gray-700 antialiased bg-white selection:bg-blue-200 selection:text-blue-900">

      {/* Inline Styles for specific animations */}
      <style>{`
        html { scroll-behavior: smooth; }
        .fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; transform: translateY(20px); }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .animate-blob { animation: blob 7s infinite; }
        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>

      {/* NAVIGATION */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                <i className="fa-solid fa-layer-group"></i>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">EventSphere Management</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#events" className="text-gray-600 hover:text-blue-600 font-medium transition">Expos</a>
              <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 font-medium transition">Stories</a>
              <a href="#why-us" className="text-gray-600 hover:text-blue-600 font-medium transition">Why Us</a>
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-gray-900 font-medium hover:text-blue-600">Log in</Link>

              {/* TRIGGER SIGN UP MODE */}
              <Link to="/login" state={{ isSignUp: true }} className="bg-blue-600 hover:bg-blue-800 text-white px-5 py-2.5 rounded-full font-medium transition shadow-lg shadow-blue-500/30">
                Register Now
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <a href="#events" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md">Expos</a>
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md">Features</a>
              <Link to="/login" className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-gray-50 rounded-md">Log In</Link>

              {/* TRIGGER SIGN UP MODE (Mobile) */}
              <Link to="/login" state={{ isSignUp: true }} className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-gray-50 rounded-md">Sign Up</Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            <div className="max-w-2xl fade-in-up">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-sm font-medium mb-6">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                Trusted by 500+ Corporations
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Connected <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Exhibitions</span> For The Digital Age
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                The most advanced expo management platform. Simplify booth booking, exhibitor onboarding, and attendee engagement with our all-in-one solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login" state={{ isSignUp: true }} className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-900 shadow-lg shadow-blue-500/30 transition">
                  Explores Expos
                </Link>
                <a href="#features" className="inline-flex justify-center items-center px-8 py-3.5 border border-gray-200 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition">
                  Core Features
                </a>
              </div>

              <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  <img src="https://randomuser.me/api/portraits/men/1.jpg" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src="https://randomuser.me/api/portraits/women/2.jpg" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src="https://randomuser.me/api/portraits/men/3.jpg" className="w-8 h-8 rounded-full border-2 border-white" />
                </div>
                <p>Loved by 50,000+ exhibitors worldwide</p>
              </div>
            </div>

            <div className="relative lg:ml-10 fade-in-up delay-200">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50">
                <img src={expos[0]?.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80"} alt="Expo Preview" className="w-full h-auto" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 hidden sm:block border border-slate-100 animate-bounce">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <i className="fa-solid fa-chart-line text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-800">100%</p>
                    <p className="text-sm text-slate-500">Seamless Booking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PARTNERS --- */}
      <section className="py-12 bg-white border-y border-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Powering top industry events</p>
          <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <i className="fa-brands fa-google text-4xl"></i>
            <i className="fa-brands fa-microsoft text-4xl"></i>
            <i className="fa-brands fa-amazon text-4xl"></i>
            <i className="fa-brands fa-apple text-4xl"></i>
            <i className="fa-brands fa-meta text-4xl"></i>
          </div>
        </div>
      </section>

      {/* --- LIVE EVENTS SECTION --- */}
      <section id="events" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Upcoming Global Expos</h2>
              <p className="text-gray-600 mt-4 text-lg">Secure your spot in the most anticipated industry gatherings.</p>
            </div>
            <Link to="/login" className="text-blue-600 font-bold hover:text-blue-800 transition items-center hidden sm:flex">
              Explore All <i className="fa-solid fa-arrow-right ml-2 text-sm"></i>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(n => <div key={n} className="h-96 bg-gray-200 animate-pulse rounded-3xl"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {expos.map((expo) => (
                <div key={expo._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
                  <div className="h-56 relative overflow-hidden">
                    {/* Thumbnail with actual image */}
                    <img src={expo.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"} alt={expo.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider border border-white/30">
                      {new Date(expo.startDate) > new Date() ? 'Open' : 'Ongoing'}
                    </div>
                    <div className="absolute bottom-4 left-6">
                      <h3 className="text-2xl font-bold text-white leading-tight">{expo.title}</h3>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center text-gray-600 font-medium italic">
                        <i className="fa-solid fa-calendar-day w-6 text-blue-600 text-lg"></i>
                        {new Date(expo.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center text-gray-600 font-medium italic">
                        <i className="fa-solid fa-location-dot w-6 text-indigo-600 text-lg"></i>
                        {expo.location}
                      </div>
                      <div className="flex items-center text-gray-600 font-medium italic">
                        <i className="fa-solid fa-bolt w-6 text-amber-500 text-lg"></i>
                        {expo.totalBooths || 0} Booths Available
                      </div>
                    </div>
                    <Link
                      to={`/expo/${expo._id}`}
                      className="mt-auto block w-full text-center py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-slate-900/10"
                    >
                      View Event Details
                    </Link>
                  </div>
                </div>
              ))}
              {expos.length === 0 && <p className="text-gray-500 col-span-3 text-center py-10 italic">More exciting expos coming soon...</p>}
            </div>
          )}
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-24 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div>
              <p className="text-4xl lg:text-5xl font-bold mb-2">500+</p>
              <p className="text-blue-100 uppercase tracking-widest text-sm font-bold">Expos Managed</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-bold mb-2">2M+</p>
              <p className="text-blue-100 uppercase tracking-widest text-sm font-bold">Attendees</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-bold mb-2">15k+</p>
              <p className="text-blue-100 uppercase tracking-widest text-sm font-bold">Exhibitors</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-bold mb-2">45+</p>
              <p className="text-blue-100 uppercase tracking-widest text-sm font-bold">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Built For Professional Organizers</h2>
            <p className="text-lg text-gray-600">Scale your events from small local gatherings to international massive trade shows with ease.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard icon="fa-th" bg="bg-blue-50" color="text-blue-600" title="Booth Management" desc="Real-time booth status, visual assignment, and easy approval workflow for organizers." />
            <FeatureCard icon="fa-id-card" bg="bg-indigo-50" color="text-indigo-600" title="Exhibitor Hub" desc="Dedicated portal for exhibitors to manage profiles, request booths, and showcase products." />
            <FeatureCard icon="fa-calendar-check" bg="bg-emerald-50" color="text-emerald-600" title="Scheduling" desc="Build complex multi-day schedules with speakers, sessions, and live tracking." />
          </div>
        </div>
      </section>

      {/* --- WHY US (ONE PAGE EXTRA SECTION) --- */}
      <section id="why-us" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img src="https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=1000&q=80" alt="Exhibitor Portal" className="rounded-3xl shadow-2xl" />
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose EventSphere Management?</h2>
              <p className="text-lg text-gray-600">We don't just manage events; we create ecosystems where business thrives. Our platform is designed by expo veterans for new-age demands.</p>

              <div className="space-y-6">
                <CheckItem title="Enterprise Grade Security" desc="All your data is encrypted and backed by AWS infrastructure." />
                <CheckItem title="24/7 Priority Support" desc="Our team is here to help you through the high-pressure event days." />
                <CheckItem title="Fully White-labeled" desc="Your brand, your colors, our powerful engine." />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Success Stories</h2>
            <p className="text-gray-600 mt-4 text-lg">Don't just take our word for it.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <TestimonialCard
              text="The Exhibitor Portal is a game-changer. We saw a 40% increase in self-service booth bookings within the first month of migration."
              name="Marcus Aurelius"
              role="Head of Ops, TechCon 2025"
              img="https://randomuser.me/api/portraits/men/44.jpg"
            />
            <TestimonialCard
              text="Finally a platform that understands how expos work. The admin interface is clean, fast, and remarkably intuitive."
              name="Elena Gilbert"
              role="Organizer, FashionWeek Milan"
              img="https://randomuser.me/api/portraits/women/32.jpg"
            />
            <TestimonialCard
              text="Our attendees loved the digital scheduling. Engagement metrics were off the charts compared to our previous paper-based system."
              name="David Rossi"
              role="Director, BuildIt Expo"
              img="https://randomuser.me/api/portraits/men/68.jpg"
            />
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl border border-white/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full -ml-20 -mb-20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to lead your next expo?</h2>
              <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">Join the world's most innovative event planners. Transform your manual processes into a digital powerhouse.</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/login" state={{ isSignUp: true }} className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold hover:bg-blue-700 transition transform hover:scale-105 shadow-xl shadow-blue-600/20">Get Started for Free</Link>
                <button className="bg-transparent border-2 border-slate-700 text-white px-10 py-4 rounded-full font-bold hover:bg-white/5 transition">Talk to an Expert</button>
              </div>
              <p className="mt-8 text-sm text-slate-500 font-medium">No installation required • Setup in under 10 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-50 pt-20 pb-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">E</div>
                <span className="font-bold text-2xl text-slate-900">EventSphere Management</span>
              </div>
              <p className="text-slate-500 max-w-xs leading-relaxed">
                Redefining the exhibition landscape through digital innovation and seamless connectivity.
              </p>
              <div className="flex gap-4 mt-8">
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition"><i className="fa-brands fa-x-twitter"></i></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition"><i className="fa-brands fa-instagram"></i></a>
              </div>
            </div>
            <FooterColumn title="Platform" links={['Management', 'Exhibitor Portal', 'Analytics', 'Ticketing']} />
            <FooterColumn title="Resources" links={['Documentation', 'API Reference', 'Case Studies', 'Help Center']} />
            <FooterColumn title="Company" links={['About Us', 'Careers', 'Contact', 'Privacy Policy']} />
          </div>
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm italic">&copy; 2026 EventSphere Management Inc. Designed with excellence for professionals.</p>
            <div className="flex gap-8 text-sm text-slate-400 font-medium">
              <a href="#" className="hover:text-blue-600 transition">Terms</a>
              <a href="#" className="hover:text-blue-600 transition">Privacy</a>
              <a href="#" className="hover:text-blue-600 transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* --- Helper Components --- */
const FeatureCard = ({ icon, color, bg, title, desc }) => (
  <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition duration-500 group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] group-hover:bg-blue-50 transition duration-500"></div>
    <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center ${color} mb-8 group-hover:scale-110 transition duration-500 relative z-10`}>
      <i className={`fa-solid ${icon} text-2xl`}></i>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">{title}</h3>
    <p className="text-gray-600 leading-relaxed text-lg relative z-10">{desc}</p>
  </div>
);
const CheckItem = ({ title, desc }) => (
  <div className="flex gap-6 group">
    <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition duration-300">
      <i className="fa-solid fa-check text-blue-600 group-hover:text-white transition duration-300"></i>
    </div>
    <div>
      <h4 className="text-xl font-bold text-slate-800">{title}</h4>
      <p className="text-slate-500 mt-1 leading-relaxed">{desc}</p>
    </div>
  </div>
);
const TestimonialCard = ({ text, name, role, img }) => (
  <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50 hover:shadow-xl transition duration-500">
    <div className="text-amber-400 text-lg mb-6 flex gap-1">
      {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
    </div>
    <p className="text-gray-700 italic mb-8 text-lg leading-relaxed">"{text}"</p>
    <div className="flex items-center gap-4">
      <img src={img} className="w-14 h-14 rounded-2xl object-cover shadow-lg" alt={name} />
      <div>
        <p className="font-bold text-gray-900 text-lg">{name}</p>
        <p className="text-blue-600 text-sm font-bold uppercase tracking-widest">{role}</p>
      </div>
    </div>
  </div>
);
const FooterColumn = ({ title, links }) => (
  <div>
    <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-sm">{title}</h4>
    <ul className="space-y-4 font-medium text-slate-500">
      {links.map((link, i) => (
        <li key={i}><a href="#" className="hover:text-blue-600 transition tracking-tight">{link}</a></li>
      ))}
    </ul>
  </div>
);

export default LandingPage;