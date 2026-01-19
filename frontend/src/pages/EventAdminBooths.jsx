import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventAdminBooths = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booths, setBooths] = useState([]);
    const [exhibitors, setExhibitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expo, setExpo] = useState(null);

    // New Booth Form
    const [isAdding, setIsAdding] = useState(false);
    const [newBooth, setNewBooth] = useState({ boothNumber: '', size: 'Standard', price: 0 });

    // Assign Modal
    const [assignModal, setAssignModal] = useState(false);
    const [selectedBooth, setSelectedBooth] = useState(null);
    const [selectedExhibitorId, setSelectedExhibitorId] = useState('');

    const getConfig = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return { headers: { Authorization: `Bearer ${userInfo?.token}` } };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Booths
                const { data: boothData } = await axios.get(`http://localhost:5000/api/expos/${id}/booths`, getConfig());
                setBooths(boothData);

                // Fetch Expo Details
                const { data: expoData } = await axios.get(`http://localhost:5000/api/expos`, getConfig());
                const currentExpo = expoData.find(e => e._id === id);
                setExpo(currentExpo);

                // Fetch Exhibitors
                const { data: exhibitorData } = await axios.get('http://localhost:5000/api/auth/users?role=exhibitor');
                setExhibitors(exhibitorData);

                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAddBooth = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/api/expos/booth`, { ...newBooth, expo: id }, getConfig());
            // Refresh
            const { data } = await axios.get(`http://localhost:5000/api/expos/${id}/booths`, getConfig());
            setBooths(data);
            setIsAdding(false);
            setNewBooth({ boothNumber: '', size: 'Standard', price: 0 });
        } catch (error) {
            alert("Failed to add booth");
        }
    };

    const openAssignModal = (booth) => {
        setSelectedBooth(booth);
        setSelectedExhibitorId('');
        setAssignModal(true);
    };

    const handleAssignSubmit = async () => {
        try {
            await axios.put(`http://localhost:5000/api/expos/booth/${selectedBooth._id}`, {
                exhibitor: selectedExhibitorId,
                status: 'reserved'
            }, getConfig());

            // Optimistic Update or Refresh
            const { data } = await axios.get(`http://localhost:5000/api/expos/${id}/booths`, getConfig());
            setBooths(data);
            setAssignModal(false);
        } catch (err) {
            alert("Failed to assign booth");
        }
    };

    const handleClearAssignment = async (boothId) => {
        if (window.confirm("Clear assignment and make booth available?")) {
            try {
                await axios.put(`http://localhost:5000/api/expos/booth/${boothId}`, {
                    exhibitor: null,
                    status: 'available'
                }, getConfig());
                const { data } = await axios.get(`http://localhost:5000/api/expos/${id}/booths`, getConfig());
                setBooths(data);
            } catch (err) {
                alert("Failed to clear");
            }
        }
    };

    const handleRequestAction = async (booth, action) => {
        try {
            const payload = action === 'approve'
                ? { status: 'reserved' } // keep exhibitor
                : { status: 'available', exhibitor: null }; // clear exhibitor

            await axios.put(`http://localhost:5000/api/expos/booth/${booth._id}`, payload, getConfig());

            // Refresh
            const { data } = await axios.get(`http://localhost:5000/api/expos/${id}/booths`, getConfig());
            setBooths(data);
        } catch (error) {
            alert("Action failed");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/dashboard/events')} className="text-slate-500 hover:text-indigo-600">
                    <i className="fas fa-arrow-left"></i> Back
                </button>
                <h2 className="text-2xl font-bold text-slate-800">Booth Management {expo ? `- ${expo.title}` : ''}</h2>
            </div>

            {/* Stats / Controls */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                <div>
                    <p className="text-slate-500">Total Booths: <span className="font-bold text-slate-800">{booths.length}</span></p>
                    <p className="text-slate-500">Reserved: <span className="font-bold text-indigo-600">{booths.filter(b => b.status === 'reserved').length}</span></p>
                </div>
                <button onClick={() => setIsAdding(!isAdding)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                    {isAdding ? 'Cancel' : '+ Add Booth'}
                </button>
            </div>

            {/* Add Booth Form */}
            {isAdding && (
                <form onSubmit={handleAddBooth} className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Booth Number</label>
                        <input className="p-2 border rounded w-32" required value={newBooth.boothNumber} onChange={e => setNewBooth({ ...newBooth, boothNumber: e.target.value })} placeholder="A-101" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Size</label>
                        <select className="p-2 border rounded w-32" value={newBooth.size} onChange={e => setNewBooth({ ...newBooth, size: e.target.value })}>
                            <option>Standard</option>
                            <option>Premium</option>
                            <option>Large</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Price ($)</label>
                        <input type="number" className="p-2 border rounded w-32" required value={newBooth.price} onChange={e => setNewBooth({ ...newBooth, price: e.target.value })} />
                    </div>
                    <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded">Save</button>
                </form>
            )}

            {/* Booth Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {booths.map(booth => (
                    <div key={booth._id} className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all 
                        ${booth.status === 'reserved' ? 'border-indigo-200 bg-indigo-50' :
                            booth.status === 'pending' ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white hover:border-emerald-400'}`}>

                        <h4 className="font-bold text-lg">{booth.boothNumber}</h4>
                        <span className={`text-xs uppercase font-bold px-2 py-0.5 rounded-full mb-2 
                            ${booth.status === 'reserved' ? 'bg-indigo-200 text-indigo-800' :
                                booth.status === 'pending' ? 'bg-amber-200 text-amber-900' : 'bg-green-100 text-green-700'}`}>
                            {booth.status}
                        </span>

                        {booth.status === 'pending' ? (
                            <div className="flex flex-col gap-1 w-full">
                                <p className="text-xs text-amber-700 font-bold truncate">{booth.exhibitor?.name || "Requested"}</p>
                                <div className="flex gap-1 justify-center mt-1">
                                    <button
                                        onClick={() => handleRequestAction(booth, 'approve')}
                                        className="bg-emerald-500 text-white text-[10px] px-2 py-1 rounded hover:bg-emerald-600"
                                        title="Approve"
                                    >
                                        <i className="fas fa-check"></i>
                                    </button>
                                    <button
                                        onClick={() => handleRequestAction(booth, 'reject')}
                                        className="bg-rose-500 text-white text-[10px] px-2 py-1 rounded hover:bg-rose-600"
                                        title="Reject"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            booth.exhibitor ? (
                                <div className="text-center w-full">
                                    <p className="text-xs text-indigo-600 truncate font-bold w-full" title={booth.exhibitor.name}>{booth.exhibitor.name}</p>
                                    <button onClick={() => handleClearAssignment(booth._id)} className="mt-1 text-[10px] text-rose-500 hover:underline">Unassign</button>
                                </div>
                            ) : (
                                <button onClick={() => openAssignModal(booth)} className="mt-2 text-xs text-slate-400 hover:text-indigo-600 underline">Assign</button>
                            )
                        )}
                    </div>
                ))}
            </div>

            {/* Assign Modal */}
            {assignModal && (
                <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-lg font-bold mb-4">Assign Booth {selectedBooth?.boothNumber}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-500 mb-1">Select Exhibitor</label>
                                <select className="w-full border p-2 rounded" value={selectedExhibitorId} onChange={(e) => setSelectedExhibitorId(e.target.value)}>
                                    <option value="">-- Select --</option>
                                    {exhibitors.map(ex => (
                                        <option key={ex._id} value={ex._id}>{ex.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button onClick={() => setAssignModal(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                                <button onClick={handleAssignSubmit} disabled={!selectedExhibitorId} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">Assign</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventAdminBooths;
