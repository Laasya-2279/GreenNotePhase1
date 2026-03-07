import React, { useState } from 'react';

import AuroraWavesHospitalBackground from '../../components/AuroraWavesHospitalBackground';

export default function HospitalSignup({ onBack, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    hospitalName: '',
    hospitalId: '',
    hospitalAddress: '',
    contactNumber: '',
    hospitalHead: ''
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
          role: 'HOSPITAL',
          name: formData.hospitalHead || formData.hospitalName,
          phone: formData.contactNumber,
          hospitalName: formData.hospitalName,
          hospitalId: formData.hospitalId,
          address: formData.hospitalAddress,
          headOfHospital: formData.hospitalHead,
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
        role: 'hospital',
        hospitalName: u.hospitalName || formData.hospitalName,
        vehicleNumber: null,
      };

      if (onLoginSuccess) onLoginSuccess('hospital-dashboard', userObj);
    } catch (err) {
      setMessage({ text: err.message || 'Signup failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Back button handler: go to select role page
  function handleBack() {
    onBack && onBack();
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative py-10 px-4 overflow-hidden">
      <AuroraWavesHospitalBackground />
      <button
        className="absolute top-6 left-6 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-fuchsia-400/30 hover:to-pink-400/30 text-white text-2xl font-extrabold shadow-xl transition-all duration-200 border border-white/20 group"
        style={{ backdropFilter: 'blur(10px)' }}
        onClick={handleBack}
        aria-label="Back to Home"
      >
        <span className="relative flex items-center justify-center w-full h-full">
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-400/30 to-pink-400/30 blur-lg opacity-0 group-hover:opacity-80 transition-all duration-300 animate-pulse" />
          <span className="relative z-10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
              <path d="M15.75 19.25L8.75 12.25L15.75 5.25" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </button>
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-2xl bg-white/10 rounded-3xl shadow-2xl p-10 backdrop-blur-xl border border-white/10 flex flex-col gap-6 items-stretch animate-fade-in">
        <div className="flex flex-col items-center gap-2 text-center mb-2">
          <div className="mb-1 animate-hospital-bounce">
            <svg width="80" height="54" viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="24" width="60" height="20" rx="4" fill="#fff" stroke="#a21caf" strokeWidth="2" />
              <rect x="16" y="30" width="10" height="6" rx="1.5" fill="#f3e8ff" stroke="#a21caf" strokeWidth="1" />
              <rect x="28" y="30" width="10" height="6" rx="1.5" fill="#f3e8ff" stroke="#a21caf" strokeWidth="1" />
              <rect x="44" y="30" width="10" height="6" rx="1.5" fill="#f3e8ff" stroke="#a21caf" strokeWidth="1" />
              <rect x="56" y="30" width="10" height="6" rx="1.5" fill="#f3e8ff" stroke="#a21caf" strokeWidth="1" />
              <rect x="36" y="36" width="8" height="8" rx="2" fill="#f472b6" stroke="#a21caf" strokeWidth="1.5" />
              <rect x="38.5" y="38.5" width="3" height="1.2" fill="#f59e42" />
              <rect x="39.9" y="37" width="1.2" height="3" fill="#f59e42" />
              <rect x="24" y="16" width="32" height="10" rx="2" fill="#f472b6" stroke="#a21caf" strokeWidth="2" />
              <rect x="38.5" y="19.5" width="3" height="1.2" fill="#fff" />
              <rect x="39.9" y="18" width="1.2" height="3" fill="#fff" />
              <circle cx="20" cy="20" r="2" fill="#f59e42" className="animate-hospital-sparkle" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-tight">Hospital Signup</h1>
        </div>
        {/* ...form fields as before... */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-base font-semibold text-white">Email</label>
          <input id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@email.com"
            className="rounded-xl h-14 px-5 text-base bg-black/60 border border-fuchsia-400/30 text-white placeholder:text-fuchsia-200/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 focus:border-pink-400/80 transition shadow-sm group-hover:border-pink-400/60 group-focus-within:border-pink-400/80" />
          <span className={`text-sm ${fieldStatus.email === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.email}</span>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-base font-semibold text-white">Password</label>
          <input id="password" type="password" value={formData.password} onChange={handleChange} required placeholder="••••••••"
            className="rounded-xl h-14 px-5 text-base bg-black/60 border border-fuchsia-400/30 text-white placeholder:text-fuchsia-200/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 focus:border-pink-400/80 transition shadow-sm group-hover:border-pink-400/60 group-focus-within:border-pink-400/80" />
          <span className={`text-sm ${fieldStatus.password === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.password}</span>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="hospitalName" className="text-base font-semibold text-white">Hospital Name</label>
          <input id="hospitalName" type="text" value={formData.hospitalName} onChange={handleChange} required placeholder="Hospital Name"
            className="rounded-xl h-14 px-5 text-base bg-black/60 border border-fuchsia-400/30 text-white placeholder:text-fuchsia-200/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 focus:border-pink-400/80 transition shadow-sm group-hover:border-pink-400/60 group-focus-within:border-pink-400/80" />
          <span className={`text-sm ${fieldStatus.hospitalName === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.hospitalName}</span>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="hospitalId" className="text-base font-semibold text-white">Hospital ID</label>
          <input id="hospitalId" type="text" value={formData.hospitalId} onChange={handleChange} required placeholder="Hospital ID"
            className="rounded-xl h-14 px-5 text-base bg-black/60 border border-fuchsia-400/30 text-white placeholder:text-fuchsia-200/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 focus:border-pink-400/80 transition shadow-sm group-hover:border-pink-400/60 group-focus-within:border-pink-400/80" />
          <span className={`text-sm ${fieldStatus.hospitalId === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.hospitalId}</span>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="hospitalAddress" className="text-base font-semibold text-white">Hospital Address</label>
          <input id="hospitalAddress" type="text" value={formData.hospitalAddress} onChange={handleChange} required placeholder="Hospital Address"
            className="rounded-xl h-14 px-5 text-base bg-black/60 border border-fuchsia-400/30 text-white placeholder:text-fuchsia-200/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 focus:border-pink-400/80 transition shadow-sm group-hover:border-pink-400/60 group-focus-within:border-pink-400/80" />
          <span className={`text-sm ${fieldStatus.hospitalAddress === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.hospitalAddress}</span>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="contactNumber" className="text-base font-semibold text-white">Contact Number</label>
          <input id="contactNumber" type="tel" value={formData.contactNumber} onChange={handleChange} required placeholder="Contact Number"
            className="rounded-xl h-14 px-5 text-base bg-black/60 border border-fuchsia-400/30 text-white placeholder:text-fuchsia-200/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 focus:border-pink-400/80 transition shadow-sm group-hover:border-pink-400/60 group-focus-within:border-pink-400/80" />
          <span className={`text-sm ${fieldStatus.contactNumber === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.contactNumber}</span>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="hospitalHead" className="text-base font-semibold text-white">Incharged Hospital Head</label>
          <input id="hospitalHead" type="text" value={formData.hospitalHead} onChange={handleChange} required placeholder="Hospital Head Name"
            className="rounded-xl h-14 px-5 text-base bg-black/60 border border-fuchsia-400/30 text-white placeholder:text-fuchsia-200/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 focus:border-pink-400/80 transition shadow-sm group-hover:border-pink-400/60 group-focus-within:border-pink-400/80" />
          <span className={`text-sm ${fieldStatus.hospitalHead === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.hospitalHead}</span>
        </div>
        <button
          type="submit"
          className="mt-4 py-4 px-8 rounded-2xl font-bold text-white text-xl shadow-xl transition-all relative overflow-hidden group border-none focus:outline-none focus:ring-4 focus:ring-fuchsia-400/40 animated-hospital-gradient-btn"
          style={{
            background: 'linear-gradient(120deg, #a21caf, #f472b6, #f59e42, #f472b6, #a21caf)',
            backgroundSize: '300% 300%',
            boxShadow: '0 0 8px 2px #f472b680, 0 0 12px 2px #a21caf44',
            border: 'none',
          }}
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 pointer-events-none" style={{ background: 'radial-gradient(circle at 60% 40%, #f472b6cc 0%, #a21caf00 80%)' }}></span>
          <span className="relative inline-flex items-center gap-2 z-10">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="animate-bounce-x"><path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Sign Up
          </span>
          <span className="absolute -inset-1 rounded-2xl border-2 border-fuchsia-400/40 opacity-0 group-hover:opacity-100 group-focus:opacity-100 animate-glow pointer-events-none"></span>
        </button>
        <style>{`
          @keyframes hospital-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-hospital-bounce { animation: hospital-bounce 2.2s infinite cubic-bezier(.68,-0.55,.27,1.55); }
          @keyframes hospital-sparkle {
            0%, 100% { opacity: 0.7; r: 2; }
            50% { opacity: 1; r: 3; }
          }
          .animate-hospital-sparkle { animation: hospital-sparkle 1.8s infinite alternate; }
          .animated-hospital-gradient-btn {
            animation: hospital-gradient-move 3s ease-in-out infinite;
            box-shadow: 0 0 8px 2px #f472b680, 0 0 12px 2px #a21caf44;
            border: none;
          }
          @keyframes hospital-gradient-move {
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
