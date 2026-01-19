import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExpoDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [expo, setExpo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // States for Exhibitor Registration Modal
    const [showExhibitorModal, setShowExhibitorModal] = useState(false);
    const [regData, setRegData] = useState({ companyTitle: '', shortDescription: '', serviceType: '' });
    const [userRole, setUserRole] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    const [booths, setBooths] = useState([]);
    const [sessions, setSessions] = useState([]);

    const getConfig = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return userInfo?.token ? { headers: { Authorization: `Bearer ${userInfo.token}` } } : {};
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // parallel fetch all required data
                const [expoRes, boothRes, sessionRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/expos/${id}`),
                    axios.get(`http://localhost:5000/api/expos/${id}/booths`),
                    axios.get(`http://localhost:5000/api/sessions/${id}`)
                ]);

                setExpo(expoRes.data);
                setBooths(boothRes.data);
                setSessions(sessionRes.data);

                // Check registration status if logged in
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (userInfo) {
                    setUserRole(userInfo.role);
                    const { data: regs } = await axios.get('http://localhost:5000/api/attendees/registrations', getConfig());
                    const registered = regs.some(r => {
                        const regExpoId = r.expo?._id || r.expo;
                        return regExpoId === id;
                    });
                    setIsRegistered(registered);
                }

                setLoading(false);
            } catch (err) {
                console.error("Critical error in ExpoDetails:", err);
                setError(err.response?.data?.message || "Failed to load event data");
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleExhibitorClick = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            navigate('/login');
            return;
        }
        if (userInfo.role !== 'exhibitor') {
            alert("You must be logged in as an Exhibitor to register a booth.");
            return;
        }

        try {
            const { data } = await axios.get('http://localhost:5000/api/auth/profile', getConfig());
            const details = data.companyDetails || {};
            setRegData({
                companyTitle: data.name || '',
                shortDescription: details.description || '',
                serviceType: details.serviceType || ''
            });
            setShowExhibitorModal(true);
        } catch (e) {
            setShowExhibitorModal(true);
        }
    };

    const submitExhibitorRegistration = async () => {
        try {
            await axios.post(`http://localhost:5000/api/attendees/expo/${id}/register`, regData, getConfig());
            alert(`Successfully registered! Check the dashboard to manage your participation.`);
            setShowExhibitorModal(false);
            setIsRegistered(true);
            navigate('/dashboard/registered-expos');
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        }
    };

    const handleAttendeeJoin = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            navigate('/login');
            return;
        }
        try {
            await axios.post(`http://localhost:5000/api/attendees/expo/${id}/register`, {}, getConfig());
            alert("Registration successful! You can now access all event features.");
            setIsRegistered(true);
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-slate-400 animate-pulse">Syncing with EventSphere Management...</p>
        </div>
    );

    if (error || !expo) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-triangle-exclamation text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h2>
            <p className="text-slate-500 mb-8">{error || "The event you're looking for was not found."}</p>
            <Link to="/" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Return Home</Link>
        </div>
    );

    return (
        <div className="bg-white min-h-screen font-sans">
            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 h-20 flex items-center">
                <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 leading-none">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold"><i className="fa-solid fa-layer-group"></i></div>
                        EventSphere Management
                    </Link>
                    <div className="flex gap-4">
                        <Link to="/dashboard" className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-slate-800 transition">Go to Dashboard</Link>
                    </div>
                </div>
            </nav>

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="fade-in-up">
                            <div className="flex gap-3 mb-6">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">Live Event</span>
                                {isRegistered && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Registered</span>}
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-8">{expo.title}</h1>

                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-4 text-slate-500 font-bold">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-indigo-600"><i className="fa-solid fa-calendar"></i></div>
                                    <span>{new Date(expo.startDate).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-500 font-bold">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-indigo-600"><i className="fa-solid fa-location-dot"></i></div>
                                    <span>{expo.location}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {isRegistered ? (
                                    <div className="flex items-center gap-4 bg-emerald-50 text-emerald-700 px-8 py-4 rounded-2xl border border-emerald-100 font-black text-sm uppercase tracking-widest">
                                        <i className="fa-solid fa-circle-check"></i> Registration Confirmed
                                    </div>
                                ) : (
                                    <>
                                        <button onClick={handleAttendeeJoin} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition">Register Now</button>
                                        <button onClick={handleExhibitorClick} className="px-10 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition">Book Booth</button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-4 bg-indigo-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                            <img src={expo.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
                                className="w-full aspect-[4/3] object-cover rounded-[3rem] shadow-2xl relative z-10" alt="Event Cover" />
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-24 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2">
                            <h2 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-3">
                                <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                                Scheduled Sessions
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {sessions.length > 0 ? (
                                    sessions.map(session => (
                                        <div key={session._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group/card">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex flex-col items-center justify-center text-indigo-600 font-black">
                                                    <span className="text-base leading-none">
                                                        {session.startTime ? new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-800 group-hover/card:text-indigo-600 transition">{session.title}</h4>
                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-1">Confirmed Speaker Session</p>
                                                </div>
                                            </div>
                                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-[10px]"><i className="fa-solid fa-user-ninja"></i></div>
                                                    {session.speaker || 'Official Guest'}
                                                </div>
                                                <div className="px-3 py-1.5 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 flex items-center gap-2">
                                                    <i className="fa-solid fa-location-arrow text-indigo-400"></i>
                                                    {session.location || 'Hall 1'}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-16 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-slate-400 font-bold">
                                        The official schedule is being finalized. Stay tuned!
                                    </div>
                                )}
                            </div>

                            <div className="mt-24">
                                <header className="flex justify-between items-end mb-10">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 mb-2">Exhibition Floor</h2>
                                        <p className="text-slate-400 font-medium">Navigate through the brands defining the industry future.</p>
                                    </div>
                                    <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
                                        <div className="flex items-center gap-2 text-indigo-600"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span> Reserved</div>
                                        <div className="flex items-center gap-2 text-slate-400"><span className="w-2.5 h-2.5 bg-slate-200 rounded-full"></span> Available</div>
                                    </div>
                                </header>

                                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
                                    {booths.map(booth => (
                                        <div key={booth._id} className={`aspect-square rounded-[1.5rem] flex flex-col items-center justify-center border-2 transition-all relative group ${booth.status === 'reserved' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-md' : 'bg-white border-slate-100 text-slate-300'}`}>
                                            <span className="font-bold text-lg">{booth.boothNumber}</span>
                                            {booth.status === 'reserved' && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>}

                                            {booth.status === 'reserved' && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-60 p-6 bg-slate-900 text-white rounded-[2rem] text-sm shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all z-50 pointer-events-none">
                                                    <h5 className="font-bold text-base mb-1">{booth.boothTitle || 'Official Exhibit'}</h5>
                                                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">{booth.exhibitor?.name || 'Private Corporate'}</p>
                                                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{booth.boothDescription || 'Innovating at the intersection of technology and human potential.'}</p>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {booths.length === 0 && <div className="col-span-full py-12 text-center text-slate-300 font-bold italic">Floor map coming soon...</div>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px] rounded-full -mr-16 -mt-16"></div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black mb-6">About the Event</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm mb-10">
                                        {expo.description || `Join us for the most anticipated tech gathering of the season. Discover groundbreaking methodologies and network with peer-leaders.`}
                                    </p>
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400"><i className="fa-solid fa-users"></i></div>
                                            <div><p className="font-bold text-white text-lg">5K+</p><p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Attendees</p></div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400"><i className="fa-solid fa-store"></i></div>
                                            <div><p className="font-bold text-white text-lg">{booths.length}</p><p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Exhibitors</p></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40">
                                <h3 className="text-xl font-black text-slate-900 mb-6">Expert Speakers</h3>
                                <div className="space-y-6">
                                    {[...new Set(sessions.map(s => s.speaker).filter(Boolean))].slice(0, 4).map((speaker, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100"><i className="fa-solid fa-user"></i></div>
                                            <div><p className="font-bold text-slate-800 text-sm">{speaker}</p><p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">Keynote Speaker</p></div>
                                        </div>
                                    ))}
                                    {sessions.length === 0 && <p className="text-slate-400 text-sm font-medium italic">Speaker lineup being finalized.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {showExhibitorModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 text-left">
                    <div className="bg-white rounded-[3rem] p-10 w-full max-w-lg shadow-2xl">
                        <h2 className="text-3xl font-black text-slate-900 mb-2">Exhibitor Onboarding</h2>
                        <p className="text-slate-400 mb-10 text-sm">Please finalize your brand details to confirm your participation.</p>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Brand Title</label>
                                <input className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition font-bold"
                                    value={regData.companyTitle} onChange={e => setRegData({ ...regData, companyTitle: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Service Category</label>
                                <select className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold outline-none"
                                    value={regData.serviceType} onChange={e => setRegData({ ...regData, serviceType: e.target.value })}>
                                    <option value="">Choose Industry</option>
                                    <option>Fintech</option>
                                    <option>SaaS</option>
                                    <option>Logistics</option>
                                    <option>Health</option>
                                    <option>Cybersecurity</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-4 pt-4">
                                <button onClick={submitExhibitorRegistration} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100">Confirm & Select Booth</button>
                                <button onClick={() => setShowExhibitorModal(false)} className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition">Maybe later</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpoDetails;
