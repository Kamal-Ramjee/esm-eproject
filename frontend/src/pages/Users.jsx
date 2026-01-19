import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('attendee'); // Default tab
  const [searchTerm, setSearchTerm] = useState('');

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  const API_URL = 'http://localhost:5000/api/auth/users';

  // Fetch users based on role
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}?role=${activeTab}`);
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [activeTab]);

  // Filter users
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete User
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  // Edit Handlers
  const handleEditClick = (user) => {
    setCurrentUser(user);
    setEditForm({ name: user.name, email: user.email });
    setIsEditing(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const { data } = await axios.put(`http://localhost:5000/api/auth/users/${currentUser._id}`, editForm, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });

      // Update local state
      setUsers(users.map(u => u._id === currentUser._id ? { ...u, ...data } : u));
      setIsEditing(false);
      setCurrentUser(null);
    } catch (err) {
      alert("Failed to update user");
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Users & Attendees</h2>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-3 text-slate-400"></i>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['attendee', 'exhibitor', 'admin'].map(role => (
              <button
                key={role}
                onClick={() => setActiveTab(role)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === role ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center group hover:border-indigo-200 transition-all relative">
              <div className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-bold bg-slate-100 ring-4 ring-slate-50 group-hover:ring-indigo-50 text-slate-500`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h4 className="font-bold text-slate-800">{user.name}</h4>
              <p className="text-sm text-slate-500 mb-2">{user.email}</p>
              <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-md font-medium uppercase tracking-wide mb-4 inline-block">
                {user.role}
              </span>

              {/* Extra Details */}
              {user.role === 'attendee' && (
                <div className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg">
                  <strong>Joined Events:</strong> {user.joinedEvents?.length ? user.joinedEvents.join(', ') : 'None'}
                </div>
              )}
              {user.role === 'exhibitor' && (
                <div className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg">
                  <p><strong>Booths ({user.boothCount || 0}):</strong> {user.booths?.length ? user.booths.join(', ') : 'None'}</p>
                </div>
              )}

              {/* Action Buttons */}
              {user.role !== 'admin' && (
                <div className="mt-6 flex justify-center gap-3 border-t pt-4">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white transition-all"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-lg mb-4">Edit User</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="text-sm text-slate-500">Name</label>
                <input className="w-full border p-2 rounded-lg" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-slate-500">Email</label>
                <input className="w-full border p-2 rounded-lg" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;