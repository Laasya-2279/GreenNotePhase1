import React, { useState } from 'react';

// ── Animated background ────────────────────────────────────────────────────
const CTRL_BG_CSS = `
  @keyframes ctrlRingExpand {
    0%   { transform: translate(-50%,-50%) scale(0.5); opacity: 0.7; }
    100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; }
  }
  @keyframes ctrlCornerSpin {
    0%   { transform: rotate(45deg) scale(1);     opacity: 0.2; }
    50%  { transform: rotate(225deg) scale(1.12); opacity: 0.38; }
    100% { transform: rotate(405deg) scale(1);    opacity: 0.2; }
  }
  @keyframes ctrlCornerSpin2 {
    0%   { transform: rotate(45deg) scale(1);     opacity: 0.15; }
    50%  { transform: rotate(225deg) scale(1.08); opacity: 0.28; }
    100% { transform: rotate(405deg) scale(1);    opacity: 0.15; }
  }
`;

const CtrlAnimatedBackground = () => (
  <>
    <style>{CTRL_BG_CSS}</style>
    <div style={{ position:'fixed', inset:0, zIndex:0, overflow:'hidden', pointerEvents:'none' }}>

      {/* Deep background */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, #0a0612 0%, #030712 50%, #080420 100%)' }} />

      {/* Circle ring cluster — bottom-left */}
      <div style={{ position:'absolute', bottom:'12%', left:'5%' }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{
            position:'absolute', top:'50%', left:'50%', width:360, height:360, borderRadius:'50%',
            border: i % 2 === 0 ? '1.5px solid rgba(139,92,246,0.32)' : '1px solid rgba(167,139,250,0.22)',
            animation:'ctrlRingExpand 7s ease-out infinite', animationDelay:`${i * 1.16}s`,
          }} />
        ))}
      </div>

      {/* Circle ring cluster — top-right */}
      <div style={{ position:'absolute', top:'15%', right:'8%' }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            position:'absolute', top:'50%', left:'50%', width:280, height:280, borderRadius:'50%',
            border: i % 2 === 0 ? '1.5px solid rgba(196,181,253,0.28)' : '1px solid rgba(139,92,246,0.2)',
            animation:'ctrlRingExpand 9s ease-out infinite', animationDelay:`${i * 1.8}s`,
          }} />
        ))}
      </div>

      {/* Circle ring cluster — center-left */}
      <div style={{ position:'absolute', top:'48%', left:'18%' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            position:'absolute', top:'50%', left:'50%', width:200, height:200, borderRadius:'50%',
            border:'1px solid rgba(167,139,250,0.18)',
            animation:'ctrlRingExpand 11s ease-out infinite', animationDelay:`${i * 2.75}s`,
          }} />
        ))}
      </div>

      {/* Diamond ring set — bottom-right corner */}
      <div style={{ position:'absolute', bottom:'-50px', right:'-50px', width:'300px', height:'300px',
        border:'1.5px solid rgba(139,92,246,0.32)', borderRadius:'36px',
        boxShadow:'inset 0 0 50px rgba(139,92,246,0.07), 0 0 35px rgba(139,92,246,0.1)',
        animation:'ctrlCornerSpin 12s linear infinite' }} />
      <div style={{ position:'absolute', bottom:'-25px', right:'-25px', width:'210px', height:'210px',
        border:'1px solid rgba(167,139,250,0.24)', borderRadius:'26px',
        animation:'ctrlCornerSpin 12s linear infinite', animationDelay:'1s' }} />
      <div style={{ position:'absolute', bottom:'8px', right:'8px', width:'130px', height:'130px',
        border:'1px solid rgba(196,181,253,0.2)', borderRadius:'18px',
        animation:'ctrlCornerSpin2 16s linear infinite', animationDelay:'0.5s' }} />
      <div style={{ position:'absolute', bottom:'32px', right:'32px', width:'72px', height:'72px',
        border:'1px solid rgba(139,92,246,0.28)', borderRadius:'10px',
        animation:'ctrlCornerSpin2 16s linear infinite reverse', animationDelay:'1.5s' }} />

      {/* Diamond ring set — top-left corner */}
      <div style={{ position:'absolute', top:'-50px', left:'-50px', width:'280px', height:'280px',
        border:'1.5px solid rgba(167,139,250,0.28)', borderRadius:'34px',
        boxShadow:'inset 0 0 40px rgba(167,139,250,0.06)',
        animation:'ctrlCornerSpin 14s linear infinite reverse' }} />
      <div style={{ position:'absolute', top:'-20px', left:'-20px', width:'190px', height:'190px',
        border:'1px solid rgba(139,92,246,0.22)', borderRadius:'24px',
        animation:'ctrlCornerSpin 14s linear infinite reverse', animationDelay:'1.2s' }} />
      <div style={{ position:'absolute', top:'15px', left:'15px', width:'110px', height:'110px',
        border:'1px solid rgba(196,181,253,0.18)', borderRadius:'14px',
        animation:'ctrlCornerSpin2 18s linear infinite', animationDelay:'0.8s' }} />
      <div style={{ position:'absolute', top:'38px', left:'38px', width:'60px', height:'60px',
        border:'1px solid rgba(167,139,250,0.24)', borderRadius:'8px',
        animation:'ctrlCornerSpin2 18s linear infinite reverse', animationDelay:'2s' }} />

    </div>
  </>
);

// ── CSS for control room dashboard ───────────────────────────────────────
const CRDASH_CSS = `
  @keyframes crSlide  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes crPulse  { 0%,100%{opacity:1} 50%{opacity:0.55} }
  @keyframes crScanLine { 0%{top:0%;opacity:0.45} 100%{top:100%;opacity:0} }
  @keyframes crCorridorDash { 0%{stroke-dashoffset:500} 100%{stroke-dashoffset:0} }
  @keyframes crMapPing { 0%{transform:scale(0.5);opacity:0.9} 100%{transform:scale(2.5);opacity:0} }
  .cr-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .cr-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(139,92,246,0.18); }
  .cr-btn  { transition: all 0.18s ease; }
  .cr-btn:hover  { transform: scale(1.05); filter: brightness(1.15); }
`;

const SYS_STATES = [
  { id:'OPERATIONAL', color:'#10b981', icon:'✅', desc:'All services nominal' },
  { id:'MAINTENANCE',  color:'#f59e0b', icon:'🔧', desc:'Scheduled downtime' },
  { id:'DEGRADED',    color:'#ef4444', icon:'⚠️',  desc:'Partial outage detected' },
  { id:'OFFLINE',     color:'#6b7280', icon:'🔴', desc:'Full system down' },
];

const PENDING_REQUESTS = [
  { id:'CR-2052', src:'Lakeshore Hosp.',  dst:'AIMS Kochi',      organ:'Kidney',  urgency:'CRITICAL',      requestedBy:'Dr. Nair',   timeAgo:'3 min ago'  },
  { id:'CR-2053', src:'Amrita Hospital',  dst:'Govt. Medical',   organ:'Liver',   urgency:'VERY_CRITICAL', requestedBy:'Dr. Priya',  timeAgo:'7 min ago'  },
  { id:'CR-2054', src:'KIMS Hospital',    dst:'PVS Memorial',    organ:'Cornea',  urgency:'STABLE',        requestedBy:'Dr. Arun',   timeAgo:'14 min ago' },
];

const ACTIVE_CORRIDORS_CR = [
  { id:'CR-2051', src:'AIMS Kochi',   dst:'Govt. Medical',  organ:'Heart',  urgency:'VERY_CRITICAL', ambulance:'KL-07-AB-1234', driver:'Sanjay K.', eta:'08:32', progress:72, approvedBy:'Ofc. Meera' },
  { id:'CR-2050', src:'Amrita Hosp.', dst:'KIMS Hospital',  organ:'Liver',  urgency:'CRITICAL',      ambulance:'KL-09-CD-5678', driver:'Rajan M.',  eta:'14:15', progress:31, approvedBy:'Ofc. Rahul' },
];

const AUDIT_LOGS = [
  { time:'12:30 PM', action:'CORRIDOR_APPROVED',  actor:'Ofc. Meera', detail:'CR-2051 — AIMS → Govt. Medical (Heart)', status:'success' },
  { time:'11:55 AM', action:'CORRIDOR_REQUESTED', actor:'Dr. Priya',   detail:'CR-2052 — Liver transport queued',        status:'info' },
  { time:'10:10 AM', action:'CORRIDOR_COMPLETED', actor:'System',      detail:'CR-2049 — 22 min duration',               status:'success' },
  { time:'09:45 AM', action:'SIGNAL_CLEARED',     actor:'Ofc. Rahul',  detail:'SIG-03 at MG Road Jn.',                   status:'info' },
  { time:'09:00 AM', action:'SYSTEM_HEALTHCHECK', actor:'System',      detail:'All 4 services online',                   status:'success' },
];

const URGENCY_STYLE = {
  VERY_CRITICAL: { bg:'rgba(239,68,68,0.18)',  border:'rgba(239,68,68,0.45)',  color:'#ef4444', label:'🔴 VERY CRITICAL' },
  CRITICAL:      { bg:'rgba(245,158,11,0.18)', border:'rgba(245,158,11,0.45)', color:'#f59e0b', label:'🟡 CRITICAL' },
  STABLE:        { bg:'rgba(16,185,129,0.15)', border:'rgba(16,185,129,0.4)',  color:'#10b981', label:'🟢 STABLE' },
};

const ORGAN_ICON = { Heart:'🫀', Kidney:'🫘', Liver:'🟤', Lungs:'🫁', Cornea:'👁️', Pancreas:'🟣', Tissue:'🩹', Intestine:'🌿' };

// ── Sub-components ────────────────────────────────────────────────────────
const CRStatCard = ({ label, value, icon, sub, pulse = false }) => {
  const [hov, setHov] = useState(false);
  return (
    <div className="cr-card rounded-2xl p-5 flex flex-col gap-1.5 cursor-default"
      style={{
        background: hov ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.07)',
        border: `1px solid ${hov ? 'rgba(139,92,246,0.38)' : 'rgba(139,92,246,0.18)'}`,
        boxShadow: hov ? '0 0 24px rgba(139,92,246,0.14)' : 'none',
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-violet-300/70">{label}</span>
        <span className="text-xl" style={pulse ? { animation:'crPulse 1.6s ease infinite' } : {}}>{icon}</span>
      </div>
      <div className="text-white font-extrabold text-2xl leading-tight">{value}</div>
      {sub && <div className="text-white/40 text-xs mt-0.5">{sub}</div>}
    </div>
  );
};

const MiniMapCtrl = ({ onOpenMap }) => (
  <div className="cr-card rounded-2xl overflow-hidden cursor-pointer" onClick={onOpenMap}
    style={{ background:'rgba(0,0,0,0.5)', border:'1px solid rgba(139,92,246,0.28)', position:'relative' }}>
    <svg width="100%" height="170" style={{ position:'absolute', inset:0 }}>
      {[0,1,2,3,4,5].map(i=>(
        <line key={`h${i}`} x1="0" y1={i*34} x2="100%" y2={i*34} stroke="rgba(139,92,246,0.07)" strokeWidth="1"/>
      ))}
      {[0,1,2,3,4,5,6,7,8,9,10].map(i=>(
        <line key={`v${i}`} x1={`${i*10}%`} y1="0" x2={`${i*10}%`} y2="170" stroke="rgba(139,92,246,0.07)" strokeWidth="1"/>
      ))}
      <line x1="0" y1="85" x2="100%" y2="85" stroke="rgba(255,255,255,0.09)" strokeWidth="2"/>
      <line x1="50%" y1="0" x2="50%" y2="170" stroke="rgba(255,255,255,0.09)" strokeWidth="2"/>
      {/* Corridor 1 */}
      <path d="M 40,85 Q 180,55 360,85 Q 430,100 520,85" fill="none"
        stroke="rgba(239,68,68,0.7)" strokeWidth="2.5" strokeDasharray="8 4"
        style={{ animation:'crCorridorDash 3.5s linear infinite' }}/>
      {/* Corridor 2 */}
      <path d="M 80,120 Q 220,95 380,120" fill="none"
        stroke="rgba(245,158,11,0.5)" strokeWidth="2" strokeDasharray="6 4"
        style={{ animation:'crCorridorDash 4.5s linear infinite' }}/>
      {/* Hospital nodes */}
      {[{x:40,y:85,c:'#8b5cf6'},{x:360,y:85,c:'#10b981'},{x:80,y:120,c:'#8b5cf6'},{x:380,y:120,c:'#10b981'}].map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill={p.c} />
          <circle cx={p.x} cy={p.y} r="11" fill="none" stroke={p.c} strokeWidth="1.5" strokeOpacity="0.5"
            style={{ animation:'crMapPing 2.2s ease-out infinite', animationDelay:`${i*0.5}s` }}/>
        </g>
      ))}
      {/* Ambulances */}
      <circle cx="240" cy="78" r="7" fill="rgba(239,68,68,0.9)"/>
      <text x="237" y="83" fontSize="8" fill="white">🚑</text>
      <circle cx="200" cy="116" r="7" fill="rgba(245,158,11,0.9)"/>
      <text x="197" y="121" fontSize="8" fill="white">🚑</text>
    </svg>
    <div style={{ position:'absolute', left:0, right:0, height:'2px', top:0,
      background:'linear-gradient(90deg,transparent,rgba(139,92,246,0.6),transparent)',
      animation:'crScanLine 3.2s linear infinite' }}/>
    <div style={{ position:'relative', height:170, zIndex:2, display:'flex', flexDirection:'column',
      justifyContent:'space-between', padding:'12px 16px' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-violet-300/80 uppercase tracking-widest">Live Corridor Map</span>
        <span className="text-xs text-white/40 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block"/>
          LIVE
        </span>
      </div>
      <button className="self-end flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
        style={{ background:'rgba(139,92,246,0.25)', border:'1px solid rgba(139,92,246,0.5)', color:'#c4b5fd' }}>
        🗺️ Full Map →
      </button>
    </div>
  </div>
);

// ── Extended pending/audit data ─────────────────────────────────────────
const ALL_PENDING = [
  { id:'CR-2052', src:'Lakeshore Hosp.',   dst:'AIMS Kochi',       organ:'Kidney', urgency:'CRITICAL',      requestedBy:'Dr. Nair',    timeAgo:'3 min ago',  notes:'Chronic renal failure, urgent transplant.',    vehicleReady: true  },
  { id:'CR-2053', src:'Amrita Hospital',   dst:'Govt. Medical',    organ:'Liver',  urgency:'VERY_CRITICAL', requestedBy:'Dr. Priya',   timeAgo:'7 min ago',  notes:'Acute liver failure — window: 4 hrs.',          vehicleReady: true  },
  { id:'CR-2054', src:'KIMS Hospital',     dst:'PVS Memorial',     organ:'Cornea', urgency:'STABLE',        requestedBy:'Dr. Arun',    timeAgo:'14 min ago', notes:'Bilateral corneal transplant, stable patient.',  vehicleReady: false },
  { id:'CR-2055', src:'Lisie Hospital',    dst:'Lakeshore Hosp.',  organ:'Heart',  urgency:'VERY_CRITICAL', requestedBy:'Dr. Benny',   timeAgo:'21 min ago', notes:'Donor match confirmed — critical window: 6 hrs.',vehicleReady: true  },
  { id:'CR-2056', src:'Govt. Medical',     dst:'AIMS Kochi',       organ:'Lungs',  urgency:'CRITICAL',      requestedBy:'Dr. Sheela',  timeAgo:'35 min ago', notes:'COPD end-stage. Bilateral lung transplant.',    vehicleReady: true  },
];

const ALL_AUDIT = [
  { time:'12:30 PM', date:'Feb 24, 2026', action:'CORRIDOR_APPROVED',   actor:'Ofc. Meera',   role:'Control Room', detail:'CR-2051 — AIMS → Govt. Medical (Heart)',         status:'success', corridorId:'CR-2051' },
  { time:'11:55 AM', date:'Feb 24, 2026', action:'CORRIDOR_REQUESTED',  actor:'Dr. Priya',    role:'Hospital',     detail:'CR-2052 — Liver transport queued',               status:'info',    corridorId:'CR-2052' },
  { time:'10:10 AM', date:'Feb 24, 2026', action:'CORRIDOR_COMPLETED',  actor:'System',       role:'Auto',         detail:'CR-2049 — 22 min actual duration',               status:'success', corridorId:'CR-2049' },
  { time:'09:45 AM', date:'Feb 24, 2026', action:'SIGNAL_CLEARED',      actor:'Ofc. Rahul',   role:'Traffic',      detail:'SIG-03 at MG Road Jn. — GREEN for CR-2050',      status:'info',    corridorId:'CR-2050' },
  { time:'09:00 AM', date:'Feb 24, 2026', action:'SYSTEM_HEALTHCHECK',  actor:'System',       role:'Auto',         detail:'All 4 services online — WebSocket, GPS, Signal, ML', status:'success', corridorId:null  },
  { time:'08:30 AM', date:'Feb 24, 2026', action:'CORRIDOR_REJECTED',   actor:'Ofc. Meera',   role:'Control Room', detail:'CR-2048 — Rejected: Ambulance unavailable',      status:'warn',    corridorId:'CR-2048' },
  { time:'07:55 AM', date:'Feb 24, 2026', action:'CORRIDOR_APPROVED',   actor:'Ofc. Raj',     role:'Control Room', detail:'CR-2047 — KIMS → Amrita (Kidney)',               status:'success', corridorId:'CR-2047' },
  { time:'07:30 AM', date:'Feb 24, 2026', action:'SIGNAL_RESTORED',     actor:'System',       role:'Auto',         detail:'SIG-01 restored after CR-2047 completion',       status:'info',    corridorId:'CR-2047' },
  { time:'06:10 AM', date:'Feb 24, 2026', action:'CORRIDORS_CLEANUP',   actor:'System',       role:'Auto',         detail:'1 stale corridor auto-completed (24h cutoff)',   status:'success', corridorId:null  },
  { time:'11:45 PM', date:'Feb 23, 2026', action:'CORRIDOR_COMPLETED',  actor:'System',       role:'Auto',         detail:'CR-2046 — 34 min duration, all signals restored', status:'success', corridorId:'CR-2046' },
];

const ACTION_COLOR = {
  CORRIDOR_APPROVED:  '#10b981',
  CORRIDOR_COMPLETED: '#10b981',
  SYSTEM_HEALTHCHECK: '#3b82f6',
  CORRIDORS_CLEANUP:  '#3b82f6',
  SIGNAL_RESTORED:    '#3b82f6',
  SIGNAL_CLEARED:     '#3b82f6',
  CORRIDOR_REQUESTED: '#8b5cf6',
  CORRIDOR_REJECTED:  '#ef4444',
};

// ── Main dashboard ───────────────────────────────────────────────────────
const ControlRoomDashboard = ({ user, onLogout, setCurrentPage }) => {
  const [view, setView]                   = useState('dashboard'); // 'dashboard' | 'requests' | 'auditlog'
  const [sysStatus, setSysStatus]         = useState('OPERATIONAL');
  const [pendingList, setPendingList]     = useState(ALL_PENDING);
  const [rejecting, setRejecting]         = useState(null);
  const [auditFilter, setAuditFilter]     = useState('ALL');
  const [now, setNow]                     = useState(new Date());

  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const clockStr = now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' });

  const handleApprove = (id) => setPendingList(p => p.filter(r => r.id !== id));
  const handleReject  = (id) => { setRejecting(id); setTimeout(() => { setPendingList(p => p.filter(r => r.id !== id)); setRejecting(null); }, 800); };

  const sysObj = SYS_STATES.find(s => s.id === sysStatus);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <style>{CRDASH_CSS}</style>
      <CtrlAnimatedBackground />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(139,92,246,0.13) 0%, transparent 70%)',
      }} />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4 border-b"
        style={{ borderColor:'rgba(255,255,255,0.07)', background:'rgba(0,0,0,0.65)', backdropFilter:'blur(18px)' }}>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shadow-lg"
            style={{ background:'linear-gradient(135deg,#8b5cf6,#3b0764)', boxShadow:'0 0 20px rgba(139,92,246,0.4)' }}>🖥️</div>
          <div>
            <div className="text-base font-black text-white tracking-tight leading-none">GreenNote</div>
            <div className="text-xs font-semibold tracking-wider" style={{ color:'#8b5cf6' }}>CONTROL ROOM</div>
          </div>
        </div>

        {/* Nav tabs */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl" style={{ background:'rgba(255,255,255,0.05)' }}>
          {[['dashboard','🖥️ Dashboard'],['requests','📥 View Requests'],['auditlog','📋 View Audit Log']].map(([id, lbl]) => (
            <button key={id} onClick={() => setView(id)}
              className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200"
              style={view === id
                ? { background:'rgba(139,92,246,0.22)', color:'#c4b5fd', border:'1px solid rgba(139,92,246,0.38)' }
                : { color:'rgba(255,255,255,0.4)', border:'1px solid transparent' }}>
              {lbl}
              {id === 'requests' && pendingList.length > 0 && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background:'rgba(245,158,11,0.25)', color:'#f59e0b' }}>
                  {pendingList.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-violet-300/60 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
            {clockStr}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background:`${sysObj.color}22`, border:`1px solid ${sysObj.color}55`, color:sysObj.color }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background:sysObj.color }} />
            {sysObj.icon} {sysStatus}
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

      {/* ── REQUESTS PAGE ── */}
      {view === 'requests' && (
        <main className="relative z-10 max-w-5xl mx-auto px-8 py-8">
          <div className="mb-7 flex items-center gap-4">
            <button onClick={() => setView('dashboard')}
              className="cr-btn flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              ← Back
            </button>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Pending Requests</h2>
              <p className="text-white/40 text-sm mt-0.5">{pendingList.length} awaiting approval</p>
            </div>
          </div>

          {pendingList.length === 0 ? (
            <div className="rounded-2xl p-16 text-center" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-4xl mb-3">✅</div>
              <div className="text-white/50 text-lg font-semibold">All requests have been processed</div>
              <div className="text-white/30 text-sm mt-1">Check back when new corridor requests arrive</div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {pendingList.map(req => {
                const ug = URGENCY_STYLE[req.urgency];
                const isRej = rejecting === req.id;
                return (
                  <div key={req.id} className="cr-card rounded-2xl p-6"
                    style={{ background: isRej ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)', border:`1px solid ${isRej ? 'rgba(239,68,68,0.35)' : ug.border}`, transition:'all 0.3s ease', opacity: isRej ? 0.5 : 1 }}>
                    <div className="flex items-start justify-between gap-4">
                      {/* Left info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-sm font-bold text-white/60">{req.id}</span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                            style={{ background:ug.bg, color:ug.color, border:`1px solid ${ug.border}` }}>
                            {req.urgency === 'VERY_CRITICAL' ? '🔴' : req.urgency === 'CRITICAL' ? '🟡' : '🟢'} {req.urgency.replace('_',' ')}
                          </span>
                          {req.vehicleReady
                            ? <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background:'rgba(16,185,129,0.15)', color:'#10b981', border:'1px solid rgba(16,185,129,0.35)' }}>🚑 Vehicle Ready</span>
                            : <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background:'rgba(239,68,68,0.12)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.3)' }}>⚠️ No Vehicle</span>
                          }
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div className="bg-black/30 rounded-xl px-4 py-3">
                            <div className="text-xs text-white/35 mb-1">Organ</div>
                            <div className="text-sm font-bold text-white">{ORGAN_ICON[req.organ] || '🏥'} {req.organ}</div>
                          </div>
                          <div className="bg-black/30 rounded-xl px-4 py-3">
                            <div className="text-xs text-white/35 mb-1">From</div>
                            <div className="text-sm font-semibold text-white truncate">🏥 {req.src}</div>
                          </div>
                          <div className="bg-black/30 rounded-xl px-4 py-3">
                            <div className="text-xs text-white/35 mb-1">To</div>
                            <div className="text-sm font-semibold text-white truncate">📍 {req.dst}</div>
                          </div>
                          <div className="bg-black/30 rounded-xl px-4 py-3">
                            <div className="text-xs text-white/35 mb-1">Requested By</div>
                            <div className="text-sm font-semibold text-violet-300">{req.requestedBy}</div>
                            <div className="text-xs text-white/30">{req.timeAgo}</div>
                          </div>
                        </div>
                        <div className="text-xs text-white/45 bg-black/20 rounded-lg px-4 py-2.5 border-l-2" style={{ borderColor:ug.color }}>
                          📝 {req.notes}
                        </div>
                      </div>
                      {/* Action buttons */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button onClick={() => handleApprove(req.id)}
                          className="cr-btn px-5 py-2.5 rounded-xl text-sm font-bold"
                          style={{ background:'rgba(16,185,129,0.2)', color:'#10b981', border:'1px solid rgba(16,185,129,0.45)' }}>
                          ✅ Approve
                        </button>
                        <button onClick={() => handleReject(req.id)}
                          className="cr-btn px-5 py-2.5 rounded-xl text-sm font-bold"
                          style={{ background:'rgba(239,68,68,0.14)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.38)' }}>
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* ── AUDIT LOG PAGE ── */}
      {view === 'auditlog' && (() => {
        const actionTypes = ['ALL', ...Array.from(new Set(ALL_AUDIT.map(l => l.action)))];
        const filtered = auditFilter === 'ALL' ? ALL_AUDIT : ALL_AUDIT.filter(l => l.action === auditFilter);
        return (
          <main className="relative z-10 max-w-5xl mx-auto px-8 py-8">
            <div className="mb-7 flex items-center gap-4">
              <button onClick={() => setView('dashboard')}
                className="cr-btn flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                ← Back
              </button>
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Audit Log</h2>
                <p className="text-white/40 text-sm mt-0.5">Full system activity history</p>
              </div>
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap gap-2 mb-6">
              {actionTypes.map(a => (
                <button key={a} onClick={() => setAuditFilter(a)}
                  className="cr-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={auditFilter === a
                    ? { background:'rgba(139,92,246,0.25)', color:'#c4b5fd', border:'1px solid rgba(139,92,246,0.5)' }
                    : { background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  {a === 'ALL' ? '🔍 ALL' : a.replace(/_/g,' ')}
                </button>
              ))}
            </div>

            {/* Log table */}
            <div className="rounded-2xl overflow-hidden" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
              {/* Header row */}
              <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b text-xs font-bold uppercase tracking-widest text-white/30"
                style={{ borderColor:'rgba(255,255,255,0.06)' }}>
                <span className="col-span-2">Time</span>
                <span className="col-span-3">Action</span>
                <span className="col-span-4">Detail</span>
                <span className="col-span-2">Actor</span>
                <span className="col-span-1">Role</span>
              </div>
              {filtered.map((l, i) => {
                const ac = ACTION_COLOR[l.action] || '#8b5cf6';
                return (
                  <div key={i}
                    className="cr-card grid grid-cols-12 gap-3 px-5 py-4 border-b last:border-0 items-center"
                    style={{ borderColor:'rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <div className="col-span-2">
                      <div className="text-xs font-mono text-white/60">{l.time}</div>
                      <div className="text-xs text-white/25 mt-0.5">{l.date}</div>
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:ac }} />
                      <span className="text-xs font-bold" style={{ color:ac }}>{l.action.replace(/_/g,' ')}</span>
                    </div>
                    <div className="col-span-4">
                      <span className="text-xs text-white/55 leading-relaxed">{l.detail}</span>
                      {l.corridorId && (
                        <span className="ml-2 text-xs text-violet-400/70">· {l.corridorId}</span>
                      )}
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs font-semibold text-white/70">{l.actor}</span>
                    </div>
                    <div className="col-span-1">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background:'rgba(139,92,246,0.15)', color:'#c4b5fd', border:'1px solid rgba(139,92,246,0.25)' }}>
                        {l.role}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-white/25 text-right mt-3">{filtered.length} entries</div>
          </main>
        );
      })()}

      {/* ── DASHBOARD VIEW ── */}
      {view === 'dashboard' && (
      <main className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        {/* Welcome */}
        <div className="mb-7 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight" style={{ animation:'crSlide 0.5s ease' }}>
              Welcome,{' '}
              <span style={{ background:'linear-gradient(135deg,#8b5cf6,#c4b5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                {user?.name || 'Operator'}
              </span>{' '}🖥️
            </h2>
            <p className="text-white/40 mt-1 text-sm">{user?.email} &nbsp;·&nbsp; Central Operations — Full System View</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold mt-1"
            style={{ background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.35)', color:'#f59e0b' }}>
            📥 {pendingList.length} Pending Approval{pendingList.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
          <CRStatCard label="Pending Approvals"  value={pendingList.length}           icon="📥" sub="Awaiting your action"    pulse={pendingList.length > 0} />
          <CRStatCard label="Active Corridors"   value={ACTIVE_CORRIDORS_CR.length}   icon="🛣️" sub="In progress now"         />
          <CRStatCard label="Ambulances Online"  value="12"                           icon="🚑" sub="GPS connected"           />
          <CRStatCard label="System Uptime"      value="99.8%"                        icon="📡" sub="Last 30 days"            />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-12 gap-5 items-stretch">

          {/* Left — Pending approval queue */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 h-full">
            <div className="rounded-2xl p-5 flex flex-col flex-1" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Approval Queue</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background:'rgba(245,158,11,0.2)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.4)' }}>
                    {pendingList.length} PENDING
                  </span>
                  <button onClick={() => setView('requests')}
                    className="cr-btn text-xs font-bold px-2.5 py-0.5 rounded-lg"
                    style={{ background:'rgba(139,92,246,0.18)', color:'#c4b5fd', border:'1px solid rgba(139,92,246,0.38)' }}>
                    View All →
                  </button>
                </div>
              </div>

              {pendingList.length === 0 ? (
                <div className="text-center py-8 text-white/30 text-sm">
                  ✅ All requests processed
                </div>
              ) : (
                <div className="flex flex-col gap-3 overflow-y-auto" style={{ maxHeight:'calc(100vh - 320px)' }}>
                  {pendingList.map(req => {
                    const ug = URGENCY_STYLE[req.urgency];
                    const isRej = rejecting === req.id;
                    return (
                      <div key={req.id}
                        className="cr-card rounded-xl p-4"
                        style={{
                          background: isRej ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${isRej ? 'rgba(239,68,68,0.4)' : ug.border}`,
                          transition: 'all 0.3s ease',
                          opacity: isRej ? 0.6 : 1,
                        }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-white/60">{req.id}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background:ug.bg, color:ug.color, border:`1px solid ${ug.border}` }}>
                            {req.urgency === 'VERY_CRITICAL' ? '🔴' : req.urgency === 'CRITICAL' ? '🟡' : '🟢'} {req.urgency.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-xs text-white/80 font-semibold mb-1">
                          {ORGAN_ICON[req.organ] || '🏥'} {req.organ} Transport
                        </div>
                        <div className="text-xs text-white/50 mb-0.5">🏥 {req.src}</div>
                        <div className="text-xs text-white/50 mb-2">→ {req.dst}</div>
                        <div className="text-xs text-violet-300/50 mb-3">By {req.requestedBy} · {req.timeAgo}</div>
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(req.id)}
                            className="cr-btn flex-1 py-1.5 rounded-lg text-xs font-bold"
                            style={{ background:'rgba(16,185,129,0.2)', color:'#10b981', border:'1px solid rgba(16,185,129,0.45)' }}>
                            ✅ Approve
                          </button>
                          <button onClick={() => handleReject(req.id)}
                            className="cr-btn flex-1 py-1.5 rounded-lg text-xs font-bold"
                            style={{ background:'rgba(239,68,68,0.15)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.4)' }}>
                            ❌ Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Center — Active Corridors detail */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-5 h-full">
            <div className="rounded-2xl p-5" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Active Corridors</h3>
                <span className="text-xs text-white/30">{ACTIVE_CORRIDORS_CR.length} IN PROGRESS</span>
              </div>
              <div className="flex flex-col gap-4">
                {ACTIVE_CORRIDORS_CR.map(c => {
                  const ug = URGENCY_STYLE[c.urgency];
                  return (
                    <div key={c.id} className="cr-card rounded-xl p-5"
                      style={{ background:'rgba(255,255,255,0.05)', border:`1px solid ${ug.border}` }}>
                      {/* Top row */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-white">{c.id}</span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                          style={{ background:ug.bg, color:ug.color, border:`1px solid ${ug.border}` }}>
                          {c.urgency === 'VERY_CRITICAL' ? '🔴 VERY CRITICAL' : '🟡 CRITICAL'}
                        </span>
                      </div>
                      {/* Route */}
                      <div className="flex items-center gap-2 text-sm text-white/80 mb-3">
                        <span>🏥 {c.src}</span>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" stroke={ug.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span>{c.dst}</span>
                      </div>
                      {/* Details grid */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-black/30 rounded-lg px-3 py-2">
                          <div className="text-xs text-white/35 mb-0.5">Organ</div>
                          <div className="text-sm font-semibold text-white">{ORGAN_ICON[c.organ]} {c.organ}</div>
                        </div>
                        <div className="bg-black/30 rounded-lg px-3 py-2">
                          <div className="text-xs text-white/35 mb-0.5">ETA Remaining</div>
                          <div className="text-sm font-bold" style={{ color:ug.color }}>{c.eta} min</div>
                        </div>
                        <div className="bg-black/30 rounded-lg px-3 py-2">
                          <div className="text-xs text-white/35 mb-0.5">Ambulance</div>
                          <div className="text-sm font-semibold text-white">🚑 {c.ambulance}</div>
                        </div>
                        <div className="bg-black/30 rounded-lg px-3 py-2">
                          <div className="text-xs text-white/35 mb-0.5">Driver</div>
                          <div className="text-sm font-semibold text-white">{c.driver}</div>
                        </div>
                      </div>
                      {/* Progress */}
                      <div className="text-xs text-white/35 mb-1.5 flex justify-between">
                        <span>Route progress</span><span>{c.progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                          style={{ width:`${c.progress}%`, background:`linear-gradient(90deg,${ug.color},${ug.color}99)` }}>
                          <div className="absolute inset-0" style={{
                            background:'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.3) 50%,transparent 100%)',
                            animation:'cr-shimmer 2s linear infinite',
                          }}/>
                        </div>
                      </div>
                      <div className="text-xs text-white/30 mt-2">Approved by {c.approvedBy}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audit log */}
            <div className="rounded-2xl p-5 flex flex-col flex-1" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Audit Log</h3>
                <button onClick={() => setView('auditlog')}
                  className="cr-btn text-xs font-bold px-2.5 py-0.5 rounded-lg"
                  style={{ background:'rgba(139,92,246,0.18)', color:'#c4b5fd', border:'1px solid rgba(139,92,246,0.38)' }}>
                  View All →
                </button>
              </div>
              <div className="flex flex-col gap-2.5">
                {AUDIT_LOGS.map((l, i) => (
                  <div key={i} className="flex items-start gap-3 py-1.5 border-b border-white/5 last:border-0">
                    <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: l.status==='success'?'#10b981':'#3b82f6' }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-violet-300/80">{l.action.replace(/_/g,' ')}</div>
                      <div className="text-xs text-white/50 truncate">{l.detail}</div>
                      <div className="text-xs text-white/25 mt-0.5">{l.actor} · {l.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right col — Mini Map + Quick Stats */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-5 h-full">
            <MiniMapCtrl onOpenMap={() => setCurrentPage('map')} />

            {/* Organ urgency breakdown */}
            <div className="rounded-2xl p-5" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Request Breakdown</h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { label:'Very Critical', count:1, color:'#ef4444' },
                  { label:'Critical',      count:2, color:'#f59e0b' },
                  { label:'Stable',        count:1, color:'#10b981' },
                ].map(row => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:row.color }} />
                    <span className="text-xs text-white/55 flex-1">{row.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width:`${row.count === 2 ? 66 : row.count === 1 ? 33 : 100}%`, background:row.color, opacity:0.7 }} />
                    </div>
                    <span className="text-xs font-bold text-white/60 w-4 text-right">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WebSocket status panel */}
            <div className="rounded-2xl p-5" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Live Services</h3>
              <div className="flex flex-col gap-3">
                {[
                  { name:'WebSocket',    status:'Connected',   color:'#10b981' },
                  { name:'GPS Feed',     status:'Streaming',   color:'#10b981' },
                  { name:'Signal API',   status:'Operational', color:'#10b981' },
                  { name:'ML Predictor', status:'Idle',        color:'#f59e0b' },
                ].map(svc => (
                  <div key={svc.name} className="flex items-center justify-between">
                    <span className="text-xs text-white/55">{svc.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background:svc.color, animation:'crPulse 2s ease infinite' }} />
                      <span className="text-xs font-medium" style={{ color:svc.color }}>{svc.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status Selector */}
            <div className="rounded-2xl p-5 flex flex-col flex-1" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">System Status</h3>
              <div className="flex flex-col gap-2">
                {SYS_STATES.map(s => (
                  <button key={s.id} onClick={() => setSysStatus(s.id)}
                    className="cr-btn py-2.5 px-4 rounded-xl text-sm font-bold flex items-center gap-3 text-left"
                    style={{
                      background: sysStatus === s.id ? `${s.color}28` : 'rgba(255,255,255,0.04)',
                      border: sysStatus === s.id ? `1px solid ${s.color}70` : '1px solid rgba(255,255,255,0.07)',
                      color: sysStatus === s.id ? s.color : 'rgba(255,255,255,0.45)',
                      boxShadow: sysStatus === s.id ? `0 0 14px ${s.color}22` : 'none',
                    }}>
                    <span>{s.icon}</span>
                    <div>
                      <div>{s.id}</div>
                      <div className="text-xs font-normal opacity-60 mt-0.5">{s.desc}</div>
                    </div>
                    {sysStatus === s.id && (
                      <span className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background:s.color }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
      )}
    </div>
  );
};

export default ControlRoomDashboard;
