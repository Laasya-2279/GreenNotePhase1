import React, { useRef, useState, useEffect } from 'react'
import Spline from '@splinetool/react-spline';
import { Icon, UserIcon, SatelliteIcon, TrafficLightIcon, RobotIcon, MapIcon, HospitalIcon, BellIcon } from '../../components/Icons';

class SplineErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch() {}
  render() { return this.state.hasError ? null : this.props.children; }
}

const HOME_CSS = `
  @keyframes homeFadeUp {
    from { opacity:0; transform:translateY(22px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes homeGlowPulse {
    0%,100% { box-shadow: 0 0 0px transparent; }
    50%      { box-shadow: 0 0 18px var(--pill-color, rgba(239,68,68,0.5)); }
  }
  @keyframes homeCountUp {
    from { opacity:0; transform:scale(0.7); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes flowLine {
    0%   { width:0%; }
    100% { width:100%; }
  }
  @keyframes floatOrb {
    0%,100% { transform: translateY(0px) scale(1); }
    50%      { transform: translateY(-18px) scale(1.04); }
  }
  @keyframes shimmerSlide {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .home-fade-up  { animation: homeFadeUp 0.7s ease both; }
  .home-pill:hover { transform: translateY(-2px) scale(1.07); }
  .home-stat:hover .home-stat-val { text-shadow: 0 0 18px currentColor; }
  .home-feature-card:hover { }
  .about-orb { animation: floatOrb 7s ease-in-out infinite; }
  .about-orb-2 { animation: floatOrb 9s ease-in-out infinite reverse; }
  .shimmer-text {
    background: linear-gradient(90deg, #fff 0%, #c084fc 30%, #fff 50%, #818cf8 70%, #fff 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmerSlide 4s linear infinite;
  }
`;

const TEAM = [
    { name: 'Laasya',   role: 'Backend & Algorithms',  color: '#f59e0b' },
    { name: 'Aariyan',  role: 'ML & ETA Prediction',   color: '#8b5cf6' },
    { name: 'Mathew',   role: 'Datasets',               color: '#10b981' },
    { name: 'Miamin',   role: 'UI/UX',                  color: '#f43f5e' },
    { name: 'Nousheen', role: 'Frontend',               color: '#38bdf8' },
];

const FEATURES = [
    { icon: 'satellite', title: 'Live GPS Corridor',    desc: 'Ambulance position broadcast every 2s via WebSocket. Deviation detection with automatic rerouting.' },
    { icon: 'traffic',   title: 'Adaptive Signals',     desc: 'Traffic signals ahead of the ambulance flip GREEN automatically based on criticality threshold.' },
    { icon: 'robot',     title: 'ML ETA Predictor',     desc: 'A federated bias model learns from historical trip errors per time-of-day bucket.' },
    { icon: 'map',       title: 'Multi-Role Dashboards', desc: 'Separate live views for Ambulance, Hospital, Traffic Control, Public, and Control Room.' },
    { icon: 'hospital',  title: 'Smart Hospital Select', desc: 'Auto-selects the nearest reachable hospital by computing emergency cost across all routes.' },
    { icon: 'bell',      title: 'Driver Alerts',        desc: 'Audio beep pulses warn the driver when approaching an active signal zone about to clear.' },
];

const Home = ({ onGetStarted, setCurrentPage }) => {
    if (typeof window !== 'undefined') window.setCurrentPage = setCurrentPage;

    const aboutRef = useRef(null);
    const [hoveredPill, setHoveredPill] = useState(null);
    const [hoveredStat, setHoveredStat] = useState(null);

    const scrollToAbout = () => {
        aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const [splineVisible, setSplineVisible] = useState(true);

    useEffect(() => {
        const onScroll = () => {
            setSplineVisible(window.scrollY < window.innerHeight * 0.6);
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const PILLS = [
        { IconComp: SatelliteIcon, text: 'Live GPS Corridor',  color: '#ef4444', desc: 'Updates every 2 s' },
        { IconComp: TrafficLightIcon, text: 'Adaptive Signals', color: '#f59e0b', desc: 'Auto-flips to GREEN' },
        { IconComp: RobotIcon,     text: 'ML ETA Predictor',   color: '#8b5cf6', desc: 'Federated bias model' },
        { IconComp: MapIcon,       text: 'Multi-Role Views',   color: '#3b82f6', desc: '5 dashboard types' },
    ];

    const STATS = [
        { val: '5',   label: 'Roles',         sub: 'Ambulance · Hospital · Traffic · Public · Control Room', color: '#ef4444' },
        { val: '2s',  label: 'GPS Refresh',   sub: 'WebSocket broadcast interval', color: '#10b981' },
        { val: '<3min', label: 'Avg ETA Save', sub: 'vs. uncoordinated corridor',  color: '#f59e0b' },
    ];


    return (
        <div className="relative bg-black" style={{ minHeight: '200vh' }}>
            <style>{HOME_CSS}</style>

            {/* SPLINE — fixed, receives mouse events when hero is visible */}
            <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                opacity: splineVisible ? 0.8 : 0,
                transition: 'opacity 0.6s ease',
                pointerEvents: 'none',
            }}>
                <div style={{
                    transform: 'scale(1.15)',
                    transformOrigin: 'center',
                    marginLeft: '20rem',
                    marginTop: '1.25rem',
                    height: '100%',
                    pointerEvents: splineVisible ? 'auto' : 'none',
                }}>
                    <SplineErrorBoundary>
                    <Spline scene="https://prod.spline.design/dNxdAMewwoL839wi/scene.splinecode" />
                    </SplineErrorBoundary>
                </div>
            </div>

            {/* SECTION 1 — HERO */}
            <section style={{
                position: 'relative',
                zIndex: 10,
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                paddingTop: '12vh',
                padding: '12vh 4rem 0',
                pointerEvents: 'none',
            }}>
                <div style={{ maxWidth: '32rem', pointerEvents: 'auto' }}>

                    {/* Badge */}
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 home-fade-up"
                        style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', animationDelay:'0.1s', boxShadow:'0 0 18px rgba(239,68,68,0.2)' }}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-red-400 text-xs font-semibold uppercase tracking-widest">
                            Emergency Corridor System
                        </span>
                    </div>

                    {/* Title */}
                    <h1
                        className="text-white font-black leading-none mb-3 home-fade-up"
                        style={{ fontSize: '4.5rem', fontFamily: 'Georgia, serif', letterSpacing: '-0.02em', animationDelay:'0.2s', textShadow:'0 2px 40px rgba(239,68,68,0.15)' }}
                    >
                        Green<span style={{ color: '#ef4444', textShadow:'0 0 32px rgba(239,68,68,0.5)' }}>Note</span>
                    </h1>

                    {/* Description */}
                    <div className="home-fade-up mb-5" style={{ animationDelay:'0.3s' }}>
                        <p className="text-white/65 text-base leading-relaxed" style={{ fontSize:'1.05rem', lineHeight:1.75 }}>
                            Every second matters in an emergency. GreenNote is engineered to eliminate signal delays,
                            remove driver hesitation, and notify hospitals with precise ML-computed ETAs —
                            all in real time across 5 specialised dashboards, putting the right information
                            in the right hands — <span className="text-white/85 font-semibold">instantly.</span>
                        </p>
                    </div>

                    {/* Feature pills — row 1: GPS, Signals | row 2: ML ETA, Multi-Role */}
                    <div className="flex flex-col gap-2 mb-5 home-fade-up" style={{ animationDelay:'0.4s' }}>
                        {[PILLS.slice(0, 2), PILLS.slice(2)].map((row, ri) => (
                            <div key={ri} className="flex gap-2">
                                {row.map(f => (
                                    <span key={f.text}
                                        className="home-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-default"
                                        style={{
                                            background: hoveredPill === f.text ? `${f.color}22` : 'rgba(255,255,255,0.06)',
                                            border: `1px solid ${hoveredPill === f.text ? f.color+'77' : 'rgba(255,255,255,0.12)'}`,
                                            color: hoveredPill === f.text ? f.color : 'rgba(255,255,255,0.65)',
                                            boxShadow: hoveredPill === f.text ? `0 0 14px ${f.color}44` : 'none',
                                            transition: 'all 0.22s ease',
                                        }}
                                        onMouseEnter={() => setHoveredPill(f.text)}
                                        onMouseLeave={() => setHoveredPill(null)}
                                    >
                                        <span className="flex-shrink-0"><f.IconComp size={14} color={hoveredPill === f.text ? f.color : 'rgba(255,255,255,0.65)'} /></span>
                                        <span>{f.text}</span>
                                        {hoveredPill === f.text && <span style={{ color: f.color, opacity:0.7 }}>· {f.desc}</span>}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Stats row */}
                    <div className="flex gap-6 mb-5 home-fade-up" style={{ animationDelay:'0.5s' }}>
                        {STATS.map((s, i) => (
                            <div key={s.label} className="home-stat cursor-default relative"
                                onMouseEnter={() => setHoveredStat(i)}
                                onMouseLeave={() => setHoveredStat(null)}
                            >
                                <p className="home-stat-val font-black text-2xl leading-none transition-all duration-300"
                                    style={{ color: s.color, textShadow: hoveredStat === i ? `0 0 20px ${s.color}` : 'none' }}>
                                    {s.val}
                                </p>
                                <p className="text-white/60 text-xs font-semibold mt-0.5">{s.label}</p>
                                {hoveredStat === i && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 'calc(100% + 10px)',
                                        whiteSpace: 'nowrap',
                                        background: 'rgba(10,10,20,0.92)',
                                        border: `1px solid ${s.color}44`,
                                        borderRadius: 8,
                                        padding: '5px 10px',
                                        pointerEvents: 'none',
                                        zIndex: 50,
                                        boxShadow: `0 0 12px ${s.color}22`,
                                    }}>
                                        <p className="text-white/50 text-xs" style={{ lineHeight: 1.4 }}>{s.sub}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-5 mt-3 mb-2 w-full items-start">

                        {/* About Us */}
                        <button
                            onClick={scrollToAbout}
                            onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--gx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--gy', `${e.clientY - r.top}px`); }}
                            onMouseLeave={(e) => { e.currentTarget.style.setProperty('--gx', '200%'); e.currentTarget.style.setProperty('--gy', '200%'); }}
                            className="group flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white font-bold text-base transition-all duration-300 hover:scale-105 relative overflow-hidden w-80 self-start"
                            style={{
                                background: 'radial-gradient(circle at var(--gx,200%) var(--gy,200%), rgba(244,114,182,0.50) 0%, transparent 55%), rgba(244,114,182,0.08)',
                                border: '1px solid rgba(244,114,182,0.35)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 0 24px rgba(244,114,182,0.20), 0 8px 32px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.12)',
                            }}
                        >
                            {/* icon badge */}
                            <span className="relative z-10 flex items-center justify-center w-8 h-8 rounded-xl shrink-0" style={{ background: 'rgba(244,114,182,0.20)', border: '1px solid rgba(244,114,182,0.35)' }}>
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(244,114,182,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                            </span>
                            <span className="relative z-10 tracking-wide">About Us</span>
                            {/* animated chevron */}
                            <svg className="w-4 h-4 ml-auto relative z-10 text-pink-300 group-hover:translate-y-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                            {/* shimmer top-edge */}
                            <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-pink-300/60 to-transparent" />
                            {/* corner glow orb */}
                            <span className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" style={{ background: 'rgba(244,114,182,0.6)' }} />
                        </button>

                        {/* Login + Sign Up */}
                        <div className="flex gap-4">
                            {/* Login */}
                            <button
                                onClick={() => window.setCurrentPage && window.setCurrentPage('login')}
                                onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--gx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--gy', `${e.clientY - r.top}px`); }}
                                onMouseLeave={(e) => { e.currentTarget.style.setProperty('--gx', '200%'); e.currentTarget.style.setProperty('--gy', '200%'); }}
                                className="group flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl text-white font-bold text-base transition-all duration-300 hover:scale-105 relative overflow-hidden w-44"
                                style={{
                                    background: 'radial-gradient(circle at var(--gx,200%) var(--gy,200%), rgba(59,130,246,0.55) 0%, transparent 55%), rgba(59,130,246,0.08)',
                                    border: '1px solid rgba(59,130,246,0.35)',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 0 24px rgba(59,130,246,0.22), 0 8px 32px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.12)',
                                }}
                            >
                                <span className="relative z-10 flex items-center justify-center w-7 h-7 rounded-lg shrink-0" style={{ background: 'rgba(59,130,246,0.20)', border: '1px solid rgba(59,130,246,0.35)' }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="rgba(96,165,250,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                                    </svg>
                                </span>
                                <span className="relative z-10 tracking-wide">Login</span>
                                <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/60 to-transparent" />
                                <span className="absolute -right-3 -bottom-3 w-12 h-12 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" style={{ background: 'rgba(59,130,246,0.7)' }} />
                            </button>

                            {/* Sign Up */}
                            <button
                                onClick={() => window.setCurrentPage && window.setCurrentPage('signup')}
                                onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--gx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--gy', `${e.clientY - r.top}px`); }}
                                onMouseLeave={(e) => { e.currentTarget.style.setProperty('--gx', '200%'); e.currentTarget.style.setProperty('--gy', '200%'); }}
                                className="group flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl text-white font-bold text-base transition-all duration-300 hover:scale-105 relative overflow-hidden w-44"
                                style={{
                                    background: 'radial-gradient(circle at var(--gx,200%) var(--gy,200%), rgba(239,68,68,0.55) 0%, transparent 55%), rgba(239,68,68,0.08)',
                                    border: '1px solid rgba(239,68,68,0.35)',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 0 24px rgba(239,68,68,0.22), 0 8px 32px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.12)',
                                }}
                            >
                                <span className="relative z-10 flex items-center justify-center w-7 h-7 rounded-lg shrink-0" style={{ background: 'rgba(239,68,68,0.20)', border: '1px solid rgba(239,68,68,0.35)' }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="rgba(252,165,165,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                                    </svg>
                                </span>
                                <span className="relative z-10 tracking-wide">Sign Up</span>
                                <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-red-300/60 to-transparent" />
                                <span className="absolute -right-3 -bottom-3 w-12 h-12 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" style={{ background: 'rgba(239,68,68,0.7)' }} />
                            </button>
                        </div>
                    </div>

                    <p className="text-white/25 text-xs mt-4">Select a role after login to access your live dashboard.</p>

                </div>
            </section>

            {/* SECTION 2 — ABOUT US */}
            <section
                ref={aboutRef}
                style={{
                    position: 'relative',
                    zIndex: 10,
                    minHeight: '100vh',
                    padding: '7rem 4rem 5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(6,4,18,0.92) 8%, rgba(6,4,18,0.97) 100%)',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative background orbs */}
                <span className="about-orb pointer-events-none select-none" style={{ position:'absolute', top:'8%', right:'6%', width:'420px', height:'420px', borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)', filter:'blur(40px)', zIndex:0 }} />
                <span className="about-orb-2 pointer-events-none select-none" style={{ position:'absolute', bottom:'10%', left:'2%', width:'320px', height:'320px', borderRadius:'50%', background:'radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 70%)', filter:'blur(36px)', zIndex:0 }} />
                <span className="pointer-events-none select-none" style={{ position:'absolute', top:'40%', left:'30%', width:'260px', height:'260px', borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)', filter:'blur(30px)', zIndex:0 }} />

                {/* Heading */}
                <div className="relative z-10 mb-10">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
                        style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.35)', boxShadow: '0 0 20px rgba(139,92,246,0.15)' }}
                    >
                        <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                        <span className="text-violet-300 text-xs font-bold uppercase tracking-widest">Who We Are</span>
                    </div>
                    <h2 className="font-black mb-1" style={{ fontSize: '3.8rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                        <span className="text-white">About </span>
                        <span className="shimmer-text">GreenNote</span>
                    </h2>
                    <div className="w-24 h-1 rounded-full mb-5 mt-3" style={{ background: 'linear-gradient(90deg,#8b5cf6,#3b82f6,#10b981)' }} />
                    <p className="text-white/55 text-base leading-relaxed" style={{ maxWidth: '38rem' }}>
                        GreenNote is a smart emergency green corridor management system built to give ambulances an unobstructed path to hospitals.
                        It combines{' '}
                        <span className="text-violet-300 font-semibold">real-time GPS tracking</span>,{' '}
                        <span className="text-green-400 font-semibold">adaptive signal control</span>,{' '}
                        <span className="text-blue-400 font-semibold">multi-role live dashboards</span>, and a{' '}
                        <span className="text-yellow-400 font-semibold">federated ML model</span>{' '}
                        for precise ETA prediction — all working together to save the minutes that matter most.
                    </p>
                </div>

                {/* Stats strip */}
                <div className="relative z-10 flex gap-5 mb-12" style={{ maxWidth: '52rem' }}>
                    {[
                        { val: '5', label: 'User Roles', color: '#8b5cf6' },
                        { val: '2s', label: 'GPS Update Rate', color: '#10b981' },
                        { val: 'ML', label: 'ETA Predictor', color: '#3b82f6' },
                        { val: '100%', label: 'Real-Time', color: '#f59e0b' },
                    ].map(s => (
                        <div key={s.label} className="flex-1 rounded-2xl px-5 py-4 flex flex-col gap-1"
                            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${s.color}28`, backdropFilter: 'blur(12px)', boxShadow: `0 0 18px ${s.color}12` }}>
                            <span className="font-black text-2xl" style={{ color: s.color }}>{s.val}</span>
                            <span className="text-white/45 text-xs font-medium tracking-wide">{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* Feature cards */}
                <div className="relative z-10 mb-14" style={{ maxWidth: '52rem' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <h3 className="text-white font-bold text-xl">What We Built</h3>
                        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.12), transparent)' }} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { icon: 'satellite', title: 'Live GPS Corridor',     desc: 'Ambulance position broadcast every 2s via WebSocket. Deviation detection with automatic rerouting.', color: '#10b981' },
                            { icon: 'traffic',   title: 'Adaptive Signals',      desc: 'Traffic signals ahead of the ambulance flip GREEN automatically based on criticality threshold.',  color: '#f59e0b' },
                            { icon: 'hospital',  title: 'Smart Hospital Select', desc: 'Auto-selects the nearest reachable hospital by computing emergency cost across all routes.',        color: '#ef4444' },
                            { icon: 'map',       title: 'Multi-Role Dashboards', desc: 'Separate live views for Ambulance, Hospital, Traffic Control, Public, and Control Room.',          color: '#3b82f6' },
                            { icon: 'robot',     title: 'ML ETA Predictor',      desc: 'A federated bias model learns from historical trip errors per time-of-day bucket.',               color: '#8b5cf6' },
                            { icon: 'bell',      title: 'Driver Alerts',         desc: 'Audio beep pulses warn the driver when approaching an active signal zone about to clear.',          color: '#f43f5e' },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="home-feature-card rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden"
                                style={{
                                    background: `rgba(255,255,255,0.04)`,
                                    border: `1px solid ${item.color}25`,
                                    backdropFilter: 'blur(14px)',
                                    transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                                    cursor: 'default',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)';
                                    e.currentTarget.style.boxShadow = `0 8px 32px ${item.color}30, 0 0 0 1px ${item.color}40`;
                                    e.currentTarget.style.borderColor = `${item.color}55`;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = `${item.color}25`;
                                }}
                            >
                                {/* Top shimmer line */}
                                <span className="absolute inset-x-6 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${item.color}60, transparent)` }} />
                                {/* Icon badge */}
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl"
                                    style={{ background: `${item.color}18`, border: `1px solid ${item.color}35` }}>
                                    <Icon name={item.icon} size={22} color={item.color} />
                                </div>
                                <p className="text-white font-bold text-sm">{item.title}</p>
                                <p className="text-white/45 text-xs leading-relaxed">{item.desc}</p>
                                {/* corner orb */}
                                <span className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full blur-2xl opacity-30" style={{ background: item.color }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <h3 className="text-white font-bold text-xl">The Team</h3>
                        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.12), transparent)' }} />
                    </div>
                    <div className="flex gap-4 flex-wrap">
                        {TEAM.map(member => (
                            <div
                                key={member.name}
                                className="group rounded-2xl p-4 flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 relative overflow-hidden"
                                style={{
                                    background: `rgba(255,255,255,0.04)`,
                                    border: `1px solid ${member.color}30`,
                                    backdropFilter: 'blur(14px)',
                                    minWidth: '130px',
                                    flex: '1 0 130px',
                                    maxWidth: '155px',
                                    boxShadow: `0 0 0px ${member.color}00`,
                                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 28px ${member.color}30`; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 0px ${member.color}00`; }}
                            >
                                {/* Avatar with double ring */}
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center"
                                        style={{ background: `${member.color}18`, border: `2px solid ${member.color}55`, boxShadow: `0 0 16px ${member.color}30` }}>
                                        <UserIcon size={26} color={member.color} />
                                    </div>
                                    <span className="absolute -inset-1 rounded-full border opacity-30" style={{ borderColor: member.color }} />
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-bold text-sm">{member.name}</p>
                                    <p className="text-white/40 text-xs mt-1 leading-snug">{member.role}</p>
                                </div>
                                <div className="w-8 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${member.color}, transparent)` }} />
                                <span className="absolute -bottom-5 -right-5 w-16 h-16 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: member.color }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Back to top */}
                <div className="relative z-10 mt-16 flex items-center gap-4">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--gx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--gy', `${e.clientY - r.top}px`); }}
                        onMouseLeave={(e) => { e.currentTarget.style.setProperty('--gx', '200%'); e.currentTarget.style.setProperty('--gy', '200%'); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white/70 text-sm font-semibold hover:text-white transition-all duration-200 hover:scale-105 relative overflow-hidden"
                        style={{ background: 'radial-gradient(circle at var(--gx,200%) var(--gy,200%), rgba(139,92,246,0.35) 0%, transparent 55%), rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.30)', backdropFilter: 'blur(14px)', boxShadow: '0 0 16px rgba(139,92,246,0.15)' }}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                        </svg>
                        Back to top
                    </button>
                    <span className="text-white/20 text-xs">or use the Navbar to launch your dashboard</span>
                </div>

            </section>

        </div>
    );
};

export default Home;
