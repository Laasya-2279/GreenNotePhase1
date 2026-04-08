import React, { useState } from 'react';
import AuroraWavesTrafficBackground from '../../components/AuroraWavesTrafficBackground';

export default function TrafficSignup({ onBack, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    officerName: '',
    badgeId: '',
    contactNumber: '',
    zone: '',
    photo: null
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
          role: 'TRAFFIC',
          name: formData.officerName,
          phone: formData.contactNumber,
          badgeId: formData.badgeId,
          zone: formData.zone,
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
        role: 'traffic',
        vehicleNumber: null,
      };

      if (onLoginSuccess) onLoginSuccess('traffic-dashboard', userObj);
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
      <AuroraWavesTrafficBackground />
      <button
        className="absolute top-6 left-6 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-blue-400/30 hover:to-emerald-400/30 text-white text-2xl font-extrabold shadow-xl transition-all duration-200 border border-white/20 group"
        style={{ backdropFilter: 'blur(10px)' }}
        onClick={handleBack}
        aria-label="Back to Home"
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
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-3xl bg-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-white/10 flex flex-row gap-8 items-stretch animate-fade-in">
        {/* Left: Form fields */}
        <div className="flex-1 flex flex-col gap-3 justify-center">
          <div className="flex flex-col items-center gap-2 text-center mb-2">
            <div className="mb-1 animate-hospital-bounce">
              {/* Traffic Signal Animation */}
              <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="10" width="20" height="60" rx="8" fill="#222" stroke="#2563eb" strokeWidth="2" />
                <circle cx="30" cy="26" r="7" fill="#ef4444" className="traffic-red" />
                <circle cx="30" cy="40" r="7" fill="#facc15" className="traffic-yellow" />
                <circle cx="30" cy="54" r="7" fill="#10b981" className="traffic-green" />
                <rect x="27" y="70" width="6" height="10" rx="2" fill="#2563eb" />
                <rect x="27" y="0" width="6" height="10" rx="2" fill="#2563eb" />
              </svg>
              <style>{`
                .traffic-red { animation: traffic-red-blink 2.4s infinite; }
                .traffic-yellow { animation: traffic-yellow-blink 2.4s infinite 0.8s; }
                .traffic-green { animation: traffic-green-blink 2.4s infinite 1.6s; }
                @keyframes traffic-red-blink {
                  0%, 100% { opacity: 1; }
                  33% { opacity: 0.3; }
                  66% { opacity: 0.3; }
                }
                @keyframes traffic-yellow-blink {
                  0%, 33% { opacity: 0.3; }
                  66% { opacity: 1; }
                  100% { opacity: 0.3; }
                }
                @keyframes traffic-green-blink {
                  0%, 66% { opacity: 0.3; }
                  100% { opacity: 1; }
                }
              `}</style>
            </div>
            <h1 className="text-2xl font-extrabold text-white drop-shadow-lg tracking-tight">Traffic Control Signup</h1>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-white">Email</label>
            <input id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@email.com"
              className="rounded-xl h-12 px-4 bg-black/60 border border-blue-400/30 text-white placeholder:text-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-green-400/80 transition shadow-sm group-hover:border-green-400/60 group-focus-within:border-green-400/80" />
            <span className={`text-xs ${fieldStatus.email === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.email}</span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-white">Password</label>
            <input id="password" type="password" value={formData.password} onChange={handleChange} required placeholder="••••••••"
              className="rounded-xl h-12 px-4 bg-black/60 border border-blue-400/30 text-white placeholder:text-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-green-400/80 transition shadow-sm group-hover:border-green-400/60 group-focus-within:border-green-400/80" />
            <span className={`text-xs ${fieldStatus.password === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.password}</span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="officerName" className="text-sm font-medium text-white">Officer Name</label>
            <input id="officerName" type="text" value={formData.officerName} onChange={handleChange} required placeholder="Officer Name"
              className="rounded-xl h-12 px-4 bg-black/60 border border-blue-400/30 text-white placeholder:text-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-green-400/80 transition shadow-sm group-hover:border-green-400/60 group-focus-within:border-green-400/80" />
            <span className={`text-xs ${fieldStatus.officerName === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.officerName}</span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="badgeId" className="text-sm font-medium text-white">Badge ID</label>
            <input id="badgeId" type="text" value={formData.badgeId} onChange={handleChange} required placeholder="Badge ID"
              className="rounded-xl h-12 px-4 bg-black/60 border border-blue-400/30 text-white placeholder:text-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-green-400/80 transition shadow-sm group-hover:border-green-400/60 group-focus-within:border-green-400/80" />
            <span className={`text-xs ${fieldStatus.badgeId === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.badgeId}</span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="contactNumber" className="text-sm font-medium text-white">Contact Number</label>
            <input id="contactNumber" type="tel" value={formData.contactNumber} onChange={handleChange} required placeholder="Contact Number"
              className="rounded-xl h-12 px-4 bg-black/60 border border-blue-400/30 text-white placeholder:text-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-green-400/80 transition shadow-sm group-hover:border-green-400/60 group-focus-within:border-green-400/80" />
            <span className={`text-xs ${fieldStatus.contactNumber === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.contactNumber}</span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="zone" className="text-sm font-medium text-white">Zone/Area</label>
            <input id="zone" type="text" value={formData.zone} onChange={handleChange} required placeholder="Zone/Area"
              className="rounded-xl h-12 px-4 bg-black/60 border border-blue-400/30 text-white placeholder:text-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-green-400/80 transition shadow-sm group-hover:border-green-400/60 group-focus-within:border-green-400/80" />
            <span className={`text-xs ${fieldStatus.zone === 'Looks good!' ? 'text-green-400' : 'text-red-400'}`}>{fieldStatus.zone}</span>
          </div>
          <button
            type="submit"
            className="mt-4 py-3 px-8 rounded-2xl font-bold text-white text-lg shadow-xl transition-all relative overflow-hidden group border-none focus:outline-none focus:ring-4 focus:ring-blue-400/40 animated-traffic-gradient-btn"
            style={{
              background: 'linear-gradient(120deg, #2563eb, #10b981, #facc15, #10b981, #2563eb)',
              backgroundSize: '300% 300%',
              boxShadow: '0 0 8px 2px #10b98180, 0 0 12px 2px #2563eb44',
              border: 'none',
            }}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 pointer-events-none" style={{ background: 'radial-gradient(circle at 60% 40%, #10b981cc 0%, #2563eb00 80%)' }}></span>
            <span className="relative inline-flex items-center gap-2 z-10">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="animate-bounce-x"><path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Sign Up
            </span>
            <span className="absolute -inset-1 rounded-2xl border-2 border-blue-400/40 opacity-0 group-hover:opacity-100 group-focus:opacity-100 animate-glow pointer-events-none"></span>
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
            .animated-traffic-gradient-btn {
              animation: traffic-gradient-move 3s ease-in-out infinite;
              box-shadow: 0 0 8px 2px #10b98180, 0 0 12px 2px #2563eb44;
              border: none;
            }
            @keyframes traffic-gradient-move {
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
          <span className={`text-xs ${photoStatus === 'Photo uploaded successfully!' ? 'text-green-400' : photoStatus ? 'text-red-400' : 'text-blue-200'}`}>{photoStatus || 'Upload a clear photo of the officer.'}</span>
        </div>
      </form>
    </div>
  );
}
