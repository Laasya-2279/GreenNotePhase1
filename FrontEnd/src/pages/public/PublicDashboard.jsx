import React, { useState, useEffect, useRef } from 'react';

// ── Animated background (blue hue) ───────────────────────────────────────
const PUBLIC_BG_CSS = `
  @keyframes pubRingExpand {
    0%   { transform: translate(-50%,-50%) scale(0.5); opacity: 0.7; }
    100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; }
  }
  @keyframes pubCornerSpin {
    0%   { transform: rotate(45deg) scale(1);     opacity: 0.2; }
    50%  { transform: rotate(225deg) scale(1.12); opacity: 0.38; }
    100% { transform: rotate(405deg) scale(1);    opacity: 0.2; }
  }
  @keyframes pubCornerSpin2 {
    0%   { transform: rotate(45deg) scale(1);     opacity: 0.15; }
    50%  { transform: rotate(225deg) scale(1.08); opacity: 0.28; }
    100% { transform: rotate(405deg) scale(1);    opacity: 0.15; }
  }
`;

const PublicAnimatedBackground = () => (
  <>
    <style>{PUBLIC_BG_CSS}</style>
    <div style={{ position:'fixed', inset:0, zIndex:0, overflow:'hidden', pointerEvents:'none' }}>

      {/* Deep background */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, #02071a 0%, #030a1e 50%, #020510 100%)' }} />

      {/* Circle ring cluster — bottom-left */}
      <div style={{ position:'absolute', bottom:'12%', left:'5%' }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{
            position:'absolute', top:'50%', left:'50%', width:360, height:360, borderRadius:'50%',
            border: i % 2 === 0 ? '1.5px solid rgba(59,130,246,0.32)' : '1px solid rgba(96,165,250,0.22)',
            animation:'pubRingExpand 7s ease-out infinite', animationDelay:`${i * 1.16}s`,
          }} />
        ))}
      </div>

      {/* Circle ring cluster — top-right */}
      <div style={{ position:'absolute', top:'15%', right:'8%' }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            position:'absolute', top:'50%', left:'50%', width:280, height:280, borderRadius:'50%',
            border: i % 2 === 0 ? '1.5px solid rgba(147,197,253,0.28)' : '1px solid rgba(59,130,246,0.2)',
            animation:'pubRingExpand 9s ease-out infinite', animationDelay:`${i * 1.8}s`,
          }} />
        ))}
      </div>

      {/* Circle ring cluster — center-left */}
      <div style={{ position:'absolute', top:'48%', left:'18%' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            position:'absolute', top:'50%', left:'50%', width:200, height:200, borderRadius:'50%',
            border:'1px solid rgba(96,165,250,0.18)',
            animation:'pubRingExpand 11s ease-out infinite', animationDelay:`${i * 2.75}s`,
          }} />
        ))}
      </div>

      {/* Diamond ring set — bottom-right corner */}
      <div style={{ position:'absolute', bottom:'-50px', right:'-50px', width:'300px', height:'300px',
        border:'1.5px solid rgba(59,130,246,0.32)', borderRadius:'36px',
        boxShadow:'inset 0 0 50px rgba(59,130,246,0.07), 0 0 35px rgba(59,130,246,0.1)',
        animation:'pubCornerSpin 12s linear infinite' }} />
      <div style={{ position:'absolute', bottom:'-25px', right:'-25px', width:'210px', height:'210px',
        border:'1px solid rgba(96,165,250,0.24)', borderRadius:'26px',
        animation:'pubCornerSpin 12s linear infinite', animationDelay:'1s' }} />
      <div style={{ position:'absolute', bottom:'8px', right:'8px', width:'130px', height:'130px',
        border:'1px solid rgba(147,197,253,0.2)', borderRadius:'18px',
        animation:'pubCornerSpin2 16s linear infinite', animationDelay:'0.5s' }} />
      <div style={{ position:'absolute', bottom:'32px', right:'32px', width:'72px', height:'72px',
        border:'1px solid rgba(59,130,246,0.28)', borderRadius:'10px',
        animation:'pubCornerSpin2 16s linear infinite reverse', animationDelay:'1.5s' }} />

      {/* Diamond ring set — top-left corner */}
      <div style={{ position:'absolute', top:'-50px', left:'-50px', width:'280px', height:'280px',
        border:'1.5px solid rgba(96,165,250,0.28)', borderRadius:'34px',
        boxShadow:'inset 0 0 40px rgba(96,165,250,0.06)',
        animation:'pubCornerSpin 14s linear infinite reverse' }} />
      <div style={{ position:'absolute', top:'-20px', left:'-20px', width:'190px', height:'190px',
        border:'1px solid rgba(59,130,246,0.22)', borderRadius:'24px',
        animation:'pubCornerSpin 14s linear infinite reverse', animationDelay:'1.2s' }} />
      <div style={{ position:'absolute', top:'15px', left:'15px', width:'110px', height:'110px',
        border:'1px solid rgba(147,197,253,0.18)', borderRadius:'14px',
        animation:'pubCornerSpin2 18s linear infinite', animationDelay:'0.8s' }} />
      <div style={{ position:'absolute', top:'38px', left:'38px', width:'60px', height:'60px',
        border:'1px solid rgba(96,165,250,0.24)', borderRadius:'8px',
        animation:'pubCornerSpin2 18s linear infinite reverse', animationDelay:'2s' }} />

    </div>
  </>
);

// ── Mini Map Preview (Public – blue hue) ────────────────────────────────
const PUB_MINI_MAP_CSS = `
  @keyframes pubDashMove { to { stroke-dashoffset: -24; } }
  @keyframes pubPingOrb  { 0%,100%{transform:scale(1);opacity:0.9} 50%{transform:scale(1.5);opacity:0.4} }
  @keyframes pubScanLine { 0%{top:0%} 100%{top:100%} }
`;

const SEV_COLOR  = { HIGH: '#ef4444', MODERATE: '#f59e0b', LOW: '#10b981' };
const SEV_BG     = { HIGH: 'rgba(239,68,68,0.1)', MODERATE: 'rgba(245,158,11,0.1)', LOW: 'rgba(16,185,129,0.1)' };
const SEV_BORDER = { HIGH: 'rgba(239,68,68,0.3)', MODERATE: 'rgba(245,158,11,0.3)', LOW: 'rgba(16,185,129,0.3)' };

const MOCK_ROAD_CORRIDORS = [
  { id: 'COR-201', route: 'Bypass Road',  from: 'Junction A',  to: 'Airport',     status: 'ACTIVE',    eta: '12 min', severity: 'HIGH' },
  { id: 'COR-202', route: 'Seaport Link', from: 'Harbor Gate', to: 'City Center', status: 'ACTIVE',    eta: '8 min',  severity: 'MODERATE' },
  { id: 'COR-203', route: 'Highway NH7',  from: 'Gate 3',      to: 'Medical Hub', status: 'COMPLETED', eta: '—',      severity: 'LOW' },
];

const PublicMiniMapPreview = ({ setCurrentPage, corridors }) => {
  const active = corridors.filter(c => c.status !== 'COMPLETED');
  return (
    <>
      <style>{PUB_MINI_MAP_CSS}</style>
      <div
        onClick={() => setCurrentPage && setCurrentPage('map')}
        className="hidden lg:flex flex-col cursor-pointer group"
      >
        {/* Map canvas */}
        <div className="relative rounded-2xl overflow-hidden mb-3"
          style={{ height: 240, background: '#020b1a', border: '1px solid rgba(59,130,246,0.25)' }}>

          {/* Grid lines */}
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.12 }}>
            {[0,1,2,3,4,5,6].map(i => (
              <line key={`h${i}`} x1="0" y1={`${i*16.66}%`} x2="100%" y2={`${i*16.66}%`} stroke="#3b82f6" strokeWidth="0.5"/>
            ))}
            {[0,1,2,3,4,5,6,7,8].map(i => (
              <line key={`v${i}`} x1={`${i*12.5}%`} y1="0" x2={`${i*12.5}%`} y2="100%" stroke="#3b82f6" strokeWidth="0.5"/>
            ))}
          </svg>

          {/* Road shapes */}
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.18 }}>
            <line x1="10%" y1="20%" x2="90%" y2="20%" stroke="#4b5563" strokeWidth="6"/>
            <line x1="30%" y1="0%" x2="30%" y2="100%" stroke="#4b5563" strokeWidth="4"/>
            <line x1="65%" y1="0%" x2="65%" y2="100%" stroke="#4b5563" strokeWidth="4"/>
            <line x1="10%" y1="65%" x2="90%" y2="65%" stroke="#4b5563" strokeWidth="6"/>
          </svg>

          {/* Active corridor route (animated dash) */}
          {active.length > 0 && (
            <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
              <polyline
                points={`${15},${190} ${80},${120} ${160},${75} ${240},${60} ${310},${80}`}
                fill="none" stroke={SEV_COLOR[active[0]?.severity] || '#3b82f6'}
                strokeWidth="2.5" strokeDasharray="8 4" opacity="0.85"
                style={{ animation:'pubDashMove 1.2s linear infinite' }}
              />
              {[{x:15,y:190,label:'SRC'},{x:310,y:80,label:'DST'}].map(({x,y,label}) => (
                <g key={label}>
                  <circle cx={x} cy={y} r="8" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="1.5"/>
                  <text x={x} y={y+4} textAnchor="middle" fontSize="7" fill="#93c5fd" fontWeight="bold">{label}</text>
                </g>
              ))}
              {/* Vehicle dot */}
              <circle cx="160" cy="75" r="7" fill={SEV_COLOR[active[0]?.severity] || '#3b82f6'}
                style={{ animation:'pubPingOrb 1.4s ease-in-out infinite' }} />
              <text x="160" y="79" textAnchor="middle" fontSize="9">🚗</text>
            </svg>
          )}

          {/* Scan line */}
          <div style={{ position:'absolute', left:0, right:0, height:'2px',
            background:'linear-gradient(90deg,transparent,rgba(59,130,246,0.5),transparent)',
            animation:'pubScanLine 4s linear infinite', pointerEvents:'none' }} />

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background:'rgba(0,0,0,0.55)', backdropFilter:'blur(3px)' }}>
            <div className="flex flex-col items-center gap-2">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#3b82f6"/>
              </svg>
              <span className="text-white font-bold text-sm">Open Full Map</span>
              <span className="text-white/40 text-xs">Live tracking</span>
            </div>
          </div>

          {/* LIVE badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background:'rgba(0,0,0,0.75)', border:'1px solid rgba(59,130,246,0.35)', backdropFilter:'blur(8px)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-400 text-xs font-bold">LIVE</span>
          </div>

          {/* Active count */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background:'rgba(0,0,0,0.75)', color:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.1)' }}>
            {active.length} active corridor{active.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Corridor route cards */}
        <div className="flex flex-col gap-2">
          {active.slice(0,2).map(c => {
            const sc = SEV_COLOR[c.severity] || '#3b82f6';
            return (
              <div key={c.id} className="rounded-xl px-4 py-3 flex items-center gap-3 group-hover:border-white/15 transition-all"
                style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: sc }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-base">🛣️</span>
                    <span className="text-sm font-bold text-white truncate">{c.from} → {c.to}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-white/30">{c.id}</span>
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background:`${sc}20`, color: sc }}>{c.severity}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-base font-black text-white">{c.eta}</div>
                  <div className="text-xs text-white/30">ETA</div>
                </div>
              </div>
            );
          })}

          {/* View full map CTA */}
          <div className="mt-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-200 group-hover:scale-[1.02]"
            style={{ background:'linear-gradient(135deg,rgba(59,130,246,0.15),rgba(96,165,250,0.1))', border:'1px solid rgba(59,130,246,0.25)' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#3b82f6"/>
            </svg>
            <span style={{ color:'#60a5fa' }}>View Full Live Map</span>
          </div>
        </div>
      </div>
    </>
  );
};

// ── Interactive content CSS ────────────────────────────────────────
const CONTENT_CSS = `
  @keyframes shimmerSlide {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
  }
  @keyframes threatPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
    50%       { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
  }
  @keyframes moderatePulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.5); }
    50%       { box-shadow: 0 0 0 10px rgba(245,158,11,0); }
  }
  @keyframes cardEntrance {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes glowBreathe {
    0%, 100% { opacity: 0.6; }
    50%       { opacity: 1; }
  }
  @keyframes tickerScroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .corridor-card { animation: cardEntrance 0.45s ease both; }
  .corridor-card:nth-child(1) { animation-delay: 0.05s; }
  .corridor-card:nth-child(2) { animation-delay: 0.15s; }
  .guideline-card { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
  .guideline-card:hover { transform: translateY(-3px); }
`;

// ── Data ──────────────────────────────────────────────────────────────────
const ACTIVE_CORRIDORS = [
  {
    id: 'COR-201',
    road: 'Bypass Road',
    stretch: 'Junction A → Airport Gate 2',
    avoidUntil: '1:45 PM',
    reason: 'Organ transport in transit',
    severity: 'HIGH',
    alternate: 'Take NH-48 via Outer Ring Road',
  },
  {
    id: 'COR-202',
    road: 'Seaport Link Road',
    stretch: 'Harbor Gate → City Center Cross',
    avoidUntil: '1:10 PM',
    reason: 'Critical patient transfer',
    severity: 'MODERATE',
    alternate: 'Divert via Marine Drive or Bay Road',
  },
];

const GUIDELINES = [
  { icon: '🚫', title: 'Do Not Enter Restricted Stretch', desc: 'Stay out of the marked corridor segment for the full duration. Unauthorised entry may obstruct emergency transit.' },
  { icon: '↪️', title: 'Follow Diversion Signs', desc: 'Obey signboards and traffic personnel directing alternate routes. Do not rely solely on your GPS during an active corridor.' },
  { icon: '🔕', title: 'No Honking Near Corridor', desc: 'Silence your horn in and around the corridor zone. Noise can distract emergency crew and delay response.' },
  { icon: '🚑', title: 'Yield Immediately to Emergency Vehicles', desc: 'If an ambulance or escort vehicle approaches, pull to the left and come to a complete stop instantly.' },
  { icon: '📱', title: 'Stay Alert for Clearance Notifications', desc: 'You will be notified here the moment the corridor is cleared. Refresh before re-entering the route.' },
  { icon: '🤝', title: 'Inform Fellow Drivers', desc: 'If you spot confused drivers ahead, alert them about the diversion. Your awareness helps save lives.' },
];

const QUOTES = [
  { text: 'Every second you yield on the road could be the second that saves a life.', author: 'GreenNote' },
  { text: 'A small detour from you means a direct path to survival for someone else.', author: 'GreenNote' },
  { text: 'Civic responsibility is not inconvenience — it is the highest form of humanity.', author: 'GreenNote' },
  { text: 'The road you avoid today might be the road that brings someone home alive.', author: 'GreenNote' },
  { text: 'Traffic discipline is not just law — it is compassion in motion.', author: 'GreenNote' },
  { text: 'You are not stuck in traffic. You are traffic. Choose to be the solution.', author: 'GreenNote' },
];

// ── Components ────────────────────────────────────────────────────────────
const CorridorAvoidCard = ({ corridor, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const sc  = SEV_COLOR[corridor.severity];
  const bg  = SEV_BG[corridor.severity];
  const br  = SEV_BORDER[corridor.severity];
  const isHigh = corridor.severity === 'HIGH';

  return (
    <div
      className="corridor-card rounded-2xl flex flex-col gap-0 relative overflow-hidden cursor-default"
      style={{
        animationDelay: `${index * 0.1}s`,
        background: hovered
          ? `linear-gradient(135deg, ${sc}18 0%, ${sc}08 100%)`
          : bg,
        border: `1.5px solid ${hovered ? sc : br}`,
        boxShadow: hovered
          ? `0 8px 40px ${sc}30, 0 0 0 1px ${sc}40`
          : `0 2px 12px rgba(0,0,0,0.3)`,
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <style>{CONTENT_CSS}</style>

      {/* Shimmer on hover */}
      {hovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl" style={{ zIndex: 1 }}>
          <div style={{
            position: 'absolute', top: 0, bottom: 0, width: '40%',
            background: `linear-gradient(90deg, transparent, ${sc}18, transparent)`,
            animation: 'shimmerSlide 1.2s ease infinite',
          }} />
        </div>
      )}

      {/* Top severity stripe */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${sc}, ${sc}60, transparent)`, borderRadius: '16px 16px 0 0' }} />

      <div className="p-6 flex flex-col gap-4" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Icon with pulse ring */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{
                  background: `linear-gradient(135deg, ${sc}30, ${sc}10)`,
                  border: `1.5px solid ${sc}55`,
                  boxShadow: isHigh ? `0 0 0 0 ${sc}80` : undefined,
                  animation: isHigh ? 'threatPulse 2s ease infinite' : corridor.severity === 'MODERATE' ? 'moderatePulse 2.5s ease infinite' : undefined,
                }}>
                🚧
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-extrabold text-xl leading-tight">{corridor.road}</span>
                <span className="text-xs font-black px-2.5 py-1 rounded-full tracking-wider"
                  style={{ background: `${sc}25`, color: sc, border: `1px solid ${sc}55`, letterSpacing: '0.08em' }}>
                  ⚠ {corridor.severity}
                </span>
              </div>
              <p className="text-white/45 text-sm mt-1">{corridor.stretch}</p>
            </div>
          </div>

          {/* Avoid Until */}
          <div className="flex-shrink-0 text-right">
            <div className="text-xs text-white/30 mb-1 uppercase tracking-wider font-bold">Avoid Until</div>
            <div className="text-3xl font-black tabular-nums" style={{ color: sc, textShadow: `0 0 20px ${sc}60` }}>
              {corridor.avoidUntil}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: `linear-gradient(90deg, ${sc}30, transparent)` }} />

        {/* Reason + Alternate side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl px-3.5 py-3 flex flex-col gap-1"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-sm">🏥</span>
              <span className="text-xs text-white/35 font-bold uppercase tracking-wider">Reason</span>
            </div>
            <span className="text-sm text-white/80 font-semibold leading-snug">{corridor.reason}</span>
          </div>

          <div className="rounded-xl px-3.5 py-3 flex flex-col gap-1"
            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-sm">🗺️</span>
              <span className="text-xs text-blue-300/50 font-bold uppercase tracking-wider">Alternate</span>
            </div>
            <span className="text-sm text-blue-200/90 font-semibold leading-snug">{corridor.alternate}</span>
          </div>
        </div>

        {/* Active status bar */}
        <div className="flex items-center justify-between rounded-xl px-4 py-2.5"
          style={{ background: `${sc}12`, border: `1px solid ${sc}30` }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: sc }} />
            <span className="text-xs font-black tracking-widest" style={{ color: sc }}>CORRIDOR ACTIVE</span>
          </div>
          <span className="text-xs text-white/30 font-mono">{corridor.id}</span>
        </div>
      </div>
    </div>
  );
};

const PublicDashboard = ({ user, onLogout, setCurrentPage }) => {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const guidelinesRef = useRef(null);
  const topRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 320);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const scrollToGuidelines = () => {
    guidelinesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Rotate quote every 8 seconds
  useEffect(() => {
    const t = setInterval(() => setQuoteIdx(i => (i + 1) % QUOTES.length), 8000);
    return () => clearInterval(t);
  }, []);

  const activeCount = ACTIVE_CORRIDORS.length;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div ref={topRef} />
      <PublicAnimatedBackground />
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(59,130,246,0.13) 0%, transparent 70%)' }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center gap-4">
          <div className="rounded-full flex items-center justify-center text-2xl font-bold shadow-lg"
            style={{ width:52, height:52, background: 'linear-gradient(135deg, #3b82f6, #1e3a8a)', flexShrink:0 }}>
            🚗
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white leading-none">GreenNote</h1>
            <p className="text-sm text-blue-300/60 font-medium">Public Driver Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Active corridors badge */}
          {activeCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}>
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              {activeCount} ACTIVE CORRIDOR{activeCount !== 1 ? 'S' : ''} NEARBY
            </div>
          )}

          {/* Logout */}
          <button onClick={onLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-semibold text-white/70 hover:text-white transition-all hover:bg-white/10">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-10 py-12">
        <div className="flex gap-8 items-start">

          {/* ── Left / Center column ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-8">

            {/* Welcome */}
            <div className="rounded-2xl px-8 py-7 relative overflow-hidden"
              style={{
                background: 'linear-gradient(120deg, rgba(59,130,246,0.1) 0%, rgba(30,58,138,0.12) 60%, rgba(0,0,0,0) 100%)',
                border: '1px solid rgba(59,130,246,0.18)',
              }}>
              {/* Glow blob behind name */}
              <div className="absolute top-0 left-0 w-72 h-24 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%)', filter: 'blur(20px)' }} />

              <h2 className="text-5xl font-extrabold text-white tracking-tight relative z-10">
                Hello,{' '}
                <span style={{ background: 'linear-gradient(135deg,#3b82f6,#93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {user?.name || 'Driver'}
                </span>{' '}
                🚗
              </h2>
              <p className="text-white/40 mt-2 text-base relative z-10">
                {user?.email} &nbsp;·&nbsp; Check active corridors before you head out
              </p>

              {/* Live status strip */}
              {activeCount > 0 && (
                <div className="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl relative z-10"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
                  <span className="text-sm font-bold text-red-300">{activeCount} green corridor{activeCount > 1 ? 's are' : ' is'} active near your area.</span>
                  <span className="text-white/30 text-sm">— Avoid affected routes and follow diversions.</span>
                </div>
              )}
            </div>

            {/* ── Routes to Avoid ── */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-7 rounded-full" style={{ background: 'linear-gradient(#ef4444,#f59e0b)' }} />
                <h3 className="text-xl font-extrabold text-white tracking-tight">Routes to Avoid Right Now</h3>
                {activeCount > 0 && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                    {activeCount} Active
                  </span>
                )}
                {/* Guidelines scroll button — right side of header */}
                <button
                  onClick={scrollToGuidelines}
                  className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(96,165,250,0.1))',
                    border: '1.5px solid rgba(59,130,246,0.35)',
                    color: '#93c5fd',
                    boxShadow: '0 4px 16px rgba(59,130,246,0.1)',
                  }}
                >
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12h6M9 16h4" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  View Guidelines
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" className="animate-bounce">
                    <path d="M12 5v14M5 12l7 7 7-7" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {activeCount === 0 ? (
                <div className="rounded-2xl p-10 flex flex-col items-center gap-3 text-center"
                  style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <span className="text-5xl">✅</span>
                  <p className="text-emerald-400 font-bold text-lg">All Clear!</p>
                  <p className="text-white/40 text-sm">No active green corridors near your area at this time.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {ACTIVE_CORRIDORS.map((c, i) => <CorridorAvoidCard key={c.id} corridor={c} index={i} />)}
                </div>
              )}
            </div>

            {/* ── Guidelines ── */}
            <div ref={guidelinesRef}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-7 rounded-full" style={{ background: 'linear-gradient(#3b82f6,#93c5fd)' }} />
                <h3 className="text-xl font-extrabold text-white tracking-tight">What You Must Do During an Active Corridor</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GUIDELINES.map((g, i) => (
                  <div key={i} className="guideline-card rounded-2xl p-5 flex gap-4 items-start"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(59,130,246,0.07)';
                      e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(59,130,246,0.12)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Number + icon stack */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-1">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                        style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
                        {g.icon}
                      </div>
                      <span className="text-xs font-black tabular-nums" style={{ color: 'rgba(59,130,246,0.4)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-base mb-1.5">{g.title}</p>
                      <p className="text-white/45 text-sm leading-relaxed">{g.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>{/* end left column */}

          {/* ── Right column: Mini Map + Civic Quote ── */}
          <div className="hidden lg:flex flex-col gap-4" style={{ width: 370, flexShrink: 0, position: 'sticky', top: 32, height: 'fit-content' }}>
            <PublicMiniMapPreview setCurrentPage={setCurrentPage} corridors={MOCK_ROAD_CORRIDORS} />

            {/* Civic Quote */}
            <div className="rounded-2xl px-7 py-8 flex flex-col gap-4 relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(59,130,246,0.16) 0%, rgba(96,165,250,0.08) 60%, rgba(147,197,253,0.05) 100%)',
                border: '1.5px solid rgba(59,130,246,0.35)',
                boxShadow: '0 0 40px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}>

              {/* Large decorative quote mark */}
              <span className="absolute -top-2 right-4 text-9xl font-serif leading-none select-none pointer-events-none"
                style={{ color: 'rgba(59,130,246,0.18)' }}>"</span>

              {/* Glow blob */}
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', transform: 'translate(-40%, 40%)' }} />

              {/* Header */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.35)' }}>
                  💡
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#60a5fa' }}>Civic Thought</span>
                  <p className="text-white/30 text-xs leading-none mt-0.5">of the moment</p>
                </div>
              </div>

              {/* Quote */}
              <p className="text-white text-base font-semibold leading-relaxed italic relative z-10"
                style={{ textShadow: '0 1px 8px rgba(59,130,246,0.2)' }}>
                "{QUOTES[quoteIdx].text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 rounded-full" style={{ background: 'rgba(59,130,246,0.25)' }} />
                <p className="text-blue-300/60 text-xs font-bold tracking-wide">— {QUOTES[quoteIdx].author}</p>
              </div>

              {/* Dot indicators */}
              <div className="flex gap-1.5">
                {QUOTES.map((_, i) => (
                  <button key={i} onClick={() => setQuoteIdx(i)}
                    className="rounded-full transition-all duration-300"
                    style={{ width: i === quoteIdx ? 22 : 6, height: 6,
                      background: i === quoteIdx ? '#3b82f6' : 'rgba(255,255,255,0.15)',
                      boxShadow: i === quoteIdx ? '0 0 8px rgba(59,130,246,0.6)' : 'none' }} />
                ))}
              </div>
            </div>
          </div>{/* end right column */}

        </div>{/* end flex gap-8 */}
      </main>

      {/* Scroll-to-top button */}
      <button
        onClick={scrollToTop}
        aria-label="Return to top"
        onMouseEnter={e => {
          e.currentTarget.style.transform = showTop ? 'translateY(-3px) scale(1.1)' : 'translateY(18px) scale(0.85)';
          e.currentTarget.style.boxShadow = '0 0 38px rgba(59,130,246,0.9), 0 0 70px rgba(59,130,246,0.35), 0 8px 28px rgba(0,0,0,0.6)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = showTop ? 'translateY(0) scale(1)' : 'translateY(18px) scale(0.85)';
          e.currentTarget.style.boxShadow = '0 0 28px rgba(59,130,246,0.65), 0 0 50px rgba(59,130,246,0.2), 0 6px 20px rgba(0,0,0,0.55)';
        }}
        style={{
          position: 'fixed', bottom: 40, right: 40, zIndex: 9999,
          width: 62, height: 62, borderRadius: '50%',
          background: 'linear-gradient(145deg, #60a5fa 0%, #3b82f6 40%, #1d4ed8 100%)',
          border: '2.5px solid rgba(147,197,253,0.7)',
          outline: '4px solid rgba(59,130,246,0.2)',
          boxShadow: '0 0 28px rgba(59,130,246,0.65), 0 0 50px rgba(59,130,246,0.2), 0 6px 20px rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          opacity: showTop ? 1 : 0,
          transform: showTop ? 'translateY(0) scale(1)' : 'translateY(18px) scale(0.85)',
          pointerEvents: showTop ? 'auto' : 'none',
          transition: 'opacity 0.35s ease, transform 0.35s ease, box-shadow 0.25s ease',
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  );
};

export default PublicDashboard;
