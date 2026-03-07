import React, { useState, useEffect, useRef } from 'react';
import { Icon, HospitalIcon, AmbulanceIcon, CheckCircleIcon } from '../../components/Icons';

// ── Constants ──────────────────────────────────────────────────────────────
const HOSPITALS = [
  'City General Hospital', 'AIMS Medical Centre', 'Aster Medcity',
  'Amrita Institute', 'Lisie Hospital', 'Medical Trust Hospital',
];
const ORGANS = [
  { name: 'Heart',     icon: 'heart',     viability: '4h'  },
  { name: 'Kidney',    icon: 'kidney',    viability: '36h' },
  { name: 'Liver',     icon: 'liver',     viability: '24h' },
  { name: 'Lungs',     icon: 'lungs',     viability: '6h'  },
  { name: 'Pancreas',  icon: 'pancreas',  viability: '12h' },
  { name: 'Intestine', icon: 'testtube',  viability: '8h'  },
  { name: 'Cornea',    icon: 'eye',       viability: '14d' },
  { name: 'Tissue',    icon: 'testtube',  viability: '5y'  },
];
const AMBULANCES = [
  { id: 'AMB-001', driver: 'Rajan Kumar',  vehicle: 'KL-07-AB-1234', available: true  },
  { id: 'AMB-002', driver: 'Suresh Nair',  vehicle: 'KL-07-CD-5678', available: true  },
  { id: 'AMB-003', driver: 'Anil Thomas',  vehicle: 'KL-07-EF-9012', available: false },
];
const URGENCY = [
  { value: 'STABLE',        label: 'Stable',       icon: 'dot', dotColor: '#10b981', color: '#10b981', glow: 'rgba(16,185,129,0.4)'  },
  { value: 'CRITICAL',      label: 'Critical',     icon: 'dot', dotColor: '#f59e0b', color: '#f59e0b', glow: 'rgba(245,158,11,0.4)'  },
  { value: 'VERY_CRITICAL', label: 'Very Critical',icon: 'dot', dotColor: '#ef4444', color: '#ef4444', glow: 'rgba(239,68,68,0.4)'   },
];
const EMPTY_FORM = {
  sourceHospital: '', destinationHospital: '', organType: '',
  urgencyLevel: 'CRITICAL',
  doctorName: '', doctorPhone: '', doctorSpecialization: '', notes: '',
};
const MOCK_CORRIDORS = [
  { id: 'CR-3842', organ: 'heart',  organName: 'Heart',  from: 'AIMS',   to: 'Aster Medcity',  urgency: 'VERY_CRITICAL', status: 'IN_PROGRESS', eta: '12 min' },
  { id: 'CR-3839', organ: 'kidney', organName: 'Kidney', from: 'Lisie',  to: 'City General',   urgency: 'CRITICAL',      status: 'APPROVED',    eta: '28 min' },
  { id: 'CR-3835', organ: 'lungs',  organName: 'Lungs',  from: 'Amrita', to: 'Medical Trust',  urgency: 'CRITICAL',      status: 'COMPLETED',   eta: '—'      },
];
const MOCK_HISTORY = [
  { id: 'CR-3842', organ: 'heart',    organName: 'Heart',     from: 'AIMS Medical Centre',    to: 'Aster Medcity',         urgency: 'VERY_CRITICAL', status: 'IN_PROGRESS', date: 'Feb 23, 2026', time: '11:48 AM', duration: '—',    doctor: 'Dr. Priya Nair',    notes: 'Donor match confirmed. Priority route activated.' },
  { id: 'CR-3839', organ: 'kidney',   organName: 'Kidney',    from: 'Lisie Hospital',          to: 'City General Hospital', urgency: 'CRITICAL',      status: 'APPROVED',    date: 'Feb 23, 2026', time: '10:30 AM', duration: '—',    doctor: 'Dr. Anand Raj',     notes: 'Patient on dialysis. Scheduled pre-op at destination.' },
  { id: 'CR-3835', organ: 'lungs',    organName: 'Lungs',     from: 'Amrita Institute',        to: 'Medical Trust Hospital',urgency: 'CRITICAL',      status: 'COMPLETED',   date: 'Feb 23, 2026', time: '09:00 AM', duration: '38 min', doctor: 'Dr. Sujith Kumar',  notes: 'Successful bilateral lung transplant prep completed.' },
  { id: 'CR-3821', organ: 'liver',    organName: 'Liver',     from: 'City General Hospital',   to: 'AIMS Medical Centre',   urgency: 'VERY_CRITICAL', status: 'COMPLETED',   date: 'Feb 22, 2026', time: '04:15 PM', duration: '22 min', doctor: 'Dr. Meera Pillai',  notes: 'Acute liver failure case. Green corridor pre-cleared by traffic control.' },
  { id: 'CR-3810', organ: 'pancreas', organName: 'Pancreas',  from: 'Aster Medcity',           to: 'Amrita Institute',      urgency: 'CRITICAL',      status: 'COMPLETED',   date: 'Feb 22, 2026', time: '10:00 AM', duration: '45 min', doctor: 'Dr. George Thomas', notes: '' },
  { id: 'CR-3798', organ: 'heart',    organName: 'Heart',     from: 'Medical Trust Hospital',  to: 'Lisie Hospital',        urgency: 'VERY_CRITICAL', status: 'COMPLETED',   date: 'Feb 21, 2026', time: '07:20 AM', duration: '18 min', doctor: 'Dr. Priya Nair',    notes: 'Pediatric donor. All signals cleared en route.' },
  { id: 'CR-3785', organ: 'eye',      organName: 'Cornea',    from: 'AIMS Medical Centre',    to: 'City General Hospital', urgency: 'STABLE',        status: 'COMPLETED',   date: 'Feb 20, 2026', time: '02:00 PM', duration: '52 min', doctor: 'Dr. Latha Menon',   notes: 'Bilateral cornea. Stable transfer, no complications.' },
  { id: 'CR-3770', organ: 'kidney',   organName: 'Kidney',    from: 'Lisie Hospital',          to: 'Aster Medcity',         urgency: 'CRITICAL',      status: 'REJECTED',    date: 'Feb 19, 2026', time: '11:10 AM', duration: '—',    doctor: 'Dr. Anand Raj',     notes: 'Rejected — compatibility mismatch detected post-approval.' },
  { id: 'CR-3759', organ: 'testtube', organName: 'Intestine', from: 'Amrita Institute',        to: 'Medical Trust Hospital',urgency: 'CRITICAL',      status: 'COMPLETED',   date: 'Feb 18, 2026', time: '08:45 AM', duration: '31 min', doctor: 'Dr. Sujith Kumar',  notes: '' },
  { id: 'CR-3744', organ: 'testtube', organName: 'Tissue',    from: 'City General Hospital',   to: 'Lisie Hospital',        urgency: 'STABLE',        status: 'COMPLETED',   date: 'Feb 17, 2026', time: '03:30 PM', duration: '1h 04m', doctor: 'Dr. George Thomas', notes: 'Bone tissue bank transfer. Cold chain maintained.' },
];

// ── Mock API ───────────────────────────────────────────────────────────────
async function submitCorridorRequest() {
  await new Promise(r => setTimeout(r, 1200));
  return { corridorId: `CR-${Math.floor(1000 + Math.random() * 9000)}` };
}

// ── Shared styled input/select ─────────────────────────────────────────────
const inputCls = 'w-full h-13 px-4 rounded-xl text-white text-base placeholder:text-white/25 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60';
const inputStyle = { background: '#0d1424', border: '1px solid rgba(255,255,255,0.12)', colorScheme: 'dark' };
const labelCls = 'block text-xs font-bold text-white/40 mb-1.5 uppercase tracking-[0.1em]';

// ── Animated background ────────────────────────────────────────────────────
const BG_CSS = `
  @keyframes ringExpand {
    0%   { transform: translate(-50%,-50%) scale(0.5); opacity: 0.7; }
    100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; }
  }
  @keyframes cornerSpin {
    0%   { transform: rotate(45deg) scale(1);    opacity: 0.2; }
    50%  { transform: rotate(225deg) scale(1.12); opacity: 0.38; }
    100% { transform: rotate(405deg) scale(1);    opacity: 0.2; }
  }
  @keyframes cornerSpin2 {
    0%   { transform: rotate(45deg) scale(1);    opacity: 0.15; }
    50%  { transform: rotate(225deg) scale(1.08); opacity: 0.28; }
    100% { transform: rotate(405deg) scale(1);    opacity: 0.15; }
  }
`;

const AnimatedBackground = () => (
  <>
    <style>{BG_CSS}</style>
    <div style={{ position:'fixed', inset:0, zIndex:0, overflow:'hidden', pointerEvents:'none' }}>

      {/* Deep background */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, #020b07 0%, #030712 50%, #020a10 100%)' }} />

      {/* Circle ring cluster — bottom-left */}
      <div style={{ position:'absolute', bottom:'12%', left:'5%' }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{
            position:'absolute', top:'50%', left:'50%', width:360, height:360, borderRadius:'50%',
            border: i % 2 === 0 ? '1.5px solid rgba(16,185,129,0.32)' : '1px solid rgba(34,211,238,0.22)',
            animation:'ringExpand 7s ease-out infinite', animationDelay:`${i * 1.16}s`,
          }} />
        ))}
      </div>

      {/* Circle ring cluster — top-right */}
      <div style={{ position:'absolute', top:'15%', right:'8%' }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            position:'absolute', top:'50%', left:'50%', width:280, height:280, borderRadius:'50%',
            border: i % 2 === 0 ? '1.5px solid rgba(52,211,153,0.28)' : '1px solid rgba(16,185,129,0.2)',
            animation:'ringExpand 9s ease-out infinite', animationDelay:`${i * 1.8}s`,
          }} />
        ))}
      </div>

      {/* Circle ring cluster — center-left (extra depth) */}
      <div style={{ position:'absolute', top:'48%', left:'18%' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            position:'absolute', top:'50%', left:'50%', width:200, height:200, borderRadius:'50%',
            border:'1px solid rgba(103,232,249,0.18)',
            animation:'ringExpand 11s ease-out infinite', animationDelay:`${i * 2.75}s`,
          }} />
        ))}
      </div>

      {/* Diamond ring set — bottom-right corner */}
      <div style={{ position:'absolute', bottom:'-50px', right:'-50px', width:'300px', height:'300px',
        border:'1.5px solid rgba(16,185,129,0.32)', borderRadius:'36px',
        boxShadow:'inset 0 0 50px rgba(16,185,129,0.07), 0 0 35px rgba(16,185,129,0.1)',
        animation:'cornerSpin 12s linear infinite' }} />
      <div style={{ position:'absolute', bottom:'-25px', right:'-25px', width:'210px', height:'210px',
        border:'1px solid rgba(34,211,238,0.24)', borderRadius:'26px',
        animation:'cornerSpin 12s linear infinite', animationDelay:'1s' }} />
      <div style={{ position:'absolute', bottom:'8px', right:'8px', width:'130px', height:'130px',
        border:'1px solid rgba(52,211,153,0.2)', borderRadius:'18px',
        animation:'cornerSpin2 16s linear infinite', animationDelay:'0.5s' }} />
      <div style={{ position:'absolute', bottom:'32px', right:'32px', width:'72px', height:'72px',
        border:'1px solid rgba(16,185,129,0.28)', borderRadius:'10px',
        animation:'cornerSpin2 16s linear infinite reverse', animationDelay:'1.5s' }} />

      {/* Diamond ring set — top-left corner */}
      <div style={{ position:'absolute', top:'-50px', left:'-50px', width:'280px', height:'280px',
        border:'1.5px solid rgba(34,211,238,0.28)', borderRadius:'34px',
        boxShadow:'inset 0 0 40px rgba(34,211,238,0.06)',
        animation:'cornerSpin 14s linear infinite reverse' }} />
      <div style={{ position:'absolute', top:'-20px', left:'-20px', width:'190px', height:'190px',
        border:'1px solid rgba(16,185,129,0.22)', borderRadius:'24px',
        animation:'cornerSpin 14s linear infinite reverse', animationDelay:'1.2s' }} />
      <div style={{ position:'absolute', top:'15px', left:'15px', width:'110px', height:'110px',
        border:'1px solid rgba(52,211,153,0.18)', borderRadius:'14px',
        animation:'cornerSpin2 18s linear infinite', animationDelay:'0.8s' }} />
      <div style={{ position:'absolute', top:'38px', left:'38px', width:'60px', height:'60px',
        border:'1px solid rgba(34,211,238,0.24)', borderRadius:'8px',
        animation:'cornerSpin2 18s linear infinite reverse', animationDelay:'2s' }} />

    </div>
  </>
);

// ── Animated counter ───────────────────────────────────────────────────────
const AnimatedNumber = ({ target, suffix = '' }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 30;
    const inc = target / steps;
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <>{val}{suffix}</>;
};

// ── Pulse dot ─────────────────────────────────────────────────────────────
const PulseDot = ({ color }) => (
  <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: color }} />
    <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: color }} />
  </span>
);

// ── Stat card ──────────────────────────────────────────────────────────────
const StatCard = ({ label, value, suffix, icon, sub, color = '#10b981', trend }) => (
  <div className="relative rounded-2xl p-5 overflow-hidden group transition-all duration-300 hover:scale-[1.03] cursor-default"
    style={{ background: `linear-gradient(135deg, ${color}12, ${color}06)`, border: `1px solid ${color}30` }}>
    <div className="absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-6 translate-x-6 blur-2xl pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-40"
      style={{ background: color }} />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: `${color}bb` }}>{label}</span>
        {icon && <Icon name={icon} size={20} color={`${color}cc`} />}
      </div>
      <div className="text-4xl font-black text-white leading-none mb-1">
        <AnimatedNumber target={typeof value === 'number' ? value : parseInt(value) || 0} suffix={suffix || ''} />
        {typeof value === 'string' && isNaN(parseInt(value)) && value}
      </div>
      <div className="flex items-center gap-2 mt-1">
        {sub && <span className="text-xs" style={{ color: `${color}80` }}>{sub}</span>}
        {trend && <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${color}22`, color }}>{trend}</span>}
      </div>
    </div>
  </div>
);

// ── Status badge ───────────────────────────────────────────────────────────
const statusConfig = {
  IN_PROGRESS: { label: 'In Progress', color: '#3b82f6' },
  APPROVED:    { label: 'Approved',    color: '#10b981' },
  COMPLETED:   { label: 'Completed',   color: '#6b7280' },
  PENDING:     { label: 'Pending',     color: '#f59e0b' },
  REJECTED:    { label: 'Rejected',    color: '#ef4444' },
};
const urgencyConfig = {
  VERY_CRITICAL: { label: 'Very Critical', color: '#ef4444' },
  CRITICAL:      { label: 'Critical',      color: '#f59e0b' },
  STABLE:        { label: 'Stable',        color: '#10b981' },
};
const Badge = ({ cfg }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
    style={{ background: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}40` }}>
    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
    {cfg.label}
  </span>
);

// ── Section card for forms ─────────────────────────────────────────────────
const SectionCard = ({ title, children, accent = '#10b981' }) => (
  <div className="rounded-2xl p-6 transition-all duration-200 hover:border-white/15"
    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}>
    <h3 className="text-sm font-bold uppercase tracking-[0.15em] mb-5" style={{ color: accent }}>{title}</h3>
    {children}
  </div>
);

// ── Custom styled dropdown ─────────────────────────────────────────────────
const CUSTOM_SELECT_CSS = `
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)     scale(1);    }
  }
  .cs-panel { animation: dropIn 0.18s cubic-bezier(0.16,1,0.3,1) both; }
`;
function CustomSelect({ value, onChange, options, minWidth = '130px' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find(o => o.value === value);
  useEffect(() => {
    function outside(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);
  return (
    <>
      <style>{CUSTOM_SELECT_CSS}</style>
      <div ref={ref} className="relative" style={{ minWidth }}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white outline-none cursor-pointer transition-all duration-200 hover:border-emerald-500/40"
          style={{
            background: open ? 'rgba(16,185,129,0.08)' : '#0d1424',
            border: open ? '1px solid rgba(16,185,129,0.45)' : '1px solid rgba(255,255,255,0.12)',
            boxShadow: open ? '0 0 16px rgba(16,185,129,0.15)' : 'none',
          }}>
          <span className="flex-1 text-left truncate">{selected?.label ?? '—'}</span>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0, opacity: 0.5 }}>
            <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {open && (
          <div className="cs-panel absolute top-full left-0 mt-2 rounded-2xl overflow-hidden z-[999]"
            style={{
              background: 'linear-gradient(180deg,#111c2e 0%,#0a1220 100%)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(16,185,129,0.08)',
              minWidth: '100%',
            }}>
            {options.map((o, i) => {
              const isActive = o.value === value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => { onChange(o.value); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-all duration-100 group"
                  style={{
                    borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: isActive ? 'rgba(16,185,129,0.14)' : 'transparent',
                    color: isActive ? '#10b981' : 'rgba(255,255,255,0.72)',
                    fontWeight: isActive ? 700 : 400,
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all"
                    style={{ background: isActive ? '#10b981' : 'rgba(255,255,255,0.15)' }} />
                  <span className="flex-1">{o.label}</span>
                  {isActive && (
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

// ── Mini Map Preview ──────────────────────────────────────────────────────
const MINI_MAP_CSS = `
  @keyframes dashMove { to { stroke-dashoffset: -24; } }
  @keyframes pingOrb  { 0%,100%{transform:scale(1);opacity:0.9} 50%{transform:scale(1.5);opacity:0.4} }
  @keyframes scanLine { 0%{top:0%} 100%{top:100%} }
`;

const URGENCY_COLOR = { VERY_CRITICAL: '#ef4444', CRITICAL: '#f59e0b', STABLE: '#10b981' };

const MiniMapPreview = ({ setCurrentPage, corridors }) => {
  const active = corridors.filter(c => c.status !== 'COMPLETED');
  return (
    <>
      <style>{MINI_MAP_CSS}</style>
      <div
        onClick={() => setCurrentPage && setCurrentPage('map')}
        className="hidden lg:flex flex-col cursor-pointer group"
        style={{ width: 340, flexShrink: 0, position: 'sticky', top: 32, height: 'fit-content' }}
      >
        {/* Map canvas area */}
        <div className="relative rounded-2xl overflow-hidden mb-3"
          style={{ height: 240, background: '#0a1628', border: '1px solid rgba(16,185,129,0.25)' }}>

          {/* Grid lines */}
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.12 }}>
            {[0,1,2,3,4,5,6].map(i => (
              <line key={`h${i}`} x1="0" y1={`${i*16.66}%`} x2="100%" y2={`${i*16.66}%`} stroke="#10b981" strokeWidth="0.5"/>
            ))}
            {[0,1,2,3,4,5,6,7,8].map(i => (
              <line key={`v${i}`} x1={`${i*12.5}%`} y1="0" x2={`${i*12.5}%`} y2="100%" stroke="#10b981" strokeWidth="0.5"/>
            ))}
          </svg>

          {/* "Road" shapes */}
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
                fill="none" stroke={URGENCY_COLOR[active[0]?.urgency] || '#f59e0b'}
                strokeWidth="2.5" strokeDasharray="8 4" opacity="0.85"
                style={{ animation:'dashMove 1.2s linear infinite' }}
              />
              {/* Hospital markers */}
              {[{x:15,y:190,label:'SRC'},{x:310,y:80,label:'DST'}].map(({x,y,label}) => (
                <g key={label}>
                  <circle cx={x} cy={y} r="8" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="1.5"/>
                  <text x={x} y={y+4} textAnchor="middle" fontSize="7" fill="#10b981" fontWeight="bold">{label}</text>
                </g>
              ))}
              {/* Ambulance dot (animated) */}
              <circle cx="160" cy="75" r="7" fill={URGENCY_COLOR[active[0]?.urgency] || '#f59e0b'}
                style={{ animation:'pingOrb 1.4s ease-in-out infinite' }} />
              <text x="160" y="79" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">+</text>
            </svg>
          )}

          {/* Scan line */}
          <div style={{ position:'absolute', left:0, right:0, height:'2px',
            background:'linear-gradient(90deg,transparent,rgba(16,185,129,0.5),transparent)',
            animation:'scanLine 4s linear infinite', pointerEvents:'none' }} />

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background:'rgba(0,0,0,0.55)', backdropFilter:'blur(3px)' }}>
            <div className="flex flex-col items-center gap-2">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#10b981"/>
              </svg>
              <span className="text-white font-bold text-sm">Open Full Map</span>
              <span className="text-white/40 text-xs">Live tracking</span>
            </div>
          </div>

          {/* Top badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background:'rgba(0,0,0,0.75)', border:'1px solid rgba(16,185,129,0.35)', backdropFilter:'blur(8px)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-bold">LIVE</span>
          </div>

          {/* Bottom right — active count */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background:'rgba(0,0,0,0.75)', color:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.1)' }}>
            {active.length} active corridor{active.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Corridor cards below the mini map */}
        <div className="flex flex-col gap-2">
          {active.slice(0,2).map(c => {
            const uc = URGENCY_COLOR[c.urgency] || '#f59e0b';
            return (
              <div key={c.id} className="rounded-xl px-4 py-3 flex items-center gap-3 group-hover:border-white/15 transition-all"
                style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
                {/* Critcality bar */}
                <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: uc }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-base">{c.organ}</span>
                    <span className="text-sm font-bold text-white truncate">{c.from} → {c.to}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-white/30">{c.id}</span>
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background:`${uc}20`, color: uc }}>{c.urgency.replace('_', ' ')}</span>
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
            style={{ background:'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(59,130,246,0.1))', border:'1px solid rgba(16,185,129,0.25)' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#10b981"/>
            </svg>
            <span style={{ color:'#10b981' }}>View Full Live Map</span>
          </div>
        </div>
      </div>
    </>
  );
};

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║                        HOSPITAL DASHBOARD                               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
const HospitalDashboard = ({ user, onLogout, setCurrentPage }) => {
  const [view, setView]                       = useState('dashboard');
  const [form, setForm]                       = useState(EMPTY_FORM);
  const [submitting, setSubmitting]           = useState(false);
  const [submitResult, setSubmitResult]       = useState(null);
  const [formError, setFormError]             = useState('');
  const [formStep, setFormStep]               = useState(1);
  const [activeTab, setActiveTab]             = useState('corridors');
  const [hoveredCorridor, setHoveredCorridor] = useState(null);
  const [tick, setTick]                       = useState(0);
  const [histFilter, setHistFilter]           = useState('ALL');
  const [histSearch, setHistSearch]           = useState('');
  const [histOrgan, setHistOrgan]             = useState('ALL');
  const [histUrgency, setHistUrgency]         = useState('ALL');
  const [histDate, setHistDate]               = useState('ALL');
  const [histSort, setHistSort]               = useState('newest');

  // Tick for live clock feel
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 60000);
    return () => clearInterval(t);
  }, []);

  // Scroll to top on mount
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const handleFormChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const validateStep = () => {
    if (formStep === 1 && !form.destinationHospital) { setFormError('Select a destination hospital.'); return false; }
    if (formStep === 2 && !form.organType) { setFormError('Select an organ type.'); return false; }
    return true;
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    if (!form.destinationHospital || !form.organType) { setFormError('Please complete all required fields.'); return; }
    if (form.sourceHospital === form.destinationHospital) { setFormError('Source and destination must differ.'); return; }
    setSubmitting(true); setFormError('');
    try { setSubmitResult(await submitCorridorRequest(form)); }
    catch { setFormError('Submission failed. Please try again.'); }
    finally { setSubmitting(false); }
  };

  const resetForm = () => { setForm(EMPTY_FORM); setSubmitResult(null); setFormError(''); setFormStep(1); };

  // ── Shared header ─────────────────────────────────────────────────────────
  const Header = () => (
    <header className="relative z-20 flex items-center justify-between px-8 py-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shadow-lg"
            style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}><HospitalIcon size={20} color="#fff" /></div>
        </div>
        <div>
          <div className="text-base font-black text-white tracking-tight leading-none">GreenNote</div>
          <div className="text-xs font-semibold tracking-wider" style={{ color: '#10b981' }}>HOSPITAL PORTAL</div>
        </div>
      </div>

      {/* Nav tabs */}
      {view === 'dashboard' && (
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {[['corridors','Corridors'],['analytics','Analytics']].map(([id, lbl]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200"
              style={activeTab === id
                ? { background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }
                : { color: 'rgba(255,255,255,0.4)', border: '1px solid transparent' }}>
              {lbl}
            </button>
          ))}
          <button onClick={() => setView('history')}
            className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200"
            style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid transparent' }}>
            View History
          </button>
        </div>
      )}

      {/* Right actions */}
      <div className="flex items-center gap-3">

        <button onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/50 hover:text-white transition-all hover:bg-white/8">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Logout
        </button>
      </div>
    </header>
  );

  // ── HISTORY VIEW ──────────────────────────────────────────────────────────
  if (view === 'history') {
    const filters = ['ALL', 'IN_PROGRESS', 'APPROVED', 'COMPLETED', 'REJECTED'];
    const todayMidnight = new Date(); todayMidnight.setHours(0,0,0,0);
    const msDay = 86400000;
    let filtered = [...MOCK_HISTORY];
    if (histFilter !== 'ALL') filtered = filtered.filter(c => c.status === histFilter);
    if (histSearch.trim()) {
      const q = histSearch.trim().toLowerCase();
      filtered = filtered.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.from.toLowerCase().includes(q) ||
        c.to.toLowerCase().includes(q) ||
        (c.doctor && c.doctor.toLowerCase().includes(q))
      );
    }
    if (histOrgan !== 'ALL') filtered = filtered.filter(c => c.organName === histOrgan);
    if (histUrgency !== 'ALL') filtered = filtered.filter(c => c.urgency === histUrgency);
    if (histDate === 'today') filtered = filtered.filter(c => new Date(c.date) >= todayMidnight);
    if (histDate === '7d')    filtered = filtered.filter(c => new Date(c.date) >= new Date(todayMidnight - 6 * msDay));
    if (histDate === '30d')   filtered = filtered.filter(c => new Date(c.date) >= new Date(todayMidnight - 29 * msDay));
    if (histSort === 'oldest') filtered = [...filtered].reverse();
    return (
      <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden">
        <AnimatedBackground />
        <Header />
        <main className="relative z-10 max-w-5xl mx-auto px-6 py-8">
          {/* Back + title */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setView('dashboard')}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M15.75 19.25L8.75 12.25L15.75 5.25" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div>
              <h1 className="text-2xl font-black text-white">Corridor History</h1>
              <p className="text-sm text-white/40 mt-0.5">{MOCK_HISTORY.length} total records · all transport corridors</p>
            </div>
          </div>

          {/* Summary chips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total',      val: MOCK_HISTORY.length,                                                            color: '#6b7280' },
              { label: 'Completed',  val: MOCK_HISTORY.filter(c => c.status === 'COMPLETED').length,                      color: '#10b981' },
              { label: 'Active', val: MOCK_HISTORY.filter(c => ['IN_PROGRESS','APPROVED'].includes(c.status)).length, color: '#3b82f6' },
              { label: 'Rejected',   val: MOCK_HISTORY.filter(c => c.status === 'REJECTED').length,                       color: '#ef4444' },
            ].map(s => (
              <div key={s.label} className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ background: `${s.color}10`, border: `1px solid ${s.color}30` }}>
                <span className="text-2xl font-black" style={{ color: s.color }}>{s.val}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-white/40">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Search + filter toolbar */}
          <div className="rounded-2xl p-4 mb-4 flex flex-wrap gap-3 items-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {/* Text search */}
            <div className="relative flex-1 min-w-[180px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" width="14" height="14" fill="none" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                value={histSearch}
                onChange={e => setHistSearch(e.target.value)}
                placeholder="Search by ID, hospital, doctor…"
                className="w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none text-white placeholder-white/25 bg-transparent"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            {/* Organ dropdown */}
            <CustomSelect
              value={histOrgan}
              onChange={setHistOrgan}
              minWidth="140px"
              options={[
                { value: 'ALL', label: 'All Organs' },
                ...ORGANS.map(o => ({ value: o.name, label: `${o.icon} ${o.name}` }))
              ]}
            />

            {/* Urgency dropdown */}
            <CustomSelect
              value={histUrgency}
              onChange={setHistUrgency}
              minWidth="135px"
              options={[
                { value: 'ALL',           label: 'All Urgency'     },
                { value: 'STABLE',        label: 'Stable'        },
                { value: 'CRITICAL',      label: 'Critical'      },
                { value: 'VERY_CRITICAL', label: 'Very Critical' },
              ]}
            />

            {/* Date dropdown */}
            <CustomSelect
              value={histDate}
              onChange={setHistDate}
              minWidth="125px"
              options={[
                { value: 'ALL',   label: 'All Time'    },
                { value: 'today', label: 'Today'       },
                { value: '7d',    label: 'Last 7 Days' },
                { value: '30d',   label: 'Last 30 Days'},
              ]}
            />

            {/* Sort toggle */}
            <button
              onClick={() => setHistSort(s => s === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {histSort === 'newest' ? 'Newest First' : 'Oldest First'}
            </button>

            {/* Clear filters */}
            {(histSearch || histOrgan !== 'ALL' || histUrgency !== 'ALL' || histDate !== 'ALL') && (
              <button
                onClick={() => { setHistSearch(''); setHistOrgan('ALL'); setHistUrgency('ALL'); setHistDate('ALL'); }}
                className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:scale-105"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
                ✕ Clear
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {filters.map(f => (
              <button key={f} onClick={() => setHistFilter(f)}
                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200"
                style={histFilter === f
                  ? { background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.4)' }
                  : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {f === 'ALL' ? 'All' : f === 'IN_PROGRESS' ? 'In Progress' : f === 'VERY_CRITICAL' ? 'Very Critical' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
            <span className="ml-auto text-xs text-white/25 font-mono">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {/* History cards */}
          <div className="flex flex-col gap-3">
            {filtered.map(c => {
              const sc = statusConfig[c.status];
              const uc = urgencyConfig[c.urgency];
              return (
                <div key={c.id} className="rounded-2xl p-5 transition-all duration-200 hover:border-white/15"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {/* Top row */}
                  <div className="flex items-start gap-4">
                    {/* Organ icon */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 mt-0.5"
                      style={{ background: `${uc.color}15`, border: `1px solid ${uc.color}30` }}>
                      {c.organ}
                    </div>
                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <span className="text-base font-black text-white">{c.from}</span>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="flex-shrink-0 text-white/25"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span className="text-base font-black text-white">{c.to}</span>
                        <Badge cfg={sc} />
                        <Badge cfg={uc} />
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-mono text-white/30">{c.id}</span>
                        <span className="text-xs text-white/30">·</span>
                        <span className="text-xs text-white/40">{c.organName}</span>
                        <span className="text-xs text-white/30">·</span>
                        <span className="text-xs text-white/40">{c.date} at {c.time}</span>
                      </div>
                    </div>
                    {/* Duration chip */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs font-bold uppercase tracking-wider text-white/30 mb-0.5">Duration</div>
                      <div className="text-base font-black text-white">{c.duration}</div>
                    </div>
                  </div>

                  {/* Detail row */}
                  <div className="mt-4 pt-4 grid grid-cols-1 md:grid-cols-3 gap-3"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold uppercase tracking-widest text-white/25">Doctor In Charge</span>
                      <span className="text-sm font-semibold text-white/70">{c.doctor || '—'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold uppercase tracking-widest text-white/25">Urgency</span>
                      <span className="text-sm font-semibold" style={{ color: uc.color }}>{uc.label}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold uppercase tracking-widest text-white/25">Notes</span>
                      <span className="text-sm text-white/50 leading-snug">{c.notes || 'No additional notes.'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // ── CREATE CORRIDOR VIEW ───────────────────────────────────────────────────
  if (view === 'create') {
    const steps = ['Route', 'Organ', 'Team', 'Review'];
    const urgencyObj = URGENCY.find(u => u.value === form.urgencyLevel);
    const organObj   = ORGANS.find(o => o.name === form.organType);

    return (
      <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden">
        <AnimatedBackground />
        <Header />

        <main className="relative z-10 max-w-4xl mx-auto px-6 py-8">
          {/* Back + title */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => { setView('dashboard'); resetForm(); }}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M15.75 19.25L8.75 12.25L15.75 5.25" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div>
              <h1 className="text-2xl font-black text-white">Create Green Corridor</h1>
              <p className="text-sm text-white/40 mt-0.5">Emergency organ transport request</p>
            </div>
          </div>

          {/* Step indicator */}
          {!submitResult && (
            <div className="flex items-center gap-0 mb-8">
              {steps.map((s, i) => {
                const done = i + 1 < formStep;
                const active = i + 1 === formStep;
                return (
                  <React.Fragment key={s}>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300"
                        style={done
                          ? { background: '#10b981', color: '#fff', boxShadow: '0 0 12px rgba(16,185,129,0.5)' }
                          : active
                          ? { background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '2px solid #10b981' }
                          : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {done ? '✓' : i + 1}
                      </div>
                      <span className="text-xs font-semibold" style={{ color: active ? '#10b981' : done ? '#10b981' : 'rgba(255,255,255,0.3)' }}>{s}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="flex-1 h-px mx-3 mb-4 transition-all duration-500"
                        style={{ background: done ? '#10b981' : 'rgba(255,255,255,0.08)' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* SUCCESS — Green Corridor Accepted */}
          {submitResult ? (
            <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 relative">
              {/* Glow backdrop */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-96 h-96 rounded-full blur-[120px] opacity-20" style={{ background: '#10b981' }} />
              </div>

              {/* Icon */}
              <div className="relative mb-8">
                <div className="w-28 h-28 rounded-full flex items-center justify-center text-5xl"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.4)', boxShadow: '0 0 60px rgba(16,185,129,0.35)' }}><CheckCircleIcon size={64} color="#10b981" /></div>
                <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-lg"
                  style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 0 16px rgba(16,185,129,0.6)' }}><AmbulanceIcon size={20} color="#fff" /></span>
              </div>

              {/* Heading */}
              <div className="relative text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="h-px w-10" style={{ background: 'rgba(16,185,129,0.4)' }} />
                  <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: '#10b981' }}>Green Corridor Accepted</span>
                  <div className="h-px w-10" style={{ background: 'rgba(16,185,129,0.4)' }} />
                </div>
                <h2 className="text-5xl font-black text-white mb-3 leading-tight">Corridor Activated!</h2>
                <p className="text-white/45 text-base max-w-sm mx-auto">Your green corridor request has been submitted and is now awaiting Control Room approval.</p>
              </div>

              {/* Corridor ID card */}
              <div className="relative rounded-2xl px-10 py-6 flex flex-col items-center gap-3 mb-10 w-full max-w-xs"
                style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(16,185,129,0.25)', backdropFilter: 'blur(12px)' }}>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/30">Corridor ID</span>
                <span className="text-4xl font-black tracking-widest" style={{ color: '#10b981', textShadow: '0 0 30px rgba(16,185,129,0.5)' }}>{submitResult.corridorId}</span>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full mt-1" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}>
                  <PulseDot color="#f59e0b" />
                  <span className="text-xs font-bold text-amber-400 tracking-wide">PENDING CONTROL ROOM APPROVAL</span>
                </div>
              </div>

              {/* Actions */}
              <div className="relative flex flex-col items-center gap-3 w-full max-w-xs">
                <button onClick={() => { setView('dashboard'); resetForm(); }}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-base transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 6px 28px rgba(16,185,129,0.45)' }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Go Back to Home
                </button>
                <button onClick={resetForm}
                  className="w-full px-8 py-3 rounded-2xl font-bold text-sm text-white/40 hover:text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  + Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit}>
              {/* Step 1: Route */}
              {formStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SectionCard title="Source Hospital">
                    <label className={labelCls}>Your Hospital</label>
                    <select name="sourceHospital" value={form.sourceHospital} onChange={handleFormChange}
                      className={inputCls} style={inputStyle}>
                      <option value="">Select hospital (optional)</option>
                      {HOSPITALS.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </SectionCard>
                  <SectionCard title="Destination Hospital">
                    <label className={labelCls}>Transfer To <span className="text-red-400 normal-case">*</span></label>
                    <select name="destinationHospital" value={form.destinationHospital} onChange={handleFormChange}
                      className={inputCls} style={inputStyle} required>
                      <option value="">Select destination</option>
                      {HOSPITALS.filter(h => h !== form.sourceHospital).map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    {form.destinationHospital && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {form.destinationHospital} selected
                      </div>
                    )}
                  </SectionCard>
                  {form.sourceHospital && form.destinationHospital && (
                    <div className="md:col-span-2 rounded-xl p-4 flex items-center gap-4"
                      style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <div className="text-sm font-semibold text-white/70 flex items-center gap-3">
                        <span className="text-white font-bold">{form.sourceHospital}</span>
                        <svg className="text-emerald-400" width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span className="text-white font-bold">{form.destinationHospital}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Organ + Urgency */}
              {formStep === 2 && (
                <div className="flex flex-col gap-5">
                  <SectionCard title="Select Organ Type">
                    <div className="grid grid-cols-4 gap-3">
                      {ORGANS.map(o => (
                        <button key={o.name} type="button" onClick={() => { setForm(p => ({ ...p, organType: o.name })); setFormError(''); }}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:scale-105"
                          style={form.organType === o.name
                            ? { background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.5)', boxShadow: '0 0 20px rgba(16,185,129,0.2)' }
                            : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <Icon name={o.icon} size={28} color={form.organType === o.name ? '#10b981' : 'rgba(255,255,255,0.4)'} />
                          <span className="text-sm font-bold text-white">{o.name}</span>
                          <span className="text-xs" style={{ color: form.organType === o.name ? '#10b981' : 'rgba(255,255,255,0.3)' }}>
                            {o.viability} viable
                          </span>
                        </button>
                      ))}
                    </div>
                  </SectionCard>
                  <SectionCard title="Urgency Level">
                    <div className="grid grid-cols-3 gap-3">
                      {URGENCY.map(u => (
                        <button key={u.value} type="button" onClick={() => setForm(p => ({ ...p, urgencyLevel: u.value }))}
                          className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 hover:scale-105"
                          style={form.urgencyLevel === u.value
                            ? { background: `${u.color}20`, border: `2px solid ${u.color}60`, boxShadow: `0 0 20px ${u.glow}` }
                            : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: form.urgencyLevel === u.value ? u.dotColor : 'rgba(255,255,255,0.2)', boxShadow: form.urgencyLevel === u.value ? `0 0 8px ${u.dotColor}` : 'none' }} />
                          <span className="text-base font-bold" style={{ color: form.urgencyLevel === u.value ? u.color : 'rgba(255,255,255,0.5)' }}>{u.label}</span>
                        </button>
                      ))}
                    </div>
                  </SectionCard>
                </div>
              )}

              {/* Step 3: Team */}
              {formStep === 3 && (
                <div className="grid grid-cols-1 gap-4">
                  <SectionCard title="Doctor In Charge">
                    <div className="flex flex-col gap-3">
                      {[['doctorName',"Doctor's Name"],['doctorPhone','Contact Number'],['doctorSpecialization','Specialization']].map(([field, ph]) => (
                        <div key={field}>
                          <label className={labelCls}>{ph}</label>
                          <input name={field} value={form[field]} onChange={handleFormChange} placeholder={ph} className={inputCls} style={inputStyle} />
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                  <div className="md:col-span-2 rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <label className={labelCls}>Additional Notes</label>
                    <textarea name="notes" rows={3} value={form.notes} onChange={handleFormChange}
                      placeholder="Special instructions, patient condition, route preferences…"
                      className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder:text-white/25 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }} />
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {formStep === 4 && (
                <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 className="text-base font-bold uppercase tracking-widest text-white/40 mb-5">Review & Confirm</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ['Source',      form.sourceHospital || 'Not specified'],
                      ['Destination', form.destinationHospital || '—'],
                      ['Organ',       organObj ? organObj.name : '—'],
                      ['Urgency',     urgencyObj ? urgencyObj.label : '—'],
                      ['Doctor',      form.doctorName || 'Not specified'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex flex-col gap-1 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <span className="text-xs font-bold uppercase tracking-widest text-white/30">{k}</span>
                        <span className="text-base font-semibold text-white">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-3 p-3 rounded-xl" style={{ background: `${urgencyObj?.color}12`, border: `1px solid ${urgencyObj?.color}30` }}>
                    <PulseDot color={urgencyObj?.color || '#f59e0b'} />
                    <span className="text-base font-bold" style={{ color: urgencyObj?.color }}>
                      {urgencyObj?.label} — {organObj ? `${organObj.name} transport` : 'Organ transport'} requested
                    </span>
                  </div>
                </div>
              )}

              {/* Error */}
              {formError && (
                <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: '0.95rem' }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {formError}
                </div>
              )}

              {/* Navigation */}
              <div className="mt-6 flex items-center justify-between">
                {formStep > 1 ? (
                  <button type="button" onClick={() => setFormStep(p => p - 1)}
                    className="px-5 py-3 rounded-xl font-bold text-base text-white/50 hover:text-white transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    ← Back
                  </button>
                ) : (
                  <button type="button" onClick={() => { setView('dashboard'); resetForm(); }}
                    className="px-5 py-3 rounded-xl font-bold text-base text-white/40 hover:text-white transition-all">
                    Cancel
                  </button>
                )}
                {formStep < 4 ? (
                  <button type="button"
                    onClick={() => { if (validateStep()) { setFormError(''); setFormStep(p => p + 1); } }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 4px 16px rgba(16,185,129,0.35)' }}>
                    Continue →
                  </button>
                ) : (
                  <button type="submit" disabled={submitting}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-base transition-all hover:scale-105 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 4px 20px rgba(16,185,129,0.4)' }}>
                    {submitting ? (
                      <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z"/></svg> Submitting…</>
                    ) : 'Submit'}
                  </button>
                )}
              </div>
            </form>
          )}
        </main>
      </div>
    );
  }

  // ── MAIN DASHBOARD VIEW ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden">
      <AnimatedBackground />

      <Header />

      <main className="relative z-10 px-6 py-8" style={{ maxWidth: 1600, margin: '0 auto' }}>
        <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
        {/* ── Welcome banner ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-px w-8 bg-emerald-500/50" />
              <span className="text-xs font-bold tracking-[0.2em] text-emerald-500/70 uppercase">Hospital Dashboard</span>
            </div>
            <h2 className="text-4xl font-black text-white">
              Welcome, <span style={{ background: 'linear-gradient(135deg,#10b981,#34d399,#6ee7b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.hospitalName || user?.name || 'Hospital'}</span> Admin
            </h2>
            <p className="text-white/35 text-base mt-1">{user?.email} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          {/* Quick create button */}
          <button
            onClick={() => { resetForm(); setView('create'); }}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-base transition-all duration-200 hover:scale-105 group whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 8px 30px rgba(16,185,129,0.35)' }}>
            <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center transition-transform group-hover:rotate-90 duration-300 text-base">＋</span>
            Create Green Corridor
          </button>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Active Corridors" value={2}  icon="road"       sub="Live right now"    color="#ef4444" trend="+1 today" />
          <StatCard label="Pending Approval" value={5}  icon="hourglass"  sub="Awaiting action"   color="#f59e0b" />
          <StatCard label="Completed Today"  value={8}  icon="check"      sub="Successful"        color="#10b981" trend="↑ 33%" />
          <StatCard label="Ambulances Live"  value={12} icon="ambulance"  sub="GPS connected"     color="#3b82f6" />
        </div>

        {/* ── Tab content ── */}
        {activeTab === 'corridors' && (
          <>
            {/* Active corridors table */}
            <div className="rounded-2xl overflow-hidden mb-6"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-white">Recent Corridors</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {MOCK_CORRIDORS.filter(c => c.status !== 'COMPLETED').length} active
                  </span>
                </div>
                <button onClick={() => { resetForm(); setView('create'); }}
                  className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                  + New Request
                </button>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {MOCK_CORRIDORS.map(c => {
                  const sc = statusConfig[c.status];
                  const uc = urgencyConfig[c.urgency];
                  const isActive = c.status === 'IN_PROGRESS';
                  return (
                    <div key={c.id}
                      className="flex items-center gap-5 px-6 py-4 transition-all duration-200 cursor-default"
                      style={{ background: hoveredCorridor === c.id ? 'rgba(255,255,255,0.03)' : 'transparent' }}
                      onMouseEnter={() => setHoveredCorridor(c.id)}
                      onMouseLeave={() => setHoveredCorridor(null)}>
                      {/* Organ icon */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: isActive ? `${uc.color}20` : 'rgba(255,255,255,0.05)', border: isActive ? `1px solid ${uc.color}40` : '1px solid transparent' }}>
                        <Icon name={c.organ} size={20} color={isActive ? uc.color : 'rgba(255,255,255,0.4)'} />
                      </div>
                      {/* Route */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-base font-bold text-white mb-0.5">
                          <span>{c.from}</span>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="text-white/30 flex-shrink-0"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <span>{c.to}</span>
                        </div>
                        <div className="text-xs text-white/30 font-mono">{c.id}</div>
                      </div>
                      {/* ETA */}
                      {isActive && (
                        <div className="text-center">
                          <div className="text-xl font-black text-white">{c.eta}</div>
                          <div className="text-xs text-white/30">ETA</div>
                        </div>
                      )}
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge cfg={uc} />
                        <Badge cfg={sc} />
                      </div>
                      {/* Live pulse for active */}
                      {isActive && <PulseDot color="#3b82f6" />}
                    </div>
                  );
                })}
              </div>
              {/* View Full History Log footer */}
              <div className="px-6 py-3 border-t flex items-center justify-center" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <button onClick={() => setView('history')}
                  className="flex items-center gap-2 text-sm font-bold text-white/40 hover:text-white transition-all duration-200 group">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  View Full History Log
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>

            {/* Activity feed */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <span className="text-base font-bold text-white">Activity Feed</span>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {[
                  { time: '12:04 PM', icon: 'check',     msg: 'CR-3835 completed — Lung transport successful',        color: '#10b981' },
                  { time: '11:30 AM', icon: 'siren',     msg: 'CR-3842 dispatched — Ambulance KL-07-AB-1234 en route', color: '#ef4444' },
                  { time: '10:15 AM', icon: 'clipboard', msg: 'CR-3839 approved by Control Room',                     color: '#3b82f6' },
                  { time: '09:00 AM', icon: 'road',      msg: 'New corridor request CR-3839 submitted',               color: '#f59e0b' },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                    <span className="text-xs text-white/25 w-20 flex-shrink-0 font-mono">{a.time}</span>
                    <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-lg"
                      style={{ background: `${a.color}15` }}><Icon name={a.icon} size={14} color={a.color} /></span>
                    <span className="text-sm text-white/60">{a.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: 'This Month',   value: 47,  suffix: '',   sub: 'Total corridors',  color: '#10b981' },
              { label: 'Avg Duration', value: 18,  suffix: 'min',sub: 'Per corridor',     color: '#3b82f6' },
              { label: 'Success Rate', value: 97,  suffix: '%',  sub: 'Completed safely', color: '#8b5cf6' },
            ].map(s => (
              <StatCard key={s.label} {...s} icon="barchart" />
            ))}
            <div className="md:col-span-3 rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white/40 mb-6">Corridors by Organ Type</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {ORGANS.map((o, i) => {
                  const pct = [68, 85, 72, 45, 30, 20, 90, 15][i];
                  return (
                    <div key={o.name} className="flex flex-col items-center gap-2">
                      <div className="relative w-full aspect-square flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"/>
                          <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="3"
                            strokeDasharray={`${(pct / 100) * 94} 94`} strokeLinecap="round" opacity="0.8"/>
                        </svg>
                        <Icon name={o.icon} size={16} color="#10b981" className="relative z-10" />
                      </div>
                      <span className="text-xs font-bold text-white/50">{o.name}</span>
                      <span className="text-sm font-black text-white">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        </div>{/* end flex-1 */}
        <MiniMapPreview setCurrentPage={setCurrentPage} corridors={MOCK_CORRIDORS} />
        </div>{/* end flex gap-6 */}
      </main>
    </div>
  );
};

export default HospitalDashboard;
