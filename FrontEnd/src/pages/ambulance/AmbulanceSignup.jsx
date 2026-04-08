import AuroraWavesBackground from '../../components/AuroraWavesBackground';
import React, { useState } from 'react';

export default function AmbulanceSignup({ onBack, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    driverName: '',
    contactNumber: '',
    photo: null,
    password: '',
    licenseNumber: '',
    vehicleNumber: '',
    driverId: ''
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoStatus, setPhotoStatus] = useState('');
  const [fieldStatus, setFieldStatus] = useState({});

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'photo') {
      if (files && files[0]) {
        const file = files[0];
        if (!file.type.startsWith('image/')) {
          setPhotoStatus('Upload failed: Not an image file.');
          setFormData((prev) => ({ ...prev, photo: null }));
          setPhotoPreview(null);
        } else {
          setFormData((prev) => ({ ...prev, photo: file }));
          setPhotoPreview(URL.createObjectURL(file));
          setPhotoStatus('Photo uploaded successfully!');
        }
      } else {
        setPhotoStatus('No photo selected.');
        setFormData((prev) => ({ ...prev, photo: null }));
        setPhotoPreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
      // Simple validation for required fields
      setFieldStatus((prev) => ({
        ...prev,
        [id]: value.trim() === '' ? 'This field is required.' : 'Looks good!'
      }));
    }
  };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const API = import.meta.env.VITE_API_BASE_URL || 'https://greennotephase.onrender.com/api';
      const res = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'AMBULANCE',
          name: formData.driverName,
          phone: formData.contactNumber,
          licenseNumber: formData.licenseNumber,
          vehicleNumber: formData.vehicleNumber,
          driverId: formData.driverId,
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
        role: 'ambulance',
        vehicleNumber: u.vehicleNumber || null,
      };

      if (onLoginSuccess) onLoginSuccess('ambulance-dashboard', userObj);
    } catch (err) {
      setMessage({ text: err.message || 'Signup failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-black to-emerald-950 relative py-10 px-4 overflow-hidden">
      <AuroraWavesBackground />
      {/* Animated/gradient background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Morphing animated gradient blob top left with hue rotation */}
        <svg className="absolute -top-32 -left-32 w-[600px] h-[600px] opacity-70 animate-blob-morph animate-hue-rotate" style={{ filter: 'blur(18px)' }} viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(300 300) rotate(90) scale(200)">
              <stop stopColor="#10b981" stopOpacity="0.7" />
              <stop offset="1" stopColor="#3b82f6" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          <path id="blob" fill="url(#paint0_radial)">
            <animate attributeName="d" dur="8s" repeatCount="indefinite"
              values="M300,100 Q400,120 450,200 Q500,300 400,400 Q300,500 200,400 Q100,300 200,200 Q250,120 300,100Z;
                      M300,120 Q420,140 470,220 Q520,320 420,420 Q300,520 180,420 Q80,320 180,220 Q230,140 300,120Z;
                      M300,100 Q400,120 450,200 Q500,300 400,400 Q300,500 200,400 Q100,300 200,200 Q250,120 300,100Z" />
          </path>
        </svg>
        {/* Additional animated hue blobs */}
        <svg className="absolute right-0 top-0 w-[320px] h-[320px] opacity-40 animate-hue-rotate2" style={{ filter: 'blur(32px)' }} viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientTransform="translate(160 160) rotate(90) scale(120)">
              <stop stopColor="#f59e0b" stopOpacity="0.7" />
              <stop offset="1" stopColor="#8b5cf6" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          <circle cx="160" cy="160" r="120" fill="url(#paint2_radial)" />
        </svg>
        <svg className="absolute left-0 bottom-0 w-[220px] h-[220px] opacity-30 animate-hue-rotate3" style={{ filter: 'blur(24px)' }} viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="paint3_radial" cx="0" cy="0" r="1" gradientTransform="translate(110 110) rotate(90) scale(90)">
              <stop stopColor="#ef4444" stopOpacity="0.5" />
              <stop offset="1" stopColor="#10b981" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <circle cx="110" cy="110" r="90" fill="url(#paint3_radial)" />
        </svg>
        {/* Animated sparkles */}
        <svg className="absolute left-1/4 top-1/3 w-10 h-10 opacity-60 animate-sparkle" viewBox="0 0 32 32" fill="none"><g><circle cx="16" cy="16" r="2" fill="#fff" /><circle cx="16" cy="16" r="6" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5" /></g></svg>
        <svg className="absolute right-1/4 bottom-1/4 w-8 h-8 opacity-50 animate-sparkle2" viewBox="0 0 32 32" fill="none"><g><circle cx="16" cy="16" r="1.5" fill="#fff" /><circle cx="16" cy="16" r="5" stroke="#10b981" strokeWidth="1.2" opacity="0.4" /></g></svg>
        {/* Moving light sweep */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="w-1/2 h-full absolute left-0 top-0 bg-gradient-to-r from-white/10 via-white/0 to-transparent blur-2xl animate-light-sweep" />
        </div>
        <svg className="absolute -top-32 -left-32 w-[600px] h-[600px] opacity-60 animate-spin-slow" style={{ filter: 'blur(12px)' }} viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="300" cy="300" r="200" fill="url(#paint0_radial)" />
          <defs>
            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(300 300) rotate(90) scale(200)">
              <stop stopColor="#10b981" stopOpacity="0.7" />
              <stop offset="1" stopColor="#3b82f6" stopOpacity="0.2" />
            </radialGradient>
          </defs>
        </svg>
        {/* Animated pulse blob bottom right */}
        <svg className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-40 animate-pulse" style={{ filter: 'blur(16px)' }} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="150" fill="url(#paint1_radial)" />
          <defs>
            <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientTransform="translate(200 200) rotate(90) scale(150)">
              <stop stopColor="#ef4444" stopOpacity="0.5" />
              <stop offset="1" stopColor="#8b5cf6" stopOpacity="0.1" />
            </radialGradient>
          </defs>
        </svg>
        {/* Moving blue ellipse */}
        <svg className="absolute left-1/2 top-0 w-[320px] h-[120px] opacity-30 animate-ellipse-move" style={{ filter: 'blur(8px)' }} viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="160" cy="60" rx="120" ry="40" fill="#3b82f6" />
        </svg>
        {/* Moving green ellipse */}
        <svg className="absolute right-1/3 bottom-0 w-[220px] h-[80px] opacity-20 animate-ellipse-move2" style={{ filter: 'blur(8px)' }} viewBox="0 0 220 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="110" cy="40" rx="90" ry="30" fill="#10b981" />
        </svg>
        {/* Floating red cross */}
        <svg className="absolute left-12 bottom-24 w-16 h-16 opacity-30 animate-cross-float" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="13" y="4" width="6" height="24" rx="2" fill="#ef4444" />
          <rect x="4" y="13" width="24" height="6" rx="2" fill="#ef4444" />
        </svg>
      </div>
      <button
        className="absolute top-6 left-6 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-blue-400/30 hover:to-emerald-400/30 text-white text-2xl font-extrabold shadow-xl transition-all duration-200 border border-white/20 group"
        style={{ backdropFilter: 'blur(10px)' }}
        onClick={onBack}
        aria-label="Back to Role Selection"
      >
        <span className="relative flex items-center justify-center w-full h-full">
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 to-emerald-400/30 blur-lg opacity-0 group-hover:opacity-80 transition-all duration-300 animate-pulse" />
          <span className="relative z-10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
              <path d="M15.75 19.25L8.75 12.25L15.75 5.25" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </button>
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-3xl bg-white/5 rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-white/10 flex flex-row gap-8 items-stretch animate-fade-in">
        {/* Left: Form fields */}
        <div className="flex-1 flex flex-col gap-3 justify-center">
          <div className="flex flex-col items-center gap-2 text-center mb-2">
            <div className="mb-1 animate-ambulance-run">
              <svg width="90" height="44" viewBox="0 0 90 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Ambulance body */}
                <rect x="10" y="18" width="50" height="18" rx="4" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
                {/* Windows */}
                <rect x="16" y="22" width="12" height="8" rx="2" fill="#e0f2fe" stroke="#3b82f6" strokeWidth="1" />
                <rect x="30" y="22" width="12" height="8" rx="2" fill="#e0f2fe" stroke="#3b82f6" strokeWidth="1" />
                {/* Red cross */}
                <rect x="48" y="25" width="6" height="2" fill="#ef4444" />
                <rect x="50" y="23" width="2" height="6" fill="#ef4444" />
                {/* Siren */}
                <rect x="32" y="14" width="6" height="6" rx="2" fill="#fff" stroke="#ef4444" strokeWidth="1.5" />
                <rect x="34.5" y="10" width="1" height="4" rx="0.5" fill="#ef4444" className="animate-siren" />
                {/* Wheels */}
                <circle cx="22" cy="38" r="4" fill="#222" />
                <circle cx="22" cy="38" r="2" fill="#8b5cf6" />
                <circle cx="48" cy="38" r="4" fill="#222" />
                <circle cx="48" cy="38" r="2" fill="#ef4444" />
                {/* Light lines for siren flash */}
                <rect x="34.5" y="7" width="1" height="2" rx="0.5" fill="#f59e0b" className="animate-siren-flash" />
                <rect x="37" y="8" width="1" height="2" rx="0.5" fill="#f59e0b" className="animate-siren-flash" />
                <rect x="32" y="8" width="1" height="2" rx="0.5" fill="#f59e0b" className="animate-siren-flash" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-white drop-shadow-lg tracking-tight">Ambulance Signup</h1>
            <p className="text-sm text-blue-200/80">Register your ambulance and driver details</p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-white">Email</label>
            <input id="email" type="email" value={formData.email} onChange={handleChange} required className="rounded-xl h-12 px-4 bg-black/60 border border-rose-400/30 text-white placeholder:text-rose-200/40 focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:border-amber-400/80 transition shadow-sm group-hover:border-amber-400/60 group-focus-within:border-amber-400/80" placeholder="you@email.com" />
            <span className={`text-xs ${fieldStatus.email === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.email}</span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-white">Password</label>
            <input id="password" type="password" value={formData.password} onChange={handleChange} required className="rounded-xl h-12 px-4 bg-black/60 border border-rose-400/30 text-white placeholder:text-rose-200/40 focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:border-amber-400/80 transition shadow-sm group-hover:border-amber-400/60 group-focus-within:border-amber-400/80" placeholder="••••••••" />
            <span className={`text-xs ${fieldStatus.password === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.password}</span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="driverName" className="text-sm font-medium text-white">Driver Name</label>
            <input id="driverName" type="text" value={formData.driverName} onChange={handleChange} required className="rounded-xl h-12 px-4 bg-black/60 border border-rose-400/30 text-white placeholder:text-rose-200/40 focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:border-amber-400/80 transition shadow-sm group-hover:border-amber-400/60 group-focus-within:border-amber-400/80" placeholder="Driver Name" />
            <span className={`text-xs ${fieldStatus.driverName === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.driverName}</span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="contactNumber" className="text-sm font-medium text-white">Contact Number</label>
            <input id="contactNumber" type="tel" value={formData.contactNumber} onChange={handleChange} required className="rounded-xl h-12 px-4 bg-black/60 border border-rose-400/30 text-white placeholder:text-rose-200/40 focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:border-amber-400/80 transition shadow-sm group-hover:border-amber-400/60 group-focus-within:border-amber-400/80" placeholder="Contact Number" />
            <span className={`text-xs ${fieldStatus.contactNumber === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.contactNumber}</span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="licenseNumber" className="text-sm font-medium text-white">Driving License Number</label>
            <input id="licenseNumber" type="text" value={formData.licenseNumber} onChange={handleChange} required className="rounded-xl h-12 px-4 bg-black/60 border border-rose-400/30 text-white placeholder:text-rose-200/40 focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:border-amber-400/80 transition shadow-sm group-hover:border-amber-400/60 group-focus-within:border-amber-400/80" placeholder="License Number" />
            <span className={`text-xs ${fieldStatus.licenseNumber === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.licenseNumber}</span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="vehicleNumber" className="text-sm font-medium text-white">Ambulance Vehicle Number</label>
            <input id="vehicleNumber" type="text" value={formData.vehicleNumber} onChange={handleChange} required className="rounded-xl h-12 px-4 bg-black/60 border border-rose-400/30 text-white placeholder:text-rose-200/40 focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:border-amber-400/80 transition shadow-sm group-hover:border-amber-400/60 group-focus-within:border-amber-400/80" placeholder="Vehicle Number" />
            <span className={`text-xs ${fieldStatus.vehicleNumber === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.vehicleNumber}</span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="driverId" className="text-sm font-medium text-white">Driver ID</label>
            <input id="driverId" type="text" value={formData.driverId} onChange={handleChange} required className="rounded-xl h-12 px-4 bg-black/60 border border-rose-400/30 text-white placeholder:text-rose-200/40 focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:border-amber-400/80 transition shadow-sm group-hover:border-amber-400/60 group-focus-within:border-amber-400/80" placeholder="Driver ID" />
            <span className={`text-xs ${fieldStatus.driverId === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.driverId}</span>
          </div>
          <button
            type="submit"
            className="mt-4 py-3 px-8 rounded-2xl font-bold text-white text-lg shadow-xl transition-all relative overflow-hidden group border-none focus:outline-none focus:ring-4 focus:ring-blue-400/40 animated-blue-gradient-btn"
            style={{
              background: 'linear-gradient(120deg, #2563eb, #38bdf8, #1e3a8a, #38bdf8, #2563eb)',
              backgroundSize: '300% 300%',
              boxShadow: '0 0 6px 2px #38bdf880, 0 0 10px 2px #2563eb44',
              border: 'none',
            }}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 pointer-events-none" style={{ background: 'radial-gradient(circle at 60% 40%, #38bdf8cc 0%, #2563eb00 80%)' }}></span>
            <span className="relative inline-flex items-center gap-2 z-10">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="animate-bounce-x"><path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Sign Up
            </span>
            <span className="absolute -inset-1 rounded-2xl border-2 border-blue-400/40 opacity-0 group-hover:opacity-100 group-focus:opacity-100 animate-glow pointer-events-none"></span>
          </button>
          {/* Animated blue gradient button styles */}
          <style>{`
            .animated-blue-gradient-btn {
              animation: blue-gradient-move 3s ease-in-out infinite;
              box-shadow: 0 0 6px 2px #38bdf880, 0 0 10px 2px #2563eb44;
              border: none;
            }
            @keyframes blue-gradient-move {
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
        </div>
        {/* Right: Photo upload/preview */}
        <div className="flex flex-col items-center justify-center w-64 min-w-[16rem]">
          <label htmlFor="photo" className="block text-white font-medium mb-2 text-lg">Photo</label>
          <label htmlFor="photo" className="w-48 h-48 rounded-2xl bg-white/20 border-2 border-dashed border-blue-400 flex items-center justify-center overflow-hidden mb-2 cursor-pointer hover:border-blue-500 transition-all animate-fade-in">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="object-cover w-full h-full" />
            ) : (
              <span className="text-blue-200 text-center">Click to upload photo</span>
            )}
            <input id="photo" type="file" accept="image/*" onChange={handleChange} className="hidden" />
          </label>
          <span className={`text-xs ${photoStatus === 'Photo uploaded successfully!' ? 'text-green-400' : photoStatus ? 'text-red-400' : 'text-blue-200'}`}>{photoStatus || 'Upload a clear photo of the driver.'}</span>
        </div>
      </form>
    </div>
  );
}
