import React, { useState } from 'react';
import axios from 'axios';

const Settings = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const [formData, setFormData] = useState({
    name: userInfo.name || '',
    email: userInfo.email || '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.put('http://localhost:5000/api/auth/profile', formData, config);
      localStorage.setItem('userInfo', JSON.stringify(data));
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Account Settings</h2>
      <form onSubmit={handleUpdate} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Profile Section */}
          <section className="flex flex-col md:flex-row gap-8 pb-8 border-b border-slate-100">
            <div className="w-32">
              <h4 className="font-bold text-slate-800">Profile</h4>
              <p className="text-sm text-slate-500">Update your public info.</p>
            </div>
            <div className="flex-1 space-y-4">
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </section>

          {/* Preferences Section */}
          <section className="flex flex-col md:flex-row gap-8">
            <div className="w-32">
              <h4 className="font-bold text-slate-800">Security</h4>
              <p className="text-sm text-slate-500">Manage password and access.</p>
            </div>
            <div className="flex-1 space-y-4">
              <input
                name="password"
                type="password"
                placeholder="New Password (optional)"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </section>
        </div>
        <div className="bg-slate-50 p-4 px-8 flex justify-end gap-3 border-t border-slate-100">
          <button type="button" className="px-6 py-2 text-slate-500 font-medium hover:text-slate-800">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium shadow-sm hover:bg-indigo-700">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default Settings;