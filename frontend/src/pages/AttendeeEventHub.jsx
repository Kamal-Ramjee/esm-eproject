import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AttendeeEventHub = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [expo, setExpo] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [exhibitors, setExhibitors] = useState([]);
    const [booths, setBooths] = useState([]);
    const [myStatus, setMyStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Search/Filter states
    const [exhibitorSearch, setExhibitorSearch] = useState('');
    const [serviceFilter, setServiceFilter] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

    useEffect(() => {
        const fetchData = async () => {
            if (!userInfo) {
                navigate('/login');
                return;
            }

            try {
                const [expoRes, sessionRes, exhibitorRes, boothRes, statusRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/expos/${id}`),
                    axios.get(`http://localhost:5000/api/sessions/expo/${id}`, config),
                    axios.get(`http://localhost:5000/api/attendees/expo/${id}/exhibitors`, config),
                    axios.get(`http://localhost:5000/api/expos/${id}/booths`, config),
                    axios.get(`http://localhost:5000/api/attendees/expo/${id}/status`, config)
                ]);

                setExpo(expoRes.data);
                setSessions(sessionRes.data);
                setExhibitors(exhibitorRes.data);
                setBooths(boothRes.data);
                // Status is a Registration object, get sessions from it
                setMyStatus(statusRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching hub data", err);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleBookmark = async (sessionId) => {
        try {
            await axios.post(`http://localhost:5000/api/attendees/session/${sessionId}/bookmark`, {}, config);
            // Refresh status to show bookmarked sessions
            const { data } = await axios.get(`http://localhost:5000/api/attendees/expo/${id}/status`, config);
            setMyStatus(data);
        } catch (err) {
            console.error("Bookmark failed", err);
        }
    };

    const isBookmarked = (sessionId) => {
        return myStatus?.sessions?.some(s => s._id === sessionId || s === sessionId);
    };

    const filteredExhibitors = exhibitors.filter(ex => {
        const name = ex.companyTitle || ex.user?.name || '';
        const matchesSearch = name.toLowerCase().includes(exhibitorSearch.toLowerCase());
        const matchesService = serviceFilter === '' || ex.serviceType === serviceFilter;
        return matchesSearch && matchesService;
    });

    if (loading) return <div className="p-10 text-center">Loading Hub...</div>;
    if (!expo) return <div className="p-10 text-center">Expo not found.</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">{expo.title}</h1>
                    <p className="text-slate-500 mt-2 flex items-center gap-4">
                        <span><i className="fa-solid fa-location-dot text-indigo-500 mr-2"></i>{expo.location}</span>
                        <span><i className="fa-solid fa-calendar text-indigo-500 mr-2"></i>{new Date(expo.startDate).toLocaleDateString()}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link to={`/expo/${id}`} className="px-4 py-2 text-indigo-600 font-bold border border-indigo-100 rounded-xl hover:bg-indigo-50 transition">Public Page</Link>
                    <div className="px-4 py-2 bg-green-50 text-green-700 font-bold rounded-xl border border-green-100">Registered Attendee</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit mb-8 overflow-x-auto">
                {['overview', 'schedule', 'exhibitors', 'floor-plan'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                    >
                        {tab.replace('-', ' ')}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
                {activeTab === 'overview' && (
                    <div className="grid lg:grid-cols-3 gap-8 animate-fadeIn">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                                <h3 className="text-xl font-bold mb-4">About the Expo</h3>
                                <p className="text-slate-600 leading-relaxed">{expo.description || 'Welcome to the event! Get ready for an immersive experience.'}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                                    <h4 className="font-bold text-indigo-800 mb-2">My Bookmarked Sessions</h4>
                                    <p className="text-3xl font-bold text-indigo-600">{myStatus?.sessions?.length || 0}</p>
                                </div>
                                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                                    <h4 className="font-bold text-emerald-800 mb-2">Exhibitors to Visit</h4>
                                    <p className="text-3xl font-bold text-emerald-600">{exhibitors.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <img src={expo.image} className="w-full h-48 object-cover rounded-3xl shadow-lg" alt="Expo" />
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <h4 className="font-bold mb-4">Event Organizers</h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500"><i className="fa-solid fa-user"></i></div>
                                    <p className="font-medium">Direct Support</p>
                                </div>
                                <button className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition">Contact Support</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100">
                            <h3 className="font-bold text-lg px-2">Interactive Schedule</h3>
                            <div className="text-sm text-slate-500">Showing {sessions.length} sessions</div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {sessions.map(session => (
                                <div key={session._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all flex justify-between items-center group">
                                    <div className="flex gap-6">
                                        <div className="min-w-[80px] font-bold text-indigo-600 border-r border-slate-100 pr-6 flex items-center justify-center">{session.time}</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-800">{session.title}</h4>
                                            <div className="flex gap-4 mt-2 text-sm text-slate-500">
                                                <span><i className="fa-solid fa-user-tie mr-2 text-slate-400"></i>{session.speaker}</span>
                                                <span><i className="fa-solid fa-door-open mr-2 text-slate-400"></i>{session.room}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleBookmark(session._id)}
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isBookmarked(session._id) ? 'bg-amber-100 text-amber-600 rotate-[360deg]' : 'bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'}`}
                                    >
                                        <i className={`fa-solid fa-bookmark text-xl`}></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'exhibitors' && (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Search Bar */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 relative">
                                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                <input
                                    className="w-full bg-white border border-slate-100 py-3.5 pl-12 pr-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    placeholder="Search by company name, product or keyword..."
                                    value={exhibitorSearch}
                                    onChange={(e) => setExhibitorSearch(e.target.value)}
                                />
                            </div>
                            <select
                                className="bg-white border border-slate-100 py-3.5 px-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                value={serviceFilter}
                                onChange={(e) => setServiceFilter(e.target.value)}
                            >
                                <option value="">All Service Types</option>
                                <option>Technology</option>
                                <option>Manufacturing</option>
                                <option>Retail</option>
                                <option>Healthcare</option>
                            </select>
                        </div>

                        {/* Exhibitor Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredExhibitors.map(ex => (
                                <div key={ex._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-2xl group-hover:bg-indigo-50 transition-colors">
                                            {ex.user?.companyDetails?.logoUrl ? <img src={ex.user.companyDetails.logoUrl} className="w-full h-full object-contain p-2" alt="Logo" /> : <i className="fa-solid fa-store text-slate-300"></i>}
                                        </div>
                                        <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase">{ex.serviceType || ex.user?.companyDetails?.serviceType || 'General'}</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-800">{ex.companyTitle || ex.user?.name}</h4>
                                    <p className="text-slate-500 text-sm mt-3 line-clamp-2 leading-relaxed h-10">{ex.shortDescription || ex.user?.companyDetails?.description || 'Discover our products and services at our booth.'}</p>

                                    <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <div className="text-xs font-bold text-slate-400">
                                            <i className="fa-solid fa-map-location-dot mr-1"></i>
                                            {booths.find(b => b.exhibitor?._id === ex.user?._id)?.boothNumber || 'TBD'}
                                        </div>
                                        <button className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-2">
                                            Chat <i className="fa-regular fa-comment-dots"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredExhibitors.length === 0 && <div className="col-span-3 text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400">No exhibitors match your search criteria.</div>}
                        </div>
                    </div>
                )}

                {activeTab === 'floor-plan' && (
                    <div className="animate-fadeIn">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8">
                            <h3 className="text-xl font-bold mb-2">Interactive Floor Plan</h3>
                            <p className="text-slate-500">Visual mapping of exhibitors. Green booths are available, Red are occupied.</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {booths.map(booth => (
                                <div key={booth._id} className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 border-2 transition-all cursor-help relative group ${booth.status === 'reserved' ? 'bg-red-50 border-red-100 text-red-600' : (booth.status === 'pending' ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-green-50 border-green-100 text-green-600')}`}>
                                    <span className="font-bold text-lg">{booth.boothNumber}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{booth.status}</span>

                                    {/* Tooltip */}
                                    {booth.exhibitor && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-slate-900 text-white rounded-xl text-xs w-32 invisible group-hover:visible z-50 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-normal text-center">
                                            <div className="font-bold mb-1">{booth.exhibitor.name}</div>
                                            <div className="text-[10px] text-slate-300">Booked Booth</div>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default AttendeeEventHub;
