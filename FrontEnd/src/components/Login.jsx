
import React, { useState } from 'react';
import AuroraWavesRedBackground from './AuroraWavesRedBackground';

const accent = 'linear-gradient(135deg, #10b981, #3b82f6)';

const ROLES = [
  { id: 'ambulance',    label: '🚑 Ambulance Driver',  color: '#ef4444' },
  { id: 'hospital',     label: '🏥 Hospital',           color: '#10b981' },
  { id: 'traffic',      label: '🚦 Traffic Control',    color: '#f59e0b' },
  { id: 'public',       label: '🚗 Public / Driver',    color: '#3b82f6' },
  { id: 'control_room', label: '🖥️ Control Room',       color: '#8b5cf6' },
];

// ── Mock login API (replace with real fetch() when backend is ready) ─────────
async function loginApi(role, email, password) {
  await new Promise((r) => setTimeout(r, 900)); // simulate network latency

  const DEMO = {
    ambulance:    { email: 'ambulance@demo.com',   password: 'demo123', name: 'Rajan Kumar',  vehicleNumber: 'KL-07-AB-1234' },
    hospital:     { email: 'hospital@demo.com',    password: 'demo123', name: 'City Hospital' },
    traffic:      { email: 'traffic@demo.com',     password: 'demo123', name: 'Traffic Ctrl'  },
    public:       { email: 'public@demo.com',      password: 'demo123', name: 'Public User'   },
    control_room: { email: 'controlroom@demo.com', password: 'demo123', name: 'Control Room'  },
  };

  const cred = DEMO[role];
  if (!cred) throw new Error('Unknown role. Please contact support.');
  if (email.trim().toLowerCase() !== cred.email) throw new Error('No account found with this email address.');
  if (password !== cred.password) throw new Error('Incorrect password. Please try again.');

  return { success: true, user: { email: cred.email, name: cred.name, vehicleNumber: cred.vehicleNumber, role } };
}
// ─────────────────────────────────────────────────────────────────────────────

const ROLE_DASHBOARD = {
  ambulance:    'ambulance-dashboard',
  hospital:     'hospital-dashboard',
  traffic:      'traffic-dashboard',
  public:       'public-dashboard',
  control_room: 'controlroom-dashboard',
};

const Login = ({ onLoginSuccess, setCurrentPage }) => {
  const [form, setForm]                 = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('ambulance');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

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

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex flex-col gap-7 w-full max-w-lg px-10 py-12 rounded-3xl shadow-2xl bg-white/5 backdrop-blur-xl border border-white/10 animate-fade-in"
      >
        {/* Title */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="mb-2 animate-bounce-slow">
            <svg width="60" height="60" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" fill="#10b981" fillOpacity="0.15" />
              <path d="M16 24l6 6 10-10" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg tracking-tight">
            Sign in to{' '}
            <span style={{ background: accent, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} className="bg-clip-text">
              GreenNote
            </span>
          </h1>
          <p className="text-base text-rose-200/80">Access your dashboard</p>
        </div>

        {/* Role selector */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold text-white/80 flex items-center gap-2">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M17 20h5v-1a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-1a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Role
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRoleMenu((v) => !v)}
              className="w-full h-14 px-5 rounded-xl bg-black/60 text-white text-base flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-rose-400/60 transition border"
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
          <label htmlFor="email" className="text-base font-semibold text-white/80 flex items-center gap-2">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 012 17.5v-11z" stroke="#3b82f6" strokeWidth="1.5"/>
              <path d="M22 6.5l-10 7-10-7" stroke="#10b981" strokeWidth="1.5"/>
            </svg>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            className="h-14 px-5 text-base rounded-xl bg-black/60 border border-rose-400/30 text-white placeholder:text-rose-200/40 focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:border-amber-400/80 transition shadow-sm group-hover:border-amber-400/60 group-focus-within:border-amber-400/80"
            placeholder="you@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2 group">
          <label htmlFor="password" className="text-base font-semibold text-white/80 flex items-center gap-2">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="7" width="18" height="10" rx="5" stroke="#10b981" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="3" stroke="#3b82f6" strokeWidth="1.5"/>
            </svg>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="h-14 px-5 text-base rounded-xl bg-black/60 border border-rose-400/30 text-white placeholder:text-rose-200/40 focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:border-amber-400/80 transition w-full pr-16 shadow-sm group-hover:border-amber-400/60 group-focus-within:border-amber-400/80"
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
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-red-400 text-sm leading-relaxed">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 py-4 rounded-2xl font-bold text-white text-xl shadow-lg transition-all hover:scale-105 hover:shadow-rose-400/40 focus:scale-105 active:scale-95 outline-none ring-2 ring-transparent focus:ring-rose-400/60 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ background: 'linear-gradient(135deg, #e35417, #fd0707, #8e0707)', boxShadow: '0 4px 24px 0 #ef444433' }}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2 justify-center">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Signing in…
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 justify-center">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Login as {roleInfo?.label}
            </span>
          )}
        </button>

        {/* Demo hint */}
        <div
          className="rounded-xl px-4 py-3 text-sm text-white/40 text-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <span className="font-semibold text-white/50">Demo — </span>
          ambulance: <span className="text-white/60">ambulance@demo.com</span> / <span className="text-white/60">demo123</span>
        </div>

        {/* Footer links */}
        <div className="flex justify-between items-center text-sm text-rose-200/70">
          <a href="#" className="hover:underline hover:text-rose-200 transition-colors">Forgot password?</a>
          <a
            href="#"
            className="hover:underline hover:text-rose-200 transition-colors"
            onClick={(e) => { e.preventDefault(); setCurrentPage && setCurrentPage('signup'); }}
          >
            Don't have an account? <span className="font-semibold">Sign up</span>
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;