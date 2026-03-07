import React, { useEffect } from 'react';
import { AmbulanceIcon } from '../../components/Icons';

const AmbulanceDashboard = ({ setCurrentPage }) => {
  useEffect(() => { setCurrentPage('map'); }, []);
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-5">
      <div className="relative">
        <div className="animate-bounce"><AmbulanceIcon size={64} color="#ef4444" /></div>
        <div className="absolute -inset-4 rounded-full animate-ping"
          style={{ background: 'rgba(239,68,68,0.12)', border: '1.5px solid rgba(239,68,68,0.25)' }} />
      </div>
      <div className="text-center">
        <p className="text-white text-xl font-extrabold tracking-tight">Loading Live Map&hellip;</p>
        <p className="text-white/35 text-sm mt-1">Preparing your corridor view</p>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        {[0,1,2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full bg-red-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
};

export default AmbulanceDashboard;
