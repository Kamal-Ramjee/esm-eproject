import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventSchedule = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        speaker: '',
        startTime: '',
        endTime: '',
        location: ''
    });

    const getConfig = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return { headers: { Authorization: `Bearer ${userInfo?.token}` } };
    };

    const fetchSessions = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/sessions/${id}`);
            setSessions(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, expo: id };
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/sessions/${currentSessionId}`, payload, getConfig());
            } else {
                await axios.post(`http://localhost:5000/api/sessions`, payload, getConfig());
            }
            fetchSessions();
            handleCloseModal();
        } catch (error) {
            alert("Failed to save session");
        }
    };

    const handleDelete = async (sessionId) => {
        if (window.confirm("Delete this session?")) {
            try {
                await axios.delete(`http://localhost:5000/api/sessions/${sessionId}`, getConfig());
                setSessions(sessions.filter(s => s._id !== sessionId));
            } catch (error) {
                alert("Failed to delete session");
            }
        }
    };

    const handleEditClick = (session) => {
        setFormData({
            title: session.title,
            speaker: session.speaker,
            startTime: session.startTime ? new Date(session.startTime).toISOString().slice(0, 16) : '',
            endTime: session.endTime ? new Date(session.endTime).toISOString().slice(0, 16) : '',
            location: session.location
        });
        setCurrentSessionId(session._id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setFormData({ title: '', speaker: '', startTime: '', endTime: '', location: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/dashboard/events')} className="text-slate-500 hover:text-indigo-600">
                    <i className="fas fa-arrow-left"></i> Back
                </button>
                <h2 className="text-2xl font-bold text-slate-800">Schedule Management</h2>
                <div className="flex-1"></div>
                <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    + Add Session
                </button>
            </div>

            {loading ? <div>Loading sessions...</div> : (
                <div className="grid grid-cols-1 gap-4">
                    {sessions.length === 0 && <p className="text-slate-500">No sessions scheduled yet.</p>}
                    {sessions.map(session => (
                        <div key={session._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">{session.title}</h3>
                                <p className="text-sm text-slate-500">
                                    <span className="font-semibold text-indigo-600">{session.speaker}</span> • {session.location}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {new Date(session.startTime).toLocaleString()} - {new Date(session.endTime).toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEditClick(session)} className="text-slate-400 hover:text-indigo-600 p-2">
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button onClick={() => handleDelete(session._id)} className="text-slate-400 hover:text-rose-600 p-2">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-bold mb-4">{isEditing ? 'Edit Session' : 'New Session'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input placeholder="Session Title" className="w-full border p-2 rounded" required
                                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            <input placeholder="Speaker Name" className="w-full border p-2 rounded"
                                value={formData.speaker} onChange={e => setFormData({ ...formData, speaker: e.target.value })} />
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-slate-500">Start Time</label>
                                    <input type="datetime-local" className="w-full border p-2 rounded" required
                                        value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500">End Time</label>
                                    <input type="datetime-local" className="w-full border p-2 rounded" required
                                        value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} />
                                </div>
                            </div>
                            <input placeholder="Location (e.g. Room A)" className="w-full border p-2 rounded"
                                value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />

                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-slate-500">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventSchedule;
