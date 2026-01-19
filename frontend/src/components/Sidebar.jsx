import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const role = userInfo.role || 'attendee';

  let menuItems = [];

  if (role === 'admin' || role === 'organizer') {
    menuItems = [
      { path: '/dashboard', icon: 'fa-th-large', label: 'Dashboard', badge: null },
      { path: 'events', icon: 'fa-calendar-alt', label: 'Events', badge: null },
      { path: 'users', icon: 'fa-users', label: 'Users', badge: null },
      { path: 'reports', icon: 'fa-chart-line', label: 'Reports', badge: null },
      { path: 'settings', icon: 'fa-cog', label: 'Settings', badge: null },
    ];
  } else if (role === 'exhibitor') {
    menuItems = [
      { path: '/dashboard', icon: 'fa-th-large', label: 'Dashboard', badge: null },
      { path: 'events', icon: 'fa-search', label: 'Browse Expos', badge: null },
      { path: 'registered-expos', icon: 'fa-clipboard-check', label: 'Registered Expos', badge: null },
      { path: 'my-booth', icon: 'fa-store', label: 'My Booth', badge: 'New' },
      { path: 'profile', icon: 'fa-user-edit', label: 'Comp. Profile', badge: null },
      { path: 'settings', icon: 'fa-cog', label: 'Settings', badge: null },
    ];
  } else {
    // Attendee
    menuItems = [
      { path: '/dashboard', icon: 'fa-th-large', label: 'Dashboard', badge: null },
      { path: 'browse-events', icon: 'fa-search', label: 'Browse Expos', badge: null },
      { path: 'registered-expos', icon: 'fa-clipboard-check', label: 'Registered Expos', badge: null },
      // { path: 'my-schedule', icon: 'fa-calendar-check', label: 'My Schedule', badge: null },
      { path: 'settings', icon: 'fa-cog', label: 'Settings', badge: null },
    ];
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 p-6 shadow-xl transition-all duration-300">

      {/* Sidebar Header / Logo */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/20">
          <i className="fas fa-bolt"></i>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">EventSphere Management</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-8">
        <div>
          <p className="px-3 text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-4">
            Main Menu
          </p>

          <ul className="space-y-2">
            {menuItems.map((item) => {
              const fullPath = item.path.startsWith('/') ? item.path : `/dashboard/${item.path}`;
              const isActive = location.pathname === fullPath || (fullPath !== '/dashboard' && location.pathname.startsWith(fullPath));
              return (
                <li key={item.path}>
                  <Link
                    to={fullPath}
                    className={`flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'hover:bg-slate-800 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <i className={`fas ${item.icon} w-5 text-center ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`}></i>
                      <span className="font-medium">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Logout Section */}
      <div className="mt-auto pt-6 border-t border-slate-800">
        <button
          onClick={() => {
            localStorage.removeItem('userInfo');
            window.location.href = '/';
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-200 w-full text-left"
        >
          <i className="fas fa-sign-out-alt w-5 text-center"></i>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;