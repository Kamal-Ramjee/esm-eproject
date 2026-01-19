import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [stats, setStats] = useState({ attendeeCount: 0, exhibitorCount: 0, eventCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/stats/dashboard', config);
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchStats();
  }, []);

  const downloadCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Events", stats.eventCount],
      ["Total Attendees", stats.attendeeCount],
      ["Total Exhibitors", stats.exhibitorCount],
      ["Date Generated", new Date().toLocaleString()]
    ];

    let csvContent = "data:text/csv;charset=utf-8,"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "eventsphere_management_report.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Analytics Reports</h2>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <i className="fas fa-download"></i> Download CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real Data Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px] flex flex-col">
          <h3 className="font-bold text-slate-700 mb-6">Platform Summary</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><i className="fas fa-calendar"></i></div>
                <span className="font-bold text-slate-700">Events</span>
              </div>
              <span className="text-2xl font-bold text-slate-800">{stats.eventCount}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center"><i className="fas fa-users"></i></div>
                <span className="font-bold text-slate-700">Attendees</span>
              </div>
              <span className="text-2xl font-bold text-slate-800">{stats.attendeeCount}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center"><i className="fas fa-store"></i></div>
                <span className="font-bold text-slate-700">Exhibitors</span>
              </div>
              <span className="text-2xl font-bold text-slate-800">{stats.exhibitorCount}</span>
            </div>
          </div>
        </div>

        {/* Placeholder Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
          <i className="fas fa-chart-pie text-6xl text-indigo-100 mb-4"></i>
          <h3 className="font-bold text-slate-700">Visual Insights</h3>
          <p className="text-slate-400 text-sm mt-2">More detailed charts coming soon in the next update.</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;