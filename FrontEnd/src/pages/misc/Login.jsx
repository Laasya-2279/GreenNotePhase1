
import React, { useState, useRef } from 'react';
import AuroraWavesRedBackground from '../../components/AuroraWavesRedBackground';

const accent = 'linear-gradient(135deg, #10b981, #3b82f6)';

const LOGIN_CSS = `
  @keyframes loginRingPulse {
    0%   { box-shadow: 0 0 0 0px rgba(239,68,68,0.55), 0 0 24px rgba(239,68,68,0.30); }
    60%  { box-shadow: 0 0 0 8px rgba(239,68,68,0), 0 0 32px rgba(239,68,68,0.18); }
    100% { box-shadow: 0 0 0 0px rgba(239,68,68,0), 0 0 24px rgba(239,68,68,0.30); }
  }
  @keyframes loginShimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .login-btn-idle {
    animation: loginRingPulse 2.4s ease-in-out infinite;
  }
  .login-btn-shimmer-text {
    background: linear-gradient(90deg, #fff 0%, #fca5a5 30%, #fff 50%, #fca5a5 70%, #fff 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: loginShimmer 2.8s linear infinite;
  }
`;

const ROLES = [
  { id: 'ambulance', label: 'Ambulance Driver', color: '#ef4444' },
  { id: 'hospital', label: 'Hospital', color: '#10b981' },
  { id: 'traffic', label: 'Traffic Control', color: '#f59e0b' },
  { id: 'public', label: 'Public / Driver', color: '#3b82f6' },
  { id: 'control_room', label: 'Control Room', color: '#8b5cf6' },
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://greennotephase.onrender.com/api';

// Role mapping: backend uses uppercase, frontend uses lowercase
const ROLE_MAP_TO_FRONTEND = {
  AMBULANCE: 'ambulance',
  HOSPITAL: 'hospital',
  TRAFFIC: 'traffic',
  PUBLIC: 'public',
  CONTROL_ROOM: 'control_room',
};

// ── Real login API ──────────────────────────────────────────────────────────
async function loginApi(role, email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Login failed. Please try again.');
  }

  // Store tokens in localStorage
  if (data.accessToken) localStorage.setItem('gn_token', data.accessToken);
  if (data.refreshToken) localStorage.setItem('gn_refresh_token', data.refreshToken);

  const user = data.user || {};
  const frontendRole = ROLE_MAP_TO_FRONTEND[user.role] || role;

  return {
    success: true,
    user: {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: frontendRole,
      hospitalName: user.hospitalName || null,
      vehicleNumber: user.vehicleNumber || null,
    },
  };
}
// ─────────────────────────────────────────────────────────────────────────────

const ROLE_DASHBOARD = {
  ambulance: 'ambulance-dashboard',
  hospital: 'hospital-dashboard',
  traffic: 'traffic-dashboard',
  public: 'public-dashboard',
  control_room: 'controlroom-dashboard',
};

const Login = ({ onLoginSuccess, setCurrentPage }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('ambulance');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roleInfo = ROLES.find((r) => r.id === selectedRole);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await loginApi(selectedRole, form.email, form.password);
      setLoading(false);
      if (onLoginSuccess) onLoginSuccess(ROLE_DASHBOARD[selectedRole], result.user);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AuroraWavesRedBackground />
      <style>{LOGIN_CSS}</style>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex flex-col gap-3 w-full max-w-lg px-10 py-7 rounded-3xl shadow-2xl bg-white/5 backdrop-blur-xl border border-white/10 animate-fade-in"
      >
        {/* Title */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-tight">
            Sign in to{' '}
            <span style={{ background: accent, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} className="bg-clip-text">
              GreenNote
            </span>
          </h1>
          <p className="text-sm text-rose-200/70">Access your dashboard</p>
        </div>

        {/* Role selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M17 20h5v-1a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-1a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Role
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRoleMenu((v) => !v)}
              className="w-full h-11 px-4 rounded-xl bg-black/60 text-white text-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-rose-400/60 transition border"
              style={{ borderColor: `${roleInfo?.color}55` }}
            >
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: roleInfo?.color }} />
                {roleInfo?.label}
              </span>
              <svg className={`w-4 h-4 transition-transform text-white/50 ${showRoleMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showRoleMenu && (
              <div
                className="absolute top-full mt-1 left-0 right-0 rounded-xl overflow-hidden z-50 shadow-2xl"
                style={{ background: 'rgba(10,10,20,0.97)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => { setSelectedRole(role.id); setShowRoleMenu(false); setError(''); }}
                    className="w-full px-5 py-3 text-left text-base text-white/80 hover:text-white hover:bg-white/10 transition flex items-center gap-3"
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: role.color }} />
                    {role.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2 group">
          <label htmlFor="email" className="text-sm font-semibold text-white/80 flex items-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 012 17.5v-11z" stroke="#3b82f6" strokeWidth="1.5" />
              <path d="M22 6.5l-10 7-10-7" stroke="#10b981" strokeWidth="1.5" />
            </svg>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            className="h-11 px-4 text-sm rounded-xl bg-black/60 border border-rose-400/30 text-white placeholder:text-rose-200/40 focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:border-amber-400/80 transition shadow-sm group-hover:border-amber-400/60 group-focus-within:border-amber-400/80"
            placeholder="you@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2 group">
          <label htmlFor="password" className="text-sm font-semibold text-white/80 flex items-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="7" width="18" height="10" rx="5" stroke="#10b981" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="3" stroke="#3b82f6" strokeWidth="1.5" />
            </svg>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="h-11 px-4 text-sm rounded-xl bg-black/60 border border-rose-400/30 text-white placeholder:text-rose-200/40 focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:border-amber-400/80 transition w-full pr-16 shadow-sm group-hover:border-amber-400/60 group-focus-within:border-amber-400/80"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-rose-300 hover:text-rose-200 bg-white/10 px-2.5 py-1 rounded-full transition-all hover:scale-110"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label="Toggle password visibility"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-red-400 text-sm leading-relaxed">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          onMouseMove={(e) => {
            if (loading) return;
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--gx', `${e.clientX - r.left}px`);
            e.currentTarget.style.setProperty('--gy', `${e.clientY - r.top}px`);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.setProperty('--gx', '200%');
            e.currentTarget.style.setProperty('--gy', '200%');
          }}
          onMouseEnter={(e) => { e.currentTarget.classList.remove('login-btn-idle'); }}
          onBlur={(e) => { e.currentTarget.classList.add('login-btn-idle'); }}
          className="login-btn-idle mt-1 py-3 rounded-2xl font-bold text-white text-base outline-none disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          style={{
            background: 'radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(255,180,180,0.30) 0%, transparent 55%), linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #7f1d1d 100%)',
            border: '1px solid rgba(239,68,68,0.55)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 28px rgba(239,68,68,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; setTimeout(() => { if (e.currentTarget) e.currentTarget.style.transform = 'scale(1)'; }, 150); }}
        >
          {/* shimmer top edge */}
          <span className="absolute inset-x-8 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,200,200,0.70), transparent)' }} />
          {/* corner orb */}
          <span className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-2xl opacity-40 group-hover:opacity-65 transition-opacity duration-300" style={{ background: '#ef4444' }} />

          {loading ? (
            <span className="inline-flex items-center gap-2 justify-center relative z-10">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Signing in…
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 justify-center relative z-10">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="login-btn-shimmer-text font-extrabold tracking-wide">Login</span>
            </span>
          )}
        </button>

        {/* Footer links */}
        <div className="flex justify-between items-center text-sm text-rose-200/70">
          <a href="#" className="hover:underline hover:text-rose-200 transition-colors">Forgot password?</a>
          <a
            href="#"
            className="hover:underline hover:text-rose-200 transition-colors"
            onClick={(e) => { e.preventDefault(); setCurrentPage && setCurrentPage('signup'); }}
          >
            Don't have an account?<br /><span className="font-semibold">Sign up</span>
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;