import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Events = () => {
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    location: '',
    image: '',
    totalBooths: 0
  });

  const API_URL = 'http://localhost:5000/api/expos';

  // Helper to get config
  const getConfig = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return { headers: { Authorization: `Bearer ${userInfo?.token}` } };
  };

  const fetchExpos = async () => {
    try {
      const { data } = await axios.get(API_URL, getConfig());
      setExpos(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpos();
  }, []);

  // --- DELETE API CALL ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`${API_URL}/${id}`, getConfig());
        setExpos(expos.filter(expo => expo._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete");
      }
    }
  };

  // --- PREPARE FOR EDIT ---
  const handleEditClick = (expo) => {
    setIsEditing(true);
    setCurrentId(expo._id);
    setFormData({
      title: expo.title,
      // Format date to YYYY-MM-DD for the date input
      startDate: expo.startDate.split('T')[0],
      endDate: expo.endDate.split('T')[0],
      location: expo.location,
      image: expo.image || '',
      totalBooths: expo.totalBooths || 0,
    });
    setShowModal(true);
  };

  // --- CREATE OR UPDATE API CALL ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // UPDATE
        const { data } = await axios.put(`${API_URL}/${currentId}`, formData, getConfig());
        setExpos(expos.map(expo => expo._id === currentId ? data : expo));
      } else {
        // CREATE
        const { data } = await axios.post(API_URL, formData, getConfig());
        setExpos([...expos, data]);
      }

      handleCloseModal();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ title: '', startDate: '', endDate: '', location: '', image: '', totalBooths: 0 });
  };

  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const role = userInfo.role || 'attendee';
  const isAdmin = role === 'admin' || role === 'organizer';

  // --- REGISTER ---
  const [showRegModal, setShowRegModal] = useState(false);
  const [regData, setRegData] = useState({
    companyTitle: '',
    shortDescription: '',
    serviceType: '',
    attendeeName: '',
    attendeeEmail: ''
  });
  const [selectedExpo, setSelectedExpo] = useState(null);

  const handleRegister = async (expo) => {
    setSelectedExpo(expo);
    try {
      // Always fetch profile for autofill
      const { data } = await axios.get('http://localhost:5000/api/auth/profile', getConfig());
      const details = data.companyDetails || {};
      setRegData({
        attendeeName: data.name || '',
        attendeeEmail: data.email || '',
        companyTitle: data.role === 'exhibitor' ? (data.name || '') : '',
        shortDescription: data.role === 'exhibitor' ? (details.description || '') : 'Attendee registration for networking and learning.',
        serviceType: data.role === 'exhibitor' ? (details.serviceType || '') : 'Attendee'
      });
      setShowRegModal(true);
    } catch (e) {
      setShowRegModal(true);
    }
  };

  const submitRegistration = async (id, data) => {
    try {
      await axios.post(`http://localhost:5000/api/attendees/expo/${id}/register`, data, getConfig());
      alert(`Successfully registered for event!`);
      setShowRegModal(false);
      setRegData({ companyTitle: '', shortDescription: '', serviceType: '', attendeeName: '', attendeeEmail: '' });
      // Optionally refresh page or navigate
      window.location.href = '/dashboard/registered-expos';
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };


  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          {isAdmin ? 'Event Management' : 'Browse Expos'}
        </h2>

        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
          >
            + New Event
          </button>
        )}
      </div>

      {/* --- REGISTRATION MODAL --- */}
      {showRegModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Register for Event</h3>
                <p className="text-slate-500 text-sm mt-1">{selectedExpo?.title}</p>
              </div>
              <button
                onClick={() => setShowRegModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
                  <input readOnly className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                    value={regData.attendeeName} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
                  <input readOnly className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                    value={regData.attendeeEmail} />
                </div>
              </div>

              {role === 'exhibitor' ? (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Company Display Title</label>
                    <input className="w-full border border-slate-100 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      value={regData.companyTitle} onChange={e => setRegData({ ...regData, companyTitle: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Service Category</label>
                    <select className="w-full border border-slate-100 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      value={regData.serviceType} onChange={e => setRegData({ ...regData, serviceType: e.target.value })}>
                      <option value="">Select Service Type</option>
                      <option>Technology</option>
                      <option>Consulting</option>
                      <option>Manufacturing</option>
                      <option>Education</option>
                      <option>Healthcare</option>
                    </select>
                  </div>
                </>
              ) : (
                <p className="bg-indigo-50 text-indigo-700 p-4 rounded-2xl text-sm border border-indigo-100 font-medium">
                  <i className="fa-solid fa-circle-info mr-2"></i>
                  By registering, you'll gain access to the interactive floor plan, full session schedule, and exhibitor directory.
                </p>
              )}

              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={() => submitRegistration(selectedExpo._id, regData)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                  Confirm Registration
                </button>
                <p className="text-[10px] text-center text-slate-400">Confirmation will be sent to your registered email address.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL (CREATE/EDIT) --- */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{isEditing ? 'Edit Expo' : 'Create New Expo'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Title</label>
                <input
                  type="text" required
                  className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date" required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date" required
                    className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text" required
                  className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL (for Homepage)</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/venue.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Booths to Assign</label>
                <input
                  type="number"
                  min="0"
                  className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                  value={formData.totalBooths}
                  onChange={(e) => setFormData({ ...formData, totalBooths: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {isEditing ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TABLE --- */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Event Name</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Location</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Date</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expos.map((expo) => (
              <tr key={expo._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-800">{expo.title}</td>
                <td className="px-6 py-4 text-slate-600">{expo.location}</td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(expo.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {isAdmin ? (
                    <>
                      <button
                        title="Edit Details"
                        onClick={() => handleEditClick(expo)}
                        className="text-slate-400 hover:text-indigo-600"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        title="Manage Schedule"
                        onClick={() => window.location.href = `/dashboard/events/${expo._id}/schedule`}
                        className="text-slate-400 hover:text-emerald-600"
                      >
                        <i className="fas fa-calendar-alt"></i>
                      </button>
                      <button
                        title="Manage Booths"
                        onClick={() => window.location.href = `/dashboard/events/${expo._id}/booths`}
                        className="text-slate-400 hover:text-amber-600"
                      >
                        <i className="fas fa-th"></i>
                      </button>
                      <button
                        title="Delete Event"
                        onClick={() => handleDelete(expo._id)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleRegister(expo)}
                      className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                    >
                      Register
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default Events;