import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisteredExpos = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Booth Selection Modal (Exhibitor only)
    const [showBoothModal, setShowBoothModal] = useState(false);
    const [currentExpoId, setCurrentExpoId] = useState(null);
    const [availableBooths, setAvailableBooths] = useState([]);
    const [selectedBooth, setSelectedBooth] = useState(null);

    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
    const role = userInfo.role;

    const getConfig = () => {
        return { headers: { Authorization: `Bearer ${userInfo?.token}` } };
    };

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/attendees/registrations', getConfig());
                setRegistrations(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchRegistrations();
    }, []);

    const openBoothSelection = async (expoId) => {
        setCurrentExpoId(expoId);
        try {
            const { data } = await axios.get(`http://localhost:5000/api/expos/${expoId}/booths`, getConfig());
            setAvailableBooths(data);
            setShowBoothModal(true);
            setSelectedBooth(null);
        } catch (error) {
            alert("Failed to load booths");
        }
    };

    const handleRequestBooth = async () => {
        try {
            await axios.put(`http://localhost:5000/api/expos/booth/${selectedBooth}/request`, {}, getConfig());
            alert("Booth requested! Waiting for admin approval.");
            setShowBoothModal(false);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to request booth.");
        }
    };

    const handleCancelRegistration = async (expoId) => {
        if (window.confirm("Are you sure you want to cancel your registration? This will also unassign any booked booths.")) {
            try {
                await axios.delete(`http://localhost:5000/api/attendees/expo/${expoId}/cancel`, getConfig());
                setRegistrations(registrations.filter(r => r.expo?._id !== expoId));
                alert("Registration cancelled successfully.");
            } catch (error) {
                alert(error.response?.data?.message || "Failed to cancel registration.");
            }
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse text-slate-500 font-medium">Fetching your registrations...</div>;

    return (
        <div className="space-y-8 animate-fadeIn">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Registered Events</h2>
                    <p className="text-slate-500 mt-1">Manage your participation and access event hubs.</p>
                </div>
                {role === 'exhibitor' && (
                    <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl border border-indigo-100 text-sm font-bold flex items-center gap-2">
                        <i className="fa-solid fa-store"></i> Exhibitor Mode Active
                    </div>
                )}
            </header>

            {registrations.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fa-solid fa-calendar-xmark text-slate-300 text-3xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No active registrations</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Explore upcoming global expos and join the community to start growing your network.</p>
                    <Link to="/dashboard/browse-events" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition">Browse Expos</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {registrations.map((reg) => (
                        <div key={reg._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
                            {/* Card Header (Image/Banner) */}
                            <div className="h-32 relative">
                                <img src={reg.expo?.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80"} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Expo" />
                                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition"></div>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm border border-white">Confirmed</div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-slate-800 line-clamp-1 mb-1">{reg.expo?.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-slate-400 mb-6">
                                    <span className="flex items-center gap-1"><i className="fa-solid fa-calendar text-[10px]"></i> {new Date(reg.expo?.startDate).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><i className="fa-solid fa-location-dot text-[10px]"></i> {reg.expo?.location}</span>
                                </div>

                                {role === 'exhibitor' && reg.companyTitle && (
                                    <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400 font-bold uppercase tracking-widest">Exhibiting As</span>
                                            <span className="text-indigo-600 font-bold capitalize">{reg.serviceType}</span>
                                        </div>
                                        <p className="font-bold text-slate-700 leading-tight">{reg.companyTitle}</p>
                                    </div>
                                )}

                                <div className="mt-auto space-y-3">
                                    <Link
                                        to={`/expo/${reg.expo?._id}`}
                                        target="_blank"
                                        className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2"
                                    >
                                        <i className="fa-solid fa-door-open"></i> Enter Event Hub
                                    </Link>
                                    <button
                                        onClick={() => handleCancelRegistration(reg.expo?._id)}
                                        className="w-full text-slate-400 text-xs font-bold hover:text-rose-500 transition py-2"
                                    >
                                        Cancel My Registration
                                    </button>
                                    {role === 'exhibitor' && (
                                        <button
                                            onClick={() => openBoothSelection(reg.expo?._id)}
                                            className="w-full bg-white text-indigo-600 border border-indigo-100 py-3.5 rounded-2xl font-bold hover:bg-indigo-50 transition"
                                        >
                                            <i className="fa-solid fa-store mr-2"></i> Manage Booth Space
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Booth Selection Modal */}
            {showBoothModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-5xl shadow-2xl h-[85vh] flex flex-col border border-slate-100">
                        <header className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Interactive Floor Plan</h3>
                                <p className="text-slate-500 mt-1">Select an available space (green) to request your booth assignment.</p>
                            </div>
                            <button onClick={() => setShowBoothModal(false)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto pr-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 p-2 custom-scrollbar">
                            {availableBooths.map(booth => (
                                <button
                                    key={booth._id}
                                    disabled={booth.status !== 'available'}
                                    onClick={() => setSelectedBooth(booth._id)}
                                    className={`
                                        aspect-square rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all duration-300 relative group
                                        ${booth.status === 'available'
                                            ? (selectedBooth === booth._id ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-50 shadow-lg' : 'border-slate-100 bg-slate-50/50 hover:bg-indigo-50 hover:border-indigo-200')
                                            : 'bg-white border-slate-50 opacity-40 cursor-not-allowed'}
                                    `}
                                >
                                    <span className="font-bold text-xl">{booth.boothNumber}</span>
                                    <span className="text-[10px] uppercase font-bold tracking-widest mt-1">
                                        {booth.status}
                                    </span>
                                    {booth.status === 'available' && (
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-400 rounded-full"></span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <footer className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-50">
                            <div className="flex gap-6 text-sm">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-500 rounded-full"></div> Available</div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-200 rounded-full"></div> Reserved</div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setShowBoothModal(false)} className="px-8 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition">Close</button>
                                <button
                                    onClick={handleRequestBooth}
                                    disabled={!selectedBooth}
                                    className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 transition"
                                >
                                    Request Selection
                                </button>
                            </div>
                        </footer>
                    </div>
                </div>
            )}

            <style>{`
                .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div>
    );
};

export default RegisteredExpos;
