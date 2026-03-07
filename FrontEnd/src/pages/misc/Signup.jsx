import AuroraWavesBackground from '../../components/AuroraWavesBackground';
import AnimatedStarfieldBackground from '../../components/AnimatedStarfieldBackground';
import React, { useState } from 'react';
import { AmbulanceIcon, HospitalIcon, TrafficLightIcon, CarIcon } from '../../components/Icons';
import AmbulanceSignup from '../ambulance/AmbulanceSignup';
import HospitalSignup from '../hospital/HospitalSignup';
import TrafficSignup from '../traffic/TrafficSignup';
import PublicSignup from '../public/PublicSignup';

const ROLES = [
  { id: 'ambulance', Icon: AmbulanceIcon, label: 'Ambulance', color: '#ef4444' },
  { id: 'hospital', Icon: HospitalIcon, label: 'Hospital', color: '#10b981' },
  { id: 'traffic', Icon: TrafficLightIcon, label: 'Traffic Control', color: '#f59e0b' },
  { id: 'public', Icon: CarIcon, label: 'Public', color: '#3b82f6' },
];

export default function Signup({ onBack, onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState(null);
  console.log('Signup render: selectedRole =', selectedRole);

  // Show AmbulanceSignup if ambulance is selected
  if (selectedRole === 'ambulance') {
    console.log('Rendering AmbulanceSignup');
    return <AmbulanceSignup onBack={() => setSelectedRole(null)} onLoginSuccess={onLoginSuccess} />;
  }
  // Show HospitalSignup if hospital is selected
  if (selectedRole === 'hospital') {
    console.log('Rendering HospitalSignup');
    return <HospitalSignup onBack={() => setSelectedRole(null)} onLoginSuccess={onLoginSuccess} />;
  }
  // Show TrafficSignup if traffic control is selected
  if (selectedRole === 'traffic') {
    return <TrafficSignup onBack={() => setSelectedRole(null)} onLoginSuccess={onLoginSuccess} />;
  }
  // Show PublicSignup if public is selected
  if (selectedRole === 'public') {
    return <PublicSignup onBack={() => setSelectedRole(null)} onLoginSuccess={onLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative py-10 px-4 overflow-hidden">
      <AnimatedStarfieldBackground />
      <AuroraWavesBackground />
      <button
        className="absolute top-6 left-6 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-blue-400/30 hover:to-emerald-400/30 text-white text-2xl font-extrabold shadow-xl transition-all duration-200 border border-white/20 group"
        style={{ backdropFilter: 'blur(10px)' }}
        onClick={onBack}
        aria-label="Back to Home"
      >
        <span className="relative flex items-center justify-center w-full h-full">
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 to-emerald-400/30 blur-lg opacity-0 group-hover:opacity-80 transition-all duration-300 animate-pulse" />
          <span className="relative z-10">
            {/* Modern left arrow SVG icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
              <path d="M15.75 19.25L8.75 12.25L15.75 5.25" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </button>
      <div className="w-full max-w-lg bg-white/5 rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-white/10">
        <h1 className="text-3xl font-extrabold text-center text-white mb-2 drop-shadow-lg tracking-tight">Choose your role</h1>
        <p className="text-center text-blue-200/80 mb-6">Select the type of user you want to sign up as</p>
        <div className="flex flex-row flex-wrap justify-center items-center gap-6 md:gap-8">
          {ROLES.map(role => (
            <button
              key={role.id}
              onClick={() => {
                console.log('Role button clicked:', role.id);
                setSelectedRole(role.id);
              }}
              className={`group flex flex-col items-center justify-center gap-2 px-6 py-5 rounded-2xl shadow-lg transition-all duration-200 border-2 font-bold text-lg ${selectedRole === role.id ? 'scale-105 border-white/80 bg-white/10' : 'border-white/20 bg-white/5 hover:scale-105 hover:border-white/40'}`}
              style={{ color: role.color, boxShadow: selectedRole === role.id ? `0 0 24px 0 ${role.color}55` : undefined }}
            >
              <span className="drop-shadow-lg"><role.Icon size={32} color={role.color} /></span>
              <span className="text-white text-base font-semibold drop-shadow-lg">{role.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}