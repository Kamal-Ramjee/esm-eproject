import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ attendeeCount: 0, exhibitorCount: 0, eventCount: 0 });
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const role = userInfo.role || 'attendee';
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'admin' || role === 'organizer') {
      const fetchStats = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get('http://localhost:5000/api/stats/dashboard', config);
          setStats(data);
        } catch (error) {
          console.error("Error fetching stats", error);
        }
      };
      fetchStats();
    }
  }, [role, userInfo.token]);

  // --- ADMIN VIEW ---
  if (role === 'admin' || role === 'organizer') {
    return (
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('events')}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <i className="fas fa-plus"></i> Create Event
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Total Events', value: stats.eventCount, icon: 'fa-calendar-check', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Attendees', value: stats.attendeeCount, icon: 'fa-users', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Total Exhibitors', value: stats.exhibitorCount, icon: 'fa-store', color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:-translate-y-1 transition-transform">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl ${stat.bg} ${stat.color}`}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }


  // --- EXHIBITOR VIEW ---
  if (role === 'exhibitor') {
    return (
      <div className="space-y-6">
        <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome, {userInfo.name}!</h1>
            <p className="text-indigo-100 max-w-xl">Manage your booth, update your profile, and connect with attendees.</p>
          </div>
          <i className="fas fa-store absolute -right-6 -bottom-6 text-9xl text-indigo-500 opacity-50"></i>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-700">Booth Visits</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">124</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-700">Messages</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-2">8</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-700">Leads</h3>
            <p className="text-3xl font-bold text-amber-600 mt-2">45</p>
          </div>
        </div>
      </div>
    );
  }

  // --- ATTENDEE VIEW ---
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Ready to Explore?</h1>
          <p className="text-purple-100 max-w-xl">Find upcoming expos, book sessions, and connect with exhibitors.</p>
        </div>
        <i className="fas fa-rocket absolute -right-6 -bottom-6 text-9xl text-purple-500 opacity-50"></i>
      </div>

      <h2 className="text-xl font-bold text-slate-800">Your Upcoming Schedule</h2>
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-slate-500 italic">No upcoming sessions booked. Browse events to get started!</p>
      </div>
    </div>
  );
};

export default Dashboard;