import React from 'react';

const Header = () => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      
      {/* Left Section: Toggle & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <i className="fas fa-bars text-xl"></i>
        </button>
        
        <div className="hidden md:flex items-center relative w-full max-w-md group">
          <i className="fas fa-search absolute left-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors"></i>
          <input 
            type="text" 
            placeholder="Search events, users..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-transparent border focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 rounded-xl outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Right Section: Icons & Profile */}
      <div className="flex items-center gap-2 md:gap-6">
        
        {/* Notifications */}
        <div className="flex items-center gap-1 md:gap-2 border-r border-slate-200 pr-2 md:pr-6">
          <button className="relative p-2.5 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 rounded-xl transition-all">
            <i className="far fa-bell text-lg"></i>
            <span className="absolute top-2 right-2.5 w-4 h-4 bg-rose-500 border-2 border-white text-white text-[10px] font-bold flex items-center justify-center rounded-full">
              3
            </span>
          </button>
          
          <button className="p-2.5 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 rounded-xl transition-all">
            <i className="far fa-envelope text-lg"></i>
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-none">
              Alex Johnson
            </h4>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-1 inline-block">
              Admin
            </span>
          </div>
          
          <div className="relative">
            <img 
              src="https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff" 
              alt="User" 
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-indigo-100 transition-all shadow-sm" 
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          
          <i className="fas fa-chevron-down text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors ml-1"></i>
        </div>

      </div>
    </header>
  );
};

export default Header;