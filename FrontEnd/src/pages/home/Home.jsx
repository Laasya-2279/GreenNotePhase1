import React, { useRef, useState, useEffect } from 'react'
import Spline from '@splinetool/react-spline';

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
  .home-fade-up  { animation: homeFadeUp 0.7s ease both; }
  .home-pill:hover { transform: translateY(-2px) scale(1.07); }
  .home-stat:hover .home-stat-val { text-shadow: 0 0 18px currentColor; }
  .home-feature-card:hover { transform: translateY(-4px) scale(1.03); }
`;

const TEAM = [
    { name: 'Laasya',  role: 'Backend & Algorithms',     avatar: '👩‍💼', color: '#f59e0b' },
    { name: 'Aariyan', role: 'ML & ETA Prediction',  avatar: '👨‍💼', color: '#8b5cf6' },
    { name: 'Mathew', role: 'Datasets',  avatar: '👨‍🔧', color: '#10b981' },
    { name: 'Miamin', role: 'UI/UX',   avatar: '👩‍💻', color: '#f43f5e' },
    { name: 'Nousheen', role: 'Frontend', avatar: '👩‍💻', color: '#38bdf8' },
];

const FEATURES = [
    { icon: '🛰', title: 'Live GPS Corridor',    desc: 'Ambulance position broadcast every 2s via WebSocket. Deviation detection with automatic rerouting.' },
    { icon: '🚦', title: 'Adaptive Signals',      desc: 'Traffic signals ahead of the ambulance flip GREEN automatically based on criticality threshold.' },
    { icon: '🤖', title: 'ML ETA Predictor',      desc: 'A federated bias model learns from historical trip errors per time-of-day bucket.' },
    { icon: '🗺', title: 'Multi-Role Dashboards', desc: 'Separate live views for Ambulance, Hospital, Traffic Control, Public, and Control Room.' },
    { icon: '🏥', title: 'Smart Hospital Select', desc: 'Auto-selects the nearest reachable hospital by computing emergency cost across all routes.' },
    { icon: '🔔', title: 'Driver Alerts',         desc: 'Audio beep pulses warn the driver when approaching an active signal zone about to clear.' },
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
        { icon: '🛰', text: 'Live GPS Corridor',    color: '#ef4444', desc: 'Updates every 2 s' },
        { icon: '🚦', text: 'Adaptive Signals',      color: '#f59e0b', desc: 'Auto-flips to GREEN' },
        { icon: '🤖', text: 'ML ETA Predictor',      color: '#8b5cf6', desc: 'Federated bias model' },
        { icon: '🗺', text: 'Multi-Role Views',       color: '#3b82f6', desc: '5 dashboard types' },
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

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-2 mb-5 home-fade-up" style={{ animationDelay:'0.4s' }}>
                        {PILLS.map(f => (
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
                                <span>{f.icon}</span>
                                <span>{f.text}</span>
                                {hoveredPill === f.text && <span style={{ color: f.color, opacity:0.7 }}>· {f.desc}</span>}
                            </span>
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
                    <div className="flex flex-col gap-4 mt-3 mb-2 w-full items-start">

                        {/* About Us */}
                        <button
                            onClick={scrollToAbout}
                            className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-bold text-base transition-all duration-200 hover:scale-105 shadow-lg relative overflow-hidden w-80 self-start"
                            style={{
                                background: 'linear-gradient(135deg, #f43f5e, #a21caf)',
                                boxShadow: '0 8px 32px rgba(244,63,94,0.25)',
                            }}
                        >
                            <span className="relative z-10">About Us</span>
                            <svg
                                className="w-4 h-4 ml-auto relative z-10 animate-bounce"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/10 rounded-full blur-md group-hover:scale-125 transition-transform" />
                        </button>

                        {/* Login + Sign Up */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => window.setCurrentPage && window.setCurrentPage('login')}
                                className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-bold text-base transition-all duration-200 hover:scale-105 shadow-lg relative overflow-hidden w-40"
                                style={{
                                    background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                                    boxShadow: '0 8px 32px rgba(16,185,129,0.25)',
                                }}
                            >
                                <span className="relative z-10">Login</span>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/10 rounded-full blur-md group-hover:scale-125 transition-transform" />
                            </button>
                            <button
                                onClick={() => window.setCurrentPage && window.setCurrentPage('signup')}
                                className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-bold text-base transition-all duration-200 hover:scale-105 shadow-lg relative overflow-hidden w-40"
                                style={{
                                    background: 'linear-gradient(135deg, #8b5cf6, #f59e0b)',
                                    boxShadow: '0 8px 32px rgba(139,92,246,0.25)',
                                }}
                            >
                                <span className="relative z-10">Sign Up</span>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/10 rounded-full blur-md group-hover:scale-125 transition-transform" />
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
                    padding: '6rem 4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.82) 8%, rgba(0,0,0,0.88) 100%)',
                }}
            >
                {/* Heading */}
                <div className="mb-12">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                        style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                        <span className="text-violet-400 text-xs font-semibold uppercase tracking-widest">Who We Are</span>
                    </div>
                    <h2
                        className="text-white font-black mb-3"
                        style={{ fontSize: '3rem', fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}
                    >
                        About <span style={{ color: '#8b5cf6' }}>GreenNote</span>
                    </h2>
                    <p className="text-white/50 text-base leading-relaxed" style={{ maxWidth: '36rem' }}>
                        GreenNote is a smart emergency green corridor management system built to give ambulances an unobstructed path to hospitals.
                        It combines <span className="text-violet-400 font-medium">real-time GPS tracking</span>, <span className="text-green-400 font-medium">adaptive signal control</span>,
                        <span className="text-blue-400 font-medium"> multi-role live dashboards</span>, and a <span className="text-yellow-400 font-medium">federated ML model</span> for
                        precise ETA prediction — all working together to save the minutes that matter most.
                    </p>
                </div>

                {/* Feature cards */}
                <div className="mb-14" style={{ maxWidth: '52rem' }}>
                    <h3 className="text-white font-bold text-xl mb-6">What We Built</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {FEATURES.map((item, i) => (
                            <div
                                key={item.title}
                                className="home-feature-card rounded-2xl p-5 flex flex-col gap-3"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                                    cursor: 'default',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                }}
                            >
                                <span style={{ fontSize: '1.75rem' }}>{item.icon}</span>
                                <p className="text-white font-semibold text-sm">{item.title}</p>
                                <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team */}
                <div>
                    <h3 className="text-white font-bold text-xl mb-6">The Team</h3>
                    <div className="flex gap-5 justify-start items-stretch" style={{flexWrap: 'nowrap', overflowX: 'auto'}}>
                        {TEAM.map(member => (
                            <div
                                key={member.name}
                                className="rounded-2xl p-3 flex items-center gap-3 transition-transform hover:scale-105"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${member.color}30`,
                                    minWidth: '140px',
                                    flex: '1 0 140px',
                                    maxWidth: '160px',
                                }}
                            >
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                                    style={{ background: `${member.color}20`, border: `2px solid ${member.color}50` }}
                                >
                                    {member.avatar}
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">{member.name}</p>
                                    <p className="text-white/40 text-xs mt-0.5">{member.role}</p>
                                    <div className="w-4 h-0.5 rounded-full mt-2" style={{ background: member.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Back to top */}
                <div className="mt-16 flex items-center gap-3">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white/60 text-sm font-medium hover:text-white transition-colors"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
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
