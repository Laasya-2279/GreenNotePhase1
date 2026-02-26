import React, { useState } from 'react';

// ── Animated background ────────────────────────────────────────────────────
const TRAFFIC_BG_CSS = `
  @keyframes trafficRingExpand {
    0%   { transform: translate(-50%,-50%) scale(0.5); opacity: 0.7; }
    100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; }
  }
  @keyframes trafficCornerSpin {
    0%   { transform: rotate(45deg) scale(1);     opacity: 0.2; }
    50%  { transform: rotate(225deg) scale(1.12); opacity: 0.38; }
    100% { transform: rotate(405deg) scale(1);    opacity: 0.2; }
  }
  @keyframes trafficCornerSpin2 {
    0%   { transform: rotate(45deg) scale(1);     opacity: 0.15; }
    50%  { transform: rotate(225deg) scale(1.08); opacity: 0.28; }
    100% { transform: rotate(405deg) scale(1);    opacity: 0.15; }
  }
`;

const TrafficAnimatedBackground = () => (
  <>
    <style>{TRAFFIC_BG_CSS}</style>
    <div style={{ position:'fixed', inset:0, zIndex:0, overflow:'hidden', pointerEvents:'none' }}>

      {/* Deep background */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, #0d0800 0%, #030712 50%, #0d0900 100%)' }} />

      {/* Circle ring cluster — bottom-left */}
      <div style={{ position:'absolute', bottom:'12%', left:'5%' }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{
            position:'absolute', top:'50%', left:'50%', width:360, height:360, borderRadius:'50%',
            border: i % 2 === 0 ? '1.5px solid rgba(245,158,11,0.32)' : '1px solid rgba(251,191,36,0.22)',
            animation:'trafficRingExpand 7s ease-out infinite', animationDelay:`${i * 1.16}s`,
          }} />
        ))}
      </div>

      {/* Circle ring cluster — top-right */}
      <div style={{ position:'absolute', top:'15%', right:'8%' }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            position:'absolute', top:'50%', left:'50%', width:280, height:280, borderRadius:'50%',
            border: i % 2 === 0 ? '1.5px solid rgba(252,211,77,0.28)' : '1px solid rgba(245,158,11,0.2)',
            animation:'trafficRingExpand 9s ease-out infinite', animationDelay:`${i * 1.8}s`,
          }} />
        ))}
      </div>

      {/* Circle ring cluster — center-left */}
      <div style={{ position:'absolute', top:'48%', left:'18%' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            position:'absolute', top:'50%', left:'50%', width:200, height:200, borderRadius:'50%',
            border:'1px solid rgba(253,230,138,0.18)',
            animation:'trafficRingExpand 11s ease-out infinite', animationDelay:`${i * 2.75}s`,
          }} />
        ))}
      </div>

      {/* Diamond ring set — bottom-right corner */}
      <div style={{ position:'absolute', bottom:'-50px', right:'-50px', width:'300px', height:'300px',
        border:'1.5px solid rgba(245,158,11,0.32)', borderRadius:'36px',
        boxShadow:'inset 0 0 50px rgba(245,158,11,0.07), 0 0 35px rgba(245,158,11,0.1)',
        animation:'trafficCornerSpin 12s linear infinite' }} />
      <div style={{ position:'absolute', bottom:'-25px', right:'-25px', width:'210px', height:'210px',
        border:'1px solid rgba(251,191,36,0.24)', borderRadius:'26px',
        animation:'trafficCornerSpin 12s linear infinite', animationDelay:'1s' }} />
      <div style={{ position:'absolute', bottom:'8px', right:'8px', width:'130px', height:'130px',
        border:'1px solid rgba(252,211,77,0.2)', borderRadius:'18px',
        animation:'trafficCornerSpin2 16s linear infinite', animationDelay:'0.5s' }} />
      <div style={{ position:'absolute', bottom:'32px', right:'32px', width:'72px', height:'72px',
        border:'1px solid rgba(245,158,11,0.28)', borderRadius:'10px',
        animation:'trafficCornerSpin2 16s linear infinite reverse', animationDelay:'1.5s' }} />

      {/* Diamond ring set — top-left corner */}
      <div style={{ position:'absolute', top:'-50px', left:'-50px', width:'280px', height:'280px',
        border:'1.5px solid rgba(251,191,36,0.28)', borderRadius:'34px',
        boxShadow:'inset 0 0 40px rgba(251,191,36,0.06)',
        animation:'trafficCornerSpin 14s linear infinite reverse' }} />
      <div style={{ position:'absolute', top:'-20px', left:'-20px', width:'190px', height:'190px',
        border:'1px solid rgba(245,158,11,0.22)', borderRadius:'24px',
        animation:'trafficCornerSpin 14s linear infinite reverse', animationDelay:'1.2s' }} />
      <div style={{ position:'absolute', top:'15px', left:'15px', width:'110px', height:'110px',
        border:'1px solid rgba(252,211,77,0.18)', borderRadius:'14px',
        animation:'trafficCornerSpin2 18s linear infinite', animationDelay:'0.8s' }} />
      <div style={{ position:'absolute', top:'38px', left:'38px', width:'60px', height:'60px',
        border:'1px solid rgba(251,191,36,0.24)', borderRadius:'8px',
        animation:'trafficCornerSpin2 18s linear infinite reverse', animationDelay:'2s' }} />

    </div>
  </>
);

// ── CSS for traffic dashboard ────────────────────────────────────────────
const TDASH_CSS = `
  @keyframes tdPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.15)} }
  @keyframes tdSlide { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes tdScanLine {
    0%   { top: 0%; opacity: 0.6; }
    50%  { opacity: 0.15; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes tdCorridorDash {
    0%   { stroke-dashoffset: 400; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes tdMapPing {
    0%   { transform:scale(0.5); opacity:0.9; }
    100% { transform:scale(2.5); opacity:0; }
  }
  .td-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .td-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(245,158,11,0.18); }
  .td-sig-btn { transition: all 0.18s ease; }
  .td-sig-btn:hover { transform: scale(1.06); }
  .td-action-btn { transition: all 0.18s ease; }
  .td-action-btn:hover { transform: scale(1.04); filter: brightness(1.15); }
`;

const SIGNAL_MODES = [
  { id: 'AUTO',      color: '#10b981', icon: '🤖', desc: 'AI-controlled timing' },
  { id: 'MANUAL',    color: '#f59e0b', icon: '🕹️', desc: 'Officer override active' },
  { id: 'CORRIDOR',  color: '#3b82f6', icon: '🛣️', desc: 'Green wave in progress' },
  { id: 'EMERGENCY', color: '#ef4444', icon: '🚨', desc: 'Emergency clearance' },
];

const LIVE_SIGNALS = [
  { id: 'SIG-01', name: 'MG Road Jn.', type: '4-way',    zone: 'Central',  state: 'GREEN',  overridden: true  },
  { id: 'SIG-02', name: 'Kadavanthara', type: 'T-junction', zone: 'East',   state: 'RED',    overridden: false },
  { id: 'SIG-03', name: 'NH-47 Entry', type: '4-way',    zone: 'North',    state: 'GREEN',  overridden: true  },
  { id: 'SIG-04', name: 'Kaloor Circle', type: 'Roundabout', zone: 'West', state: 'YELLOW', overridden: false },
  { id: 'SIG-05', name: 'AIMS Gate',   type: '4-way',    zone: 'South',    state: 'GREEN',  overridden: true  },
  { id: 'SIG-06', name: 'Edappally Jn.',type: '4-way',   zone: 'North',    state: 'RED',    overridden: false },
];

const ACTIVE_CORRIDORS = [
  { id: 'CR-2051', src: 'AIMS Kochi',   dst: 'Govt. Medical',organ: 'Heart',  urgency: 'VERY_CRITICAL', eta: '08:32', progress: 72 },
  { id: 'CR-2050', src: 'Amrita Hosp.', dst: 'KIMS Hospital', organ: 'Liver',  urgency: 'CRITICAL',      eta: '14:15', progress: 31 },
];

const SIGNAL_EVENTS = [
  { time: '12:05 PM', event: 'Green corridor CR-2051 activated — MG Road junction overridden', status: 'warn' },
  { time: '11:48 AM', event: 'Signal SIG-03 cleared — NH-47 Entry set to GREEN for CR-2051',  status: 'success' },
  { time: '10:30 AM', event: 'Signal override complete — NH-47 bypass, CR-2050 completed',     status: 'success' },
  { time: '09:15 AM', event: 'CORRIDOR mode engaged by Ofc. Rajan for CR-2048',                status: 'info' },
  { time: '08:50 AM', event: 'Manual mode engaged — Kadavanthara, routine maintenance',        status: 'info' },
];

const URGENCY_STYLE = {
  VERY_CRITICAL: { bg: 'rgba(239,68,68,0.18)',  border: 'rgba(239,68,68,0.45)',  color: '#ef4444', label: '🔴 VERY CRITICAL' },
  CRITICAL:      { bg: 'rgba(245,158,11,0.18)', border: 'rgba(245,158,11,0.45)', color: '#f59e0b', label: '🟡 CRITICAL' },
  STABLE:        { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)',  color: '#10b981', label: '🟢 STABLE' },
};

const ALL_ACTIVE_CORRIDORS = [
  { id:'CR-2051', src:'AIMS Kochi',       dst:'Govt. Medical',   organ:'Heart',  urgency:'VERY_CRITICAL', eta:'08:32', progress:72, ambulance:'KL-07-AB-1234', driver:'Sanjay K.',  approvedBy:'Ofc. Meera' },
  { id:'CR-2050', src:'Amrita Hosp.',    dst:'KIMS Hospital',   organ:'Liver',  urgency:'CRITICAL',      eta:'14:15', progress:31, ambulance:'KL-09-CD-5678', driver:'Rajan M.',   approvedBy:'Ofc. Rahul' },
  { id:'CR-2049', src:'Lakeshore Hosp.', dst:'AIMS Kochi',      organ:'Kidney', urgency:'CRITICAL',      eta:'22:00', progress:58, ambulance:'KL-05-EF-3344', driver:'Arjun V.',   approvedBy:'Ofc. Meera' },
  { id:'CR-2048', src:'KIMS Hospital',   dst:'PVS Memorial',    organ:'Cornea', urgency:'STABLE',        eta:'35:10', progress:12, ambulance:'KL-11-GH-7890', driver:'Thomas P.',  approvedBy:'Ofc. Raj'   },
  { id:'CR-2047', src:'Lisie Hospital',  dst:'Lakeshore Hosp.', organ:'Lungs',  urgency:'VERY_CRITICAL', eta:'05:45', progress:88, ambulance:'KL-03-IJ-2211', driver:'Praveen S.', approvedBy:'Ofc. Rahul' },
];

const ALL_SIGNAL_EVENTS = [
  { time:'12:05 PM', date:'Feb 25, 2026', event:'Green corridor CR-2051 activated — MG Road junction overridden',     status:'warn',    corridor:'CR-2051' },
  { time:'11:48 AM', date:'Feb 25, 2026', event:'Signal SIG-03 cleared — NH-47 Entry set to GREEN for CR-2051',      status:'success', corridor:'CR-2051' },
  { time:'10:30 AM', date:'Feb 25, 2026', event:'Signal override complete — NH-47 bypass, CR-2050 completed',         status:'success', corridor:'CR-2050' },
  { time:'09:15 AM', date:'Feb 25, 2026', event:'CORRIDOR mode engaged by Ofc. Rajan for CR-2048',                    status:'info',    corridor:'CR-2048' },
  { time:'08:50 AM', date:'Feb 25, 2026', event:'Manual mode engaged — Kadavanthara, routine maintenance',            status:'info',    corridor:null      },
  { time:'08:10 AM', date:'Feb 25, 2026', event:'SIG-05 AIMS Gate overridden GREEN — CR-2047 approach',               status:'warn',    corridor:'CR-2047' },
  { time:'07:45 AM', date:'Feb 25, 2026', event:'Corridor CR-2047 approach — Lisie Hospital to Lakeshore cleared',   status:'success', corridor:'CR-2047' },
  { time:'07:20 AM', date:'Feb 25, 2026', event:'AUTO mode restored — Kaloor Circle SIG-04 post-corridor',            status:'success', corridor:null      },
  { time:'11:55 PM', date:'Feb 24, 2026', event:'Emergency clearance — Edappally Jn. SIG-06 forced RED',             status:'warn',    corridor:'CR-2046' },
  { time:'11:30 PM', date:'Feb 24, 2026', event:'Corridor CR-2046 completed — all signals restored to AUTO',          status:'success', corridor:'CR-2046' },
];

const SIGNAL_STATE_COLOR = { GREEN: '#10b981', RED: '#ef4444', YELLOW: '#f59e0b' };

// ── Sub-components ────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, sub, accent = '#f59e0b' }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="td-card rounded-2xl p-5 flex flex-col gap-1.5 cursor-default"
      style={{
        background: hov ? `rgba(245,158,11,0.12)` : 'rgba(245,158,11,0.07)',
        border: `1px solid ${hov ? 'rgba(245,158,11,0.35)' : 'rgba(245,158,11,0.18)'}`,
        boxShadow: hov ? '0 0 24px rgba(245,158,11,0.12)' : 'none',
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold uppercase tracking-widest text-amber-300/70">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-white font-extrabold text-3xl leading-tight">{value}</div>
      {sub && <div className="text-white/40 text-sm mt-0.5">{sub}</div>}
    </div>
  );
};

const MiniMapTraffic = ({ onOpenMap }) => (
  <div className="td-card rounded-2xl overflow-hidden cursor-pointer" onClick={onOpenMap}
    style={{ background:'rgba(0,0,0,0.5)', border:'1px solid rgba(245,158,11,0.25)', position:'relative' }}>
    <style>{`
      @keyframes tdScanLine { 0%{top:0%;opacity:0.5} 100%{top:100%;opacity:0} }
      @keyframes tdMapPing  { 0%{transform:scale(0.5);opacity:0.9} 100%{transform:scale(2.8);opacity:0} }
      @keyframes tdCorridorDash { 0%{stroke-dashoffset:400} 100%{stroke-dashoffset:0} }
    `}</style>
    {/* Grid */}
    <svg width="100%" height="180" style={{ position:'absolute', inset:0 }}>
      {[0,1,2,3,4,5,6].map(i=>(
        <line key={`h${i}`} x1="0" y1={i*30} x2="100%" y2={i*30} stroke="rgba(245,158,11,0.07)" strokeWidth="1"/>
      ))}
      {[0,1,2,3,4,5,6,7,8,9,10].map(i=>(
        <line key={`v${i}`} x1={`${i*10}%`} y1="0" x2={`${i*10}%`} y2="180" stroke="rgba(245,158,11,0.07)" strokeWidth="1"/>
      ))}
      {/* Road lines */}
      <line x1="0" y1="90" x2="100%" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
      <line x1="50%" y1="0" x2="50%" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
      {/* Active corridor path */}
      <path d="M 60,90 Q 200,60 340,90 Q 420,110 520,90" fill="none"
        stroke="rgba(245,158,11,0.7)" strokeWidth="2.5" strokeDasharray="8 4"
        style={{ animation:'tdCorridorDash 3s linear infinite' }}/>
      {/* Signal markers */}
      {[{x:60,y:90},{x:200,y:90},{x:340,y:90},{x:200,y:50},{x:340,y:130}].map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill={i===0||i===2?'#10b981':'#ef4444'} />
          <circle cx={p.x} cy={p.y} r="10" fill="none"
            stroke={i===0||i===2?'rgba(16,185,129,0.5)':'rgba(239,68,68,0.3)'} strokeWidth="1.5"
            style={{ animation:'tdMapPing 2s ease-out infinite', animationDelay:`${i*0.4}s` }}/>
        </g>
      ))}
      {/* Ambulance icon approx */}
      <circle cx="280" cy="85" r="7" fill="rgba(245,158,11,0.9)" />
      <text x="277" y="90" fontSize="8" fill="white">🚑</text>
    </svg>
    {/* Scan line */}
    <div style={{ position:'absolute', left:0, right:0, height:'2px',
      background:'linear-gradient(90deg,transparent,rgba(245,158,11,0.6),transparent)',
      animation:'tdScanLine 3s linear infinite' }}/>
    {/* Overlay label */}
    <div style={{ position:'relative', height:180, zIndex:2, display:'flex', flexDirection:'column',
      justifyContent:'space-between', padding:'12px 16px' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-amber-300/80 uppercase tracking-widest">Live Corridor View</span>
        <span className="text-xs text-white/40 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block"/>
          LIVE
        </span>
      </div>
      <button
        className="self-end flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
        style={{ background:'rgba(245,158,11,0.25)', border:'1px solid rgba(245,158,11,0.5)', color:'#fbbf24' }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#fbbf24"/>
        </svg>
        Full Map →
      </button>
    </div>
  </div>
);

// ── Main dashboard ───────────────────────────────────────────────────────
const TrafficDashboard = ({ user, onLogout, setCurrentPage }) => {
  const [view, setView]                 = useState('dashboard'); // 'dashboard' | 'corridors' | 'events'
  const [signalMode, setSignalMode]     = useState('CORRIDOR');
  const [signals, setSignals]           = useState(LIVE_SIGNALS);
  const [hovSignal, setHovSignal]       = useState(null);
  const [now, setNow]                   = useState(new Date());

  // live clock
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const clockStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const cycleState = (sigId) => {
    const order = ['RED', 'GREEN', 'YELLOW'];
    setSignals(prev => prev.map(s => {
      if (s.id !== sigId) return s;
      const next = order[(order.indexOf(s.state) + 1) % 3];
      return { ...s, state: next, overridden: true };
    }));
  };

  const currentModeObj = SIGNAL_MODES.find(m => m.id === signalMode);
  const overrideCount  = signals.filter(s => s.overridden).length;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <style>{TDASH_CSS}</style>
      <TrafficAnimatedBackground />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(245,158,11,0.13) 0%, transparent 70%)',
      }} />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4 border-b"
        style={{ borderColor:'rgba(255,255,255,0.07)', background:'rgba(0,0,0,0.65)', backdropFilter:'blur(18px)' }}>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shadow-lg"
            style={{ background:'linear-gradient(135deg,#f59e0b,#78350f)', boxShadow:'0 0 20px rgba(245,158,11,0.4)' }}>🚦</div>
          <div>
            <div className="text-base font-black text-white tracking-tight leading-none">GreenNote</div>
            <div className="text-xs font-semibold tracking-wider" style={{ color:'#f59e0b' }}>TRAFFIC CONTROL</div>
          </div>
        </div>

        {/* Nav tabs */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl" style={{ background:'rgba(255,255,255,0.05)' }}>
          {[['dashboard','🚦 Dashboard'],['corridors','🛣️ Active Corridors'],['events','⚡ Signal Events']].map(([id, lbl]) => (
            <button key={id} onClick={() => setView(id)}
              className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200"
              style={view === id
                ? { background:'rgba(245,158,11,0.22)', color:'#fcd34d', border:'1px solid rgba(245,158,11,0.45)' }
                : { color:'rgba(255,255,255,0.4)', border:'1px solid transparent' }}>
              {lbl}
              {id === 'corridors' && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background:'rgba(239,68,68,0.25)', color:'#ef4444' }}>
                  {ALL_ACTIVE_CORRIDORS.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-amber-300/60 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
            {clockStr}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background:`${currentModeObj.color}22`, border:`1px solid ${currentModeObj.color}55`, color:currentModeObj.color }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background:currentModeObj.color }} />
            {currentModeObj.icon} {signalMode}
          </div>
          <button onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white transition-colors hover:bg-white/10">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* ── ACTIVE CORRIDORS PAGE ── */}
      {view === 'corridors' && (
        <main className="relative z-10 max-w-5xl mx-auto px-8 py-8">
          <div className="mb-7 flex items-center gap-4">
            <button onClick={() => setView('dashboard')}
              className="td-action-btn flex items-center gap-2 px-4 py-2 rounded-xl text-base font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              ← Back
            </button>
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Active Corridors</h2>
              <p className="text-white/40 text-base mt-0.5">{ALL_ACTIVE_CORRIDORS.length} corridors currently in progress</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {ALL_ACTIVE_CORRIDORS.map(c => {
              const ug = URGENCY_STYLE[c.urgency];
              return (
                <div key={c.id} className="td-card rounded-2xl p-6"
                  style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${ug.border}` }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-white/70">{c.id}</span>
                      <span className="text-sm font-bold px-3 py-1 rounded-full"
                        style={{ background:ug.bg, color:ug.color, border:`1px solid ${ug.border}` }}>
                        {c.urgency === 'VERY_CRITICAL' ? '🔴 VERY CRITICAL' : c.urgency === 'CRITICAL' ? '🟡 CRITICAL' : '🟢 STABLE'}
                      </span>
                    </div>
                    <span className="text-sm font-bold" style={{ color:ug.color }}>ETA: {c.eta} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-base text-white/80 mb-4">
                    <span>🏥 {c.src}</span>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" stroke={ug.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>{c.dst}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-black/30 rounded-xl px-4 py-3">
                      <div className="text-sm text-white/35 mb-1">Organ</div>
                      <div className="text-base font-semibold text-white">🫀 {c.organ}</div>
                    </div>
                    <div className="bg-black/30 rounded-xl px-4 py-3">
                      <div className="text-sm text-white/35 mb-1">Ambulance</div>
                      <div className="text-base font-semibold text-white">🚑 {c.ambulance}</div>
                    </div>
                    <div className="bg-black/30 rounded-xl px-4 py-3">
                      <div className="text-sm text-white/35 mb-1">Driver</div>
                      <div className="text-base font-semibold text-white">{c.driver}</div>
                    </div>
                    <div className="bg-black/30 rounded-xl px-4 py-3">
                      <div className="text-sm text-white/35 mb-1">Approved By</div>
                      <div className="text-base font-semibold text-amber-300">{c.approvedBy}</div>
                    </div>
                  </div>
                  <div className="text-sm text-white/35 mb-1.5 flex justify-between">
                    <span>Route progress</span><span>{c.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{ width:`${c.progress}%`, background:`linear-gradient(90deg,${ug.color},${ug.color}88)` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ── SIGNAL EVENTS PAGE ── */}
      {view === 'events' && (
        <main className="relative z-10 max-w-5xl mx-auto px-8 py-8">
          <div className="mb-7 flex items-center gap-4">
            <button onClick={() => setView('dashboard')}
              className="td-action-btn flex items-center gap-2 px-4 py-2 rounded-xl text-base font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              ← Back
            </button>
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Signal Events</h2>
              <p className="text-white/40 text-base mt-0.5">Full signal activity history</p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b text-sm font-bold uppercase tracking-widest text-white/30"
              style={{ borderColor:'rgba(255,255,255,0.06)' }}>
              <span className="col-span-2">Time</span>
              <span className="col-span-8">Event</span>
              <span className="col-span-2">Corridor</span>
            </div>
            {ALL_SIGNAL_EVENTS.map((e, i) => (
              <div key={i} className="td-card grid grid-cols-12 gap-3 px-5 py-5 border-b last:border-0 items-center"
                style={{ borderColor:'rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                <div className="col-span-2">
                  <div className="text-sm font-mono text-white/60">{e.time}</div>
                  <div className="text-sm text-white/25 mt-0.5">{e.date}</div>
                </div>
                <div className="col-span-8 flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: e.status==='success'?'#10b981':e.status==='warn'?'#f59e0b':'#3b82f6' }} />
                  <span className="text-sm text-white/65 leading-relaxed">{e.event}</span>
                </div>
                <div className="col-span-2">
                  {e.corridor
                    ? <span className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background:'rgba(245,158,11,0.15)', color:'#fbbf24', border:'1px solid rgba(245,158,11,0.3)' }}>{e.corridor}</span>
                    : <span className="text-sm text-white/25">—</span>
                  }
                </div>
              </div>
            ))}
          </div>
          <div className="text-sm text-white/25 text-right mt-3">{ALL_SIGNAL_EVENTS.length} entries</div>
        </main>
      )}

      {/* ── DASHBOARD VIEW ── */}
      {view === 'dashboard' && <main className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        {/* Welcome */}
        <div className="mb-7 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight" style={{ animation:'tdSlide 0.5s ease' }}>
              Welcome,{' '}
              <span style={{ background:'linear-gradient(135deg,#f59e0b,#fcd34d)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                {user?.name || 'Officer'}
              </span>{' '}🚦
            </h2>
            <p className="text-white/40 mt-1 text-base">{user?.email} &nbsp;·&nbsp; Traffic Signal Command Centre</p>
          </div>
          {/* Incident count chip */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl text-base font-bold mt-1"
            style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', color:'#ef4444' }}>
            🚨 2 Active Emergencies
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
          <StatCard label="Active Corridors"   value={ACTIVE_CORRIDORS.length}  icon="🛣️"  sub="Live green lanes"       />
          <StatCard label="Signals Overridden" value={overrideCount}            icon="🚦"  sub="Manual control active"  />
          <StatCard label="Corridors Today"    value="6"                        icon="📋"  sub="Completed since 00:00"  />
          <StatCard label="Avg Override Time"  value="3m 45s"                  icon="⚡"  sub="Signal clearance avg"   />
        </div>

        {/* Main 3-column grid */}
        <div className="grid grid-cols-12 gap-5">

          {/* Left col — Active Corridors + Events */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-5">

            {/* Active Corridors */}
            <div className="rounded-2xl p-5" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Active Corridors</h3>
                <button onClick={() => setView('corridors')}
                  className="td-action-btn text-sm font-bold px-3 py-1 rounded-lg"
                  style={{ background:'rgba(245,158,11,0.18)', color:'#fcd34d', border:'1px solid rgba(245,158,11,0.38)' }}>
                  View All →
                </button>
              </div>
              {ACTIVE_CORRIDORS.map(c => {
                const ug = URGENCY_STYLE[c.urgency];
                return (
                  <div key={c.id} className="td-card mb-3 last:mb-0 rounded-xl p-4"
                    style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${ug.border}` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white/60">{c.id}</span>
                      <span className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background:ug.bg, color:ug.color, border:`1px solid ${ug.border}` }}>
                        {c.urgency === 'VERY_CRITICAL' ? '🔴 CRIT' : '🟡 CRIT'}
                      </span>
                    </div>
                    <div className="text-sm text-white/70 mb-1">🏥 {c.src}</div>
                    <div className="text-sm text-white/70 mb-2">→ {c.dst}</div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-amber-300/70">🫀 {c.organ}</span>
                      <span className="text-sm text-white/40">ETA: {c.eta}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width:`${c.progress}%`, background:`linear-gradient(90deg,${ug.color},${ug.color}88)` }} />
                    </div>
                    <div className="text-sm text-white/30 mt-1">{c.progress}% complete</div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Center col — Signal Grid */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-5">
            <div className="rounded-2xl p-5" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Signal Status Grid</h3>
                <span className="text-sm text-white/30">{signals.filter(s=>s.state==='GREEN').length} / {signals.length} GREEN</span>
              </div>
              <div className="flex flex-col gap-2">
                {signals.map(sig => (
                  <div key={sig.id}
                    className="td-card flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer"
                    style={{
                      background: hovSignal === sig.id ? `${SIGNAL_STATE_COLOR[sig.state]}12` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${SIGNAL_STATE_COLOR[sig.state]}35`,
                    }}
                    onMouseEnter={() => setHovSignal(sig.id)}
                    onMouseLeave={() => setHovSignal(null)}>
                    {/* State dot */}
                    <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                      {['RED','YELLOW','GREEN'].map(st => (
                        <div key={st} className="w-3.5 h-3.5 rounded-full border border-black/30"
                          style={{
                            background: sig.state === st ? SIGNAL_STATE_COLOR[st] : `${SIGNAL_STATE_COLOR[st]}22`,
                            boxShadow: sig.state === st ? `0 0 8px ${SIGNAL_STATE_COLOR[st]}` : 'none',
                            animation: sig.state === st ? 'tdPulse 1.8s ease-in-out infinite' : 'none',
                          }} />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-semibold text-white truncate">{sig.name}</div>
                      <div className="text-sm text-white/35">{sig.type} · {sig.zone} · {sig.id}</div>
                    </div>
                    {sig.overridden && (
                      <span className="text-sm font-bold px-2.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ background:'rgba(245,158,11,0.2)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.4)' }}>
                        OVERRIDE
                      </span>
                    )}
                    <button onClick={() => cycleState(sig.id)}
                      className="td-action-btn flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-bold"
                      style={{ background:`${SIGNAL_STATE_COLOR[sig.state]}22`, color:SIGNAL_STATE_COLOR[sig.state], border:`1px solid ${SIGNAL_STATE_COLOR[sig.state]}50` }}>
                      CYCLE
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right col — Mini Map + Signal Mode */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">

            {/* Mini Map */}
            <MiniMapTraffic onOpenMap={() => setCurrentPage('map')} />

            {/* Signal Mode selector */}
            <div className="rounded-2xl p-5" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Signal Mode</h3>
              <div className="flex flex-col gap-2">
                {SIGNAL_MODES.map(m => (
                  <button key={m.id} onClick={() => setSignalMode(m.id)}
                    className="td-sig-btn py-3 px-4 rounded-xl text-base font-bold flex items-center gap-3 text-left"
                    style={{
                      background: signalMode === m.id ? `${m.color}28` : 'rgba(255,255,255,0.04)',
                      border: signalMode === m.id ? `1px solid ${m.color}70` : '1px solid rgba(255,255,255,0.07)',
                      color: signalMode === m.id ? m.color : 'rgba(255,255,255,0.45)',
                      boxShadow: signalMode === m.id ? `0 0 14px ${m.color}25` : 'none',
                    }}>
                    <span className="text-xl">{m.icon}</span>
                    <div>
                      <div>{m.id}</div>
                      <div className="text-sm font-normal opacity-60 mt-0.5">{m.desc}</div>
                    </div>
                    {signalMode === m.id && (
                      <span className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background:m.color }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>}
    </div>
  );
};

export default TrafficDashboard;
