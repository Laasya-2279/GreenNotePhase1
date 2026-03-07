import React, { useState } from 'react';
import AuroraWavesPublicBackground from '../../components/AuroraWavesPublicBackground';

export default function PublicSignup({ onBack, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [fieldStatus, setFieldStatus] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setFieldStatus((prev) => ({
      ...prev,
      [id]: value.trim() === '' ? 'This field is required.' : 'Looks good!'
    }));
  };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      const res = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'PUBLIC',
          name: formData.name,
          phone: formData.phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');

      // Auto-login after successful signup
      const loginRes = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.message || 'Login failed after signup');

      if (loginData.accessToken) localStorage.setItem('gn_token', loginData.accessToken);
      if (loginData.refreshToken) localStorage.setItem('gn_refresh_token', loginData.refreshToken);

      const u = loginData.user;
      const userObj = {
        id: u._id || u.id,
        email: u.email,
        name: u.name,
        phone: u.phone,
        role: 'public',
        vehicleNumber: null,
      };

      if (onLoginSuccess) onLoginSuccess('public-dashboard', userObj);
    } catch (err) {
      setMessage({ text: err.message || 'Signup failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  function handleBack() {
    onBack && onBack();
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative py-10 px-4 overflow-hidden">
      <AuroraWavesPublicBackground />
      {/* Human waving animation at the top */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30 animate-public-bounce">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head */}
          <circle cx="50" cy="28" r="14" fill="#a21caf" stroke="#14b8a6" strokeWidth="2" />
          {/* Body */}
          <rect x="40" y="42" width="20" height="28" rx="8" fill="#fff" stroke="#14b8a6" strokeWidth="1.5" />
          {/* Left arm (waving) */}
          <g className="animate-waving">
            <rect x="22" y="38" width="8" height="28" rx="4" fill="#a3e635" stroke="#14b8a6" strokeWidth="1.5" />
            <ellipse cx="26" cy="38" rx="4" ry="4" fill="#a3e635" stroke="#14b8a6" strokeWidth="1" />
          </g>
          {/* Right arm */}
          <rect x="70" y="46" width="8" height="20" rx="4" fill="#a3e635" stroke="#14b8a6" strokeWidth="1.5" />
          <ellipse cx="74" cy="66" rx="4" ry="4" fill="#a3e635" stroke="#14b8a6" strokeWidth="1" />
          {/* Legs */}
          <rect x="44" y="70" width="6" height="16" rx="3" fill="#a21caf" />
          <rect x="50" y="70" width="6" height="16" rx="3" fill="#a21caf" />
          {/* Shadow */}
          <ellipse cx="50" cy="92" rx="14" ry="4" fill="#14b8a6" opacity="0.2" />
        </svg>
        {/* CSS for waving animation */}
        <style>{`
          .animate-waving {
            transform-origin: 26px 38px;
            animation: waving-hand 1.2s infinite ease-in-out;
          }
          @keyframes waving-hand {
            0% { transform: rotate(-10deg); }
            20% { transform: rotate(20deg); }
            40% { transform: rotate(-10deg); }
            100% { transform: rotate(-10deg); }
          }
        `}</style>
      </div>
      <button
        className="absolute top-6 left-6 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-teal-400/30 hover:to-lime-400/30 text-white text-2xl font-extrabold shadow-xl transition-all duration-200 border border-white/20 group"
        style={{ backdropFilter: 'blur(10px)' }}
        onClick={handleBack}
        aria-label="Back to Home"
      >
        <span className="relative flex items-center justify-center w-full h-full">
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400/30 to-lime-400/30 blur-lg opacity-0 group-hover:opacity-80 transition-all duration-300 animate-pulse" />
          <span className="relative z-10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
              <path d="M15.75 19.25L8.75 12.25L15.75 5.25" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </button>
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-xl bg-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-white/10 flex flex-col gap-6 items-stretch animate-fade-in">
        <div className="flex flex-col items-center gap-2 text-center mb-2">
          <div className="mb-1 animate-public-bounce">
            <svg width="80" height="54" viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="24" width="60" height="20" rx="4" fill="#fff" stroke="#14b8a6" strokeWidth="2" />
              <rect x="16" y="30" width="10" height="6" rx="1.5" fill="#a3e635" stroke="#14b8a6" strokeWidth="1" />
              <rect x="28" y="30" width="10" height="6" rx="1.5" fill="#a3e635" stroke="#14b8a6" strokeWidth="1" />
              <rect x="44" y="30" width="10" height="6" rx="1.5" fill="#a3e635" stroke="#14b8a6" strokeWidth="1" />
              <rect x="56" y="30" width="10" height="6" rx="1.5" fill="#a3e635" stroke="#14b8a6" strokeWidth="1" />
              <rect x="36" y="36" width="8" height="8" rx="2" fill="#a21caf" stroke="#14b8a6" strokeWidth="1.5" />
              <rect x="38.5" y="38.5" width="3" height="1.2" fill="#a3e635" />
              <rect x="39.9" y="37" width="1.2" height="3" fill="#a3e635" />
              <rect x="24" y="16" width="32" height="10" rx="2" fill="#a21caf" stroke="#14b8a6" strokeWidth="2" />
              <rect x="38.5" y="19.5" width="3" height="1.2" fill="#fff" />
              <rect x="39.9" y="18" width="1.2" height="3" fill="#fff" />
              <circle cx="20" cy="20" r="2" fill="#a3e635" className="animate-public-sparkle" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-white drop-shadow-lg tracking-tight">Public Signup</h1>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-white">Email</label>
          <input id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@email.com"
            className="rounded-xl h-12 px-4 bg-black/60 border border-teal-400/30 text-white placeholder:text-teal-200/40 focus:outline-none focus:ring-2 focus:ring-teal-400/60 focus:border-lime-400/80 transition shadow-sm group-hover:border-lime-400/60 group-focus-within:border-lime-400/80" />
          <span className={`text-xs ${fieldStatus.email === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.email}</span>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-white">Password</label>
          <input id="password" type="password" value={formData.password} onChange={handleChange} required placeholder="••••••••"
            className="rounded-xl h-12 px-4 bg-black/60 border border-teal-400/30 text-white placeholder:text-teal-200/40 focus:outline-none focus:ring-2 focus:ring-teal-400/60 focus:border-lime-400/80 transition shadow-sm group-hover:border-lime-400/60 group-focus-within:border-lime-400/80" />
          <span className={`text-xs ${fieldStatus.password === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.password}</span>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-white">Name</label>
          <input id="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Your Name"
            className="rounded-xl h-12 px-4 bg-black/60 border border-teal-400/30 text-white placeholder:text-teal-200/40 focus:outline-none focus:ring-2 focus:ring-teal-400/60 focus:border-lime-400/80 transition shadow-sm group-hover:border-lime-400/60 group-focus-within:border-lime-400/80" />
          <span className={`text-xs ${fieldStatus.name === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.name}</span>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium text-white">Phone Number</label>
          <input id="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="Phone Number"
            className="rounded-xl h-12 px-4 bg-black/60 border border-teal-400/30 text-white placeholder:text-teal-200/40 focus:outline-none focus:ring-2 focus:ring-teal-400/60 focus:border-lime-400/80 transition shadow-sm group-hover:border-lime-400/60 group-focus-within:border-lime-400/80" />
          <span className={`text-xs ${fieldStatus.phone === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.phone}</span>
        </div>
        <button
          type="submit"
          className="mt-4 py-3 px-8 rounded-2xl font-bold text-white text-lg shadow-xl transition-all relative overflow-hidden group border-none focus:outline-none focus:ring-4 focus:ring-teal-400/40 animated-public-gradient-btn"
          style={{
            background: 'linear-gradient(120deg, #14b8a6, #a3e635, #a21caf, #a3e635, #14b8a6)',
            backgroundSize: '300% 300%',
            boxShadow: '0 0 8px 2px #a3e63580, 0 0 12px 2px #14b8a644',
            border: 'none',
          }}
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 pointer-events-none" style={{ background: 'radial-gradient(circle at 60% 40%, #a3e635cc 0%, #14b8a600 80%)' }}></span>
          <span className="relative inline-flex items-center gap-2 z-10">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="animate-bounce-x"><path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Sign Up
          </span>
          <span className="absolute -inset-1 rounded-2xl border-2 border-teal-400/40 opacity-0 group-hover:opacity-100 group-focus:opacity-100 animate-glow pointer-events-none"></span>
        </button>
        <style>{`
          @keyframes public-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-public-bounce { animation: public-bounce 2.2s infinite cubic-bezier(.68,-0.55,.27,1.55); }
          @keyframes public-sparkle {
            0%, 100% { opacity: 0.7; r: 2; }
            50% { opacity: 1; r: 3; }
          }
          .animate-public-sparkle { animation: public-sparkle 1.8s infinite alternate; }
          .animated-public-gradient-btn {
            animation: public-gradient-move 3s ease-in-out infinite;
            box-shadow: 0 0 8px 2px #a3e63580, 0 0 12px 2px #14b8a644;
            border: none;
          }
          @keyframes public-gradient-move {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
        {message.text && (
          <div className={`mt-3 rounded-xl px-4 py-3 text-sm font-medium text-center ${message.type === 'success' ? 'bg-green-500/15 border border-green-500/30 text-green-400' : 'bg-red-500/15 border border-red-500/30 text-red-400'}`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
