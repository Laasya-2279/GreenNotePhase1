import React, { useState } from 'react';

const ROLE_META = {
  hospital: {
    icon: '🏥',
    label: 'Hospital',
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #065f46, #10b981)',
    glow: 'rgba(16,185,129,0.13)',
    stats: [
      { label: 'Active Cases',   value: '12',   icon: '🩺', sub: 'Currently admitted' },
      { label: 'Beds Available', value: '8',    icon: '🛏️', sub: 'Out of 20 total' },
      { label: 'Incoming Today', value: '3',    icon: '🚑', sub: 'Ambulances en route' },
      { label: 'Avg Wait Time',  value: '6 min', icon: '⏱️', sub: 'Emergency dept.' },
    ],
  },
  traffic: {
    icon: '🚦',
    label: 'Traffic Control',
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #78350f, #f59e0b)',
    glow: 'rgba(245,158,11,0.13)',
    stats: [
      { label: 'Active Corridors', value: '2',     icon: '🛣️', sub: 'Green corridors open' },
      { label: 'Signals Managed',  value: '14',    icon: '🚦', sub: 'Across city' },
      { label: 'Incidents Today',  value: '1',     icon: '⚠️', sub: 'Reported blockages' },
      { label: 'Avg Clear Time',   value: '3 min', icon: '✅', sub: 'Per corridor' },
    ],
  },
  public: {
    icon: '🚗',
    label: 'Public / Driver',
    accent: '#3b82f6',
    gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
    glow: 'rgba(59,130,246,0.13)',
    stats: [
      { label: 'Active Alerts',  value: '2',      icon: '🔔', sub: 'In your area' },
      { label: 'Nearby Ambul.',  value: '1',      icon: '🚑', sub: 'Active corridor' },
      { label: 'Reroute Advice', value: 'Active', icon: '🗺️', sub: 'Check map' },
      { label: 'Your Reports',   value: '0',      icon: '📝', sub: 'This month' },
    ],
  },
  control_room: {
    icon: '🖥️',
    label: 'Control Room',
    accent: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #4c1d95, #8b5cf6)',
    glow: 'rgba(139,92,246,0.13)',
    stats: [
      { label: 'Live Corridors', value: '3',  icon: '🛣️', sub: 'Currently active' },
      { label: 'Ambulances',     value: '5',  icon: '🚑', sub: 'On duty' },
      { label: 'Hospitals',      value: '3',  icon: '🏥', sub: 'Connected' },
      { label: 'Signals Online', value: '14', icon: '🟢', sub: 'All systems nominal' },
    ],
  },
};

const StatCard = ({ label, value, icon, sub, accent }) => (
  <div
    className="rounded-2xl p-5 flex flex-col gap-1.5"
    style={{ background: `${accent}0f`, border: `1px solid ${accent}30` }}
  >
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: `${accent}aa` }}>{label}</span>
      {icon && <span className="text-xl">{icon}</span>}
    </div>
    <div className="text-white font-extrabold text-2xl leading-tight">{value}</div>
    {sub && <div className="text-white/40 text-xs mt-0.5">{sub}</div>}
  </div>
);

const RoleDashboard = ({ user, onLogout, setCurrentPage }) => {
  const role = user?.role || 'hospital';
  const meta = ROLE_META[role] || ROLE_META.hospital;
  const { icon, label, accent, gradient, glow, stats } = meta;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 40% at 50% 0%, ${glow} 0%, transparent 70%)` }}
      />

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(16px)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
            style={{ background: gradient }}
          >
            {icon}
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-white leading-none">GreenNote</h1>
            <p className="text-xs font-medium" style={{ color: `${accent}99` }}>{label} Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('map')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', boxShadow: '0 4px 16px rgba(59,130,246,0.25)' }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#fff"/>
            </svg>
            Open Map
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white/60 hover:text-white transition-all hover:bg-white/10"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-5xl mx-auto px-8 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome,{' '}
            <span style={{ background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {user?.name || label}
            </span>{' '}
            {icon}
          </h2>
          <p className="text-white/40 mt-1 text-sm">{user?.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} accent={accent} />
          ))}
        </div>

        {/* Recent activity placeholder */}
        <div
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-4">Recent Activity</h3>
          <div className="flex flex-col gap-3">
            {[
              { time: 'Just now',  event: `Logged in as ${label}`,       dot: accent },
              { time: '1h ago',    event: 'Dashboard last refreshed',     dot: '#6b7280' },
              { time: 'Yesterday', event: 'System status: All nominal',   dot: '#10b981' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                <span className="text-xs text-white/30 w-20 flex-shrink-0">{item.time}</span>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.dot }} />
                <span className="text-sm text-white/70">{item.event}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoleDashboard;
