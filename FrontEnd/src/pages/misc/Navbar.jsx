import React, { useEffect, useRef, useState } from 'react';

const ROLES = [
  { id: 'ambulance', label: 'Ambulance', color: '#ef4444' },
  { id: 'hospital', label: 'Hospital', color: '#10b981' },
  { id: 'traffic', label: 'Traffic Control', color: '#f59e0b' },
  { id: 'public', label: 'Public', color: '#3b82f6' },
  { id: 'control_room', label: 'Control Room', color: '#8b5cf6' },
];

const Navbar = ({ currentPage, setCurrentPage, onRoleSelect }) => {
  const navRef = useRef(null);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  useEffect(() => {
    if (navRef.current) {
      navRef.current.style.transform = 'translateX(-50%) translateY(-20px)';
      navRef.current.style.opacity = '0';
      setTimeout(() => {
        navRef.current.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        navRef.current.style.transform = 'translateX(-50%) translateY(0)';
        navRef.current.style.opacity = '1';
      }, 100);
    }
  }, []);

  return (
    <nav className="fixed top-7 left-1/2 -translate-x-1/2 z-50">
      <div
        ref={navRef}
        className="relative px-6 py-2.5 rounded-full flex items-center gap-3"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 10px 36px 0 rgba(0,0,0,0.40)'
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 pr-3 border-r border-white/20">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-xs font-bold text-white">G</div>
          <span className="text-white font-bold text-sm tracking-wide">GreenNote</span>
        </div>


        {/* Nav items */}
        <a
          href="home"
          onClick={() => setCurrentPage('home')}
          className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${currentPage === 'home' ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white'}`}
        >
          Home
        </a>
        <a
          href="about"
          className="px-3 py-1 text-sm font-medium text-white/70 hover:text-white transition-all duration-200"
        >
          About
        </a>

        {/* Highlighted Login Button */}
        <button
          onClick={() => setCurrentPage && setCurrentPage('login')}
          className="ml-2 px-5 py-1.5 rounded-full text-sm font-bold transition-all duration-200 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            color: 'white',
            border: 'none',
            boxShadow: '0 2px 12px 0 rgba(16,185,129,0.18)'
          }}
        >
          Login
        </button>

        {/* Role Selector */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white' }}
          >
            Launch Dashboard
            <svg className={`w-3 h-3 transition-transform ${showRoleMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showRoleMenu && (
            <div
              className="absolute top-full mt-2 right-0 rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(10,10,20,0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                minWidth: '200px'
              }}
            >
              <div className="px-4 py-2 border-b border-white/10">
                <p className="text-xs text-white/50 uppercase tracking-widest font-medium">Select Role</p>
              </div>
              {ROLES.map(role => (
                <button
                  key={role.id}
                  onClick={() => {
                    onRoleSelect(role.id);
                    setShowRoleMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-white/80 hover:text-white hover:bg-white/8 transition-all duration-150 flex items-center gap-3"
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: role.color }} />
                  <span>{role.label}</span>
                  <div className="ml-auto w-2 h-2 rounded-full" style={{ background: role.color }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
