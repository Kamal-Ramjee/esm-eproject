import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AttendeeSchedule = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                // Fetch all registrations for this user
                const { data: regs } = await axios.get('http://localhost:5000/api/attendees/registrations', config);

                // For each registration, fetch the deep-populated status and event booths
                const detailedRegs = await Promise.all(regs.map(async (r) => {
                    const expoId = r.expo?._id || r.expo;
                    if (!expoId) return r;

                    try {
                        const [statusRes, boothRes] = await Promise.all([
                            axios.get(`http://localhost:5000/api/attendees/expo/${expoId}/status`, config),
                            axios.get(`http://localhost:5000/api/expos/${expoId}/booths`, config)
                        ]);

                        const status = statusRes.data;
                        const booths = boothRes.data;

                        // Find this user's booth (Exhibitor role)
                        const myBooth = booths.find(b => b.exhibitor === userInfo._id || b.exhibitor?._id === userInfo._id);

                        // Use status as base if it exists, ensuring expo and sessions are correctly assigned
                        return {
                            ...r,
                            ...status,
                            myBooth,
                            expo: status.expo || r.expo // Prefer the most populated expo object
                        };
                    } catch (e) {
                        return r; // Fallback to basic registration if sub-fetch fails
                    }
                }));

                setRegistrations(detailedRegs.filter(reg => reg.expo));
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch schedule", err);
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    if (loading) return <div className="p-10 text-center animate-pulse text-indigo-600 font-bold">Assembling Your Personalized Journey...</div>;

    return (
        <div className="space-y-12 pb-20 animate-fadeIn">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">My Personal Agenda</h2>
                    <p className="text-slate-500 font-medium mt-2">Manage your journey through all your registered global events.</p>
                </div>
            </header>

            <div className="space-y-16">
                {registrations.length === 0 ? (
                    <div className="p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <i className="fa-solid fa-calendar-plus text-5xl text-slate-100 mb-6"></i>
                        <h3 className="text-2xl font-bold text-slate-800">Your agenda is waiting.</h3>
                        <p className="text-slate-400 mt-2 mb-8">Start by exploring our curated list of upcoming world expos.</p>
                        <Link to="/dashboard/browse-events" className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition">Browse Events</Link>
                    </div>
                ) : (
                    registrations.map(reg => {
                        const targetExpoId = reg.expo?._id || reg.expo;
                        return (
                            <article key={reg._id} className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-2xl">
                                {/* Event Card Banner */}
                                <div className="flex flex-col lg:flex-row min-h-[350px]">
                                    <div className="w-full lg:w-[500px] h-80 lg:h-auto relative overflow-hidden group">
                                        <img src={reg.expo.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="Event" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                                        <div className="absolute bottom-8 left-8 right-8">
                                            <div className="flex gap-2 mb-4">
                                                <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Official Participant</span>
                                            </div>
                                            <h3 className="text-4xl font-black text-white tracking-tight leading-tight mb-4">{reg.expo.title}</h3>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white flex items-center gap-2">
                                                    <i className="fa-solid fa-location-dot text-indigo-400"></i>
                                                    <span className="text-xs font-bold uppercase tracking-widest">{reg.expo.location}</span>
                                                </div>
                                                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white flex items-center gap-2">
                                                    <i className="fa-solid fa-calendar-day text-indigo-400"></i>
                                                    <span className="text-xs font-bold uppercase tracking-widest">{new Date(reg.expo.startDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 p-8 lg:p-12 flex flex-col justify-between bg-white relative">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Current Participation</h4>
                                                    <div className="flex gap-4">
                                                        <div className="bg-indigo-50 px-6 py-4 rounded-[1.5rem] border border-indigo-100 flex flex-col items-center min-w-[100px]">
                                                            <span className="text-3xl font-black text-indigo-600 leading-none">{reg.sessions?.length || 0}</span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Sessions</span>
                                                        </div>
                                                        {reg.myBooth && (
                                                            <div className="bg-slate-900 px-6 py-4 rounded-[1.5rem] flex flex-col items-center min-w-[100px] shadow-lg shadow-slate-200">
                                                                <span className="text-3xl font-black text-white leading-none">{reg.myBooth.boothNumber}</span>
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Booth</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {reg.myBooth ? (
                                                    <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 relative overflow-hidden group/booth">
                                                        <div className="relative z-10">
                                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Company Exhibit</p>
                                                            <h5 className="text-xl font-bold text-slate-800">{reg.myBooth.boothTitle || 'Assigned Booth Space'}</h5>
                                                            <div className="mt-2 text-xs font-medium text-emerald-700 flex items-center gap-2">
                                                                <i className="fa-solid fa-circle-check"></i> Standard Premium Allotment
                                                            </div>
                                                        </div>
                                                        <i className="fa-solid fa-store absolute -right-4 -bottom-4 text-8xl text-emerald-600/5 group-hover/booth:scale-110 transition duration-500"></i>
                                                    </div>
                                                ) : (
                                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-slate-400 text-sm font-medium flex items-center gap-3">
                                                        <i className="fa-solid fa-circle-info text-indigo-300"></i> No booth assigned to your profile.
                                                    </div>
                                                )}
                                            </div>

                                            <Link
                                                to={`/dashboard/expo/${targetExpoId}/hub`}
                                                className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-800 transition shadow-xl shadow-slate-200 group-hover:translate-x-1"
                                            >
                                                Enter Event Hub
                                                <i className="fa-solid fa-arrow-right-long text-indigo-400"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Sessions Content */}
                                <div className="p-8 lg:p-12 border-t border-slate-50 bg-slate-50/10">
                                    <h4 className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-8">
                                        <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                                        My Bookmarked Schedule
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {reg.sessions && reg.sessions.length > 0 ? (
                                            reg.sessions.map((session, idx) => {
                                                const timeParts = session.time?.split(' ') || ['TBD'];
                                                return (
                                                    <div key={session._id || idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-100/30 group/s">
                                                        <div className="flex items-center gap-4 mb-6">
                                                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex flex-col items-center justify-center text-indigo-600">
                                                                <span className="text-base font-black leading-none">{timeParts[0]}</span>
                                                                {timeParts[1] && <span className="text-[8px] font-black uppercase tracking-tighter mt-1 opacity-60">{timeParts[1]}</span>}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className="font-bold text-slate-800 group-hover/s:text-indigo-600 transition truncate">{session.title}</h5>
                                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Confirmed Session</p>
                                                            </div>
                                                        </div>
                                                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
                                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 truncate">
                                                                <i className="fa-solid fa-user-tie text-indigo-300"></i>
                                                                {session.speaker}
                                                            </div>
                                                            <div className="px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-400 whitespace-nowrap border border-slate-100">
                                                                <i className="fa-solid fa-door-open mr-1.5 opacity-50"></i> {session.room}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-full py-12 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 text-slate-400">
                                                <p className="text-sm font-bold opacity-60">You haven't bookmarked any sessions for this expo yet.</p>
                                                <Link to={`/dashboard/expo/${targetExpoId}/hub`} className="text-indigo-600 text-xs font-black uppercase tracking-widest mt-4 inline-block hover:underline">Explore Schedule</Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })
                )}
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
};

export default AttendeeSchedule;
