import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import L from 'leaflet'
import { useState, useEffect, useRef } from 'react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const makeIcon = (emoji, size = 34) => L.divIcon({
    html: `<div style="font-size:${size}px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));">${emoji}</div>`,
    className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2]
});
const signalIcon = (state) => L.divIcon({
    html: `<div style="font-size:28px;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));">${state === 'GREEN' ? '🟢' : '🔴'}</div>`,
    className: '', iconSize: [28, 28], iconAnchor: [14, 14]
});

const ROLE_CONFIGS = {
    ambulance:    { label: 'Ambulance Driver',  icon: '🚑', accent: '#ef4444' },
    hospital:     { label: 'Hospital',          icon: '🏥', accent: '#10b981' },
    traffic:      { label: 'Traffic Control',   icon: '🚦', accent: '#f59e0b' },
    public:       { label: 'Public / Driver',   icon: '🚗', accent: '#3b82f6' },
    control_room: { label: 'Control Room',      icon: '🖥️', accent: '#8b5cf6' },
};

const STORAGE_KEY = 'greennote_corridor_v1';
const saveSyncState = async (data) => { try { await window.storage.set(STORAGE_KEY, JSON.stringify(data), true); } catch {} };
const getSyncState = async () => { try { const r = await window.storage.get(STORAGE_KEY, true); return r ? JSON.parse(r.value) : null; } catch { return null; } };

const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371000, dLat = (lat2-lat1)*Math.PI/180, dLon = (lon2-lon1)*Math.PI/180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

const HOSPITALS = [
    { id: 'H1', name: 'Lisie Hospital',  route: [[9.9908649,76.3021516],[9.9911956,76.3021332],[9.9930340,76.3018243],[9.9954740,76.3014861],[9.9960327,76.3013843],[10.000012,76.299828],[10.000501,76.299491],[9.999308,76.297643],[9.998461,76.296715],[9.996584,76.294248],[9.994999,76.292152],[9.992308,76.289544],[9.990960,76.287916],[9.989032,76.288637],[9.988078,76.288166]] },
    { id: 'H2', name: 'Aster Medcity',   route: [] },
    { id: 'H3', name: 'Renai Medicity',  route: [] },
];

const INIT_SIGNALS = [
    { id: 1, name: 'Signal Alpha',   position: [9.9954740, 76.3014861], state: 'RED' },
    { id: 2, name: 'Signal Beta',    position: [9.992308,  76.289544],  state: 'RED' },
    { id: 3, name: 'Signal Gamma',   position: [9.994999,  76.292152],  state: 'RED' },
    { id: 4, name: 'Signal Delta',   position: [9.985764,  76.281511],  state: 'RED' },
    { id: 5, name: 'Signal Epsilon', position: [9.990960,  76.287916],  state: 'RED' },
];
const INIT_CARS = [
    { id: 1, position: [9.995211, 76.301557], movedAside: false },
    { id: 2, position: [9.995467, 76.292663], movedAside: false },
    { id: 3, position: [9.992654, 76.289889], movedAside: false },
    { id: 4, position: [9.985862, 76.281859], movedAside: false },
];
const CENTER = [9.9930419, 76.3017048];

const StatCard = ({ label, value, sub, accent, icon }) => (
    <div className="rounded-xl p-3.5 flex flex-col gap-1" style={{ background:'rgba(255,255,255,0.05)', border:`1px solid ${accent}30` }}>
        <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color:`${accent}cc` }}>{label}</span>
            {icon && <span className="text-base">{icon}</span>}
        </div>
        <div className="text-white font-bold text-lg leading-tight">{value}</div>
        {sub && <div className="text-white/40 text-xs">{sub}</div>}
    </div>
);

const AmbulanceDashboard = ({ criticality, setCriticality, eta, arrived, hospitalETAs, onAutoSelect, onReset, onEnableAudio, isMaster, setIsMaster, deviceId, user }) => {
    const accent = '#ef4444';
    const [dutyStatus, setDutyStatus] = useState('ON CALL');
    const dutyColors = { 'AVAILABLE':'#10b981', 'ON CALL':'#ef4444', 'AT HOSPITAL':'#3b82f6', 'OFF DUTY':'#6b7280' };
    const critColor = criticality==='VERY CRITICAL'?'#ef4444':criticality==='CRITICAL'?'#f59e0b':'#10b981';
    return (
        <div className="flex flex-col gap-3">

            {/* ── Driver identity card ── */}
            <div className="rounded-2xl p-4 relative overflow-hidden"
                style={{ background:'linear-gradient(135deg,rgba(239,68,68,0.14),rgba(239,68,68,0.05))', border:'1px solid rgba(239,68,68,0.25)' }}>
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
                    style={{ background:'radial-gradient(circle,rgba(239,68,68,0.18),transparent 70%)', transform:'translate(30%,-30%)' }} />
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background:'linear-gradient(135deg,#ef4444,#7f1d1d)', boxShadow:'0 4px 16px rgba(239,68,68,0.4)' }}>🚑</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-extrabold text-sm leading-tight truncate">{user?.name || 'Ambulance Driver'}</p>
                        <p className="text-white/45 text-xs truncate">{user?.email || 'driver@greennote.in'}</p>
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                        style={{ background:`${dutyColors[dutyStatus]}20`, color: dutyColors[dutyStatus], border:`1px solid ${dutyColors[dutyStatus]}40` }}>
                        ● {dutyStatus}
                    </span>
                    {user?.vehicleNumber && (
                        <span className="text-xs px-2.5 py-1 rounded-full font-mono text-white/60"
                            style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)' }}>
                            🚗 {user.vehicleNumber}
                        </span>
                    )}
                </div>
            </div>

            {/* ── Arrived banner ── */}
            {arrived && (
                <div className="rounded-xl p-3 text-center animate-pulse"
                    style={{ background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)' }}>
                    <p className="text-emerald-400 font-bold text-sm">✅ Destination Reached</p>
                    <p className="text-emerald-400/60 text-xs mt-0.5">Handover patient to receiving team</p>
                </div>
            )}

            {/* ── Live ETA hero ── */}
            <div className="rounded-2xl p-4 text-center relative overflow-hidden"
                style={{ background:`linear-gradient(135deg,${critColor}18,${critColor}06)`, border:`1px solid ${critColor}35` }}>
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background:`radial-gradient(circle at 50% 0%,${critColor}22,transparent 65%)` }} />
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color:`${critColor}99` }}>ETA to Destination</p>
                <div className="text-4xl font-black text-white leading-none mb-1">{arrived?'✅':eta}</div>
                {!arrived && <div className="flex items-center justify-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full animate-ping" style={{ background: critColor }} />
                    <span className="text-xs font-medium" style={{ color:`${critColor}99` }}>EN ROUTE</span>
                </div>}
            </div>

            {/* ── Patient criticality ── */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background:`${critColor}12`, border:`1px solid ${critColor}35` }}>
                <span className="text-2xl">{criticality==='VERY CRITICAL'?'🔴':criticality==='CRITICAL'?'🟠':'🟢'}</span>
                <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider font-bold">Patient Criticality</p>
                    <p className="text-base font-black" style={{ color: critColor }}>{criticality}</p>
                </div>
                <div className="ml-auto w-2.5 h-2.5 rounded-full animate-ping" style={{ background: critColor, opacity:0.7 }} />
            </div>

            {/* ── Today's stats ── */}
            <div className="grid grid-cols-2 gap-2">
                <StatCard label="Trips Today" value="3" icon="🗺️" sub="Last: 2h ago" accent={accent} />
                <StatCard label="Avg Response" value="4m 12s" icon="⚡" sub="This week" accent={accent} />
                <StatCard label="Distance" value="47 km" icon="📍" sub="Driven today" accent={accent} />
                <StatCard label="Corridor Score" value="98%" icon="🏆" sub="Clearance rate" accent={accent} />
            </div>

            {/* ── Duty status ── */}
            <div className="rounded-xl p-3" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">Duty Status</p>
                <div className="grid grid-cols-2 gap-1.5">
                    {['AVAILABLE','ON CALL','AT HOSPITAL','OFF DUTY'].map(s => (
                        <button key={s} onClick={() => setDutyStatus(s)}
                            className="py-1.5 px-2 rounded-lg text-xs font-bold transition-all"
                            style={{
                                background: dutyStatus===s?`${dutyColors[s]}25`:'rgba(255,255,255,0.05)',
                                border: dutyStatus===s?`1px solid ${dutyColors[s]}60`:'1px solid rgba(255,255,255,0.08)',
                                color: dutyStatus===s?dutyColors[s]:'rgba(255,255,255,0.45)',
                            }}>{s}</button>
                    ))}
                </div>
            </div>

            {/* ── Set criticality ── */}
            <div className="border-t border-white/10 pt-3">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">Set Patient Criticality</p>
                <div className="flex gap-2 flex-wrap">
                    {['STABLE','CRITICAL','VERY CRITICAL'].map(c => (
                        <button key={c} onClick={() => setCriticality(c)} className="flex-1 py-1.5 text-xs font-bold rounded-lg transition-all"
                            style={{ background: criticality===c?(c==='STABLE'?'#065f46':c==='CRITICAL'?'#78350f':'#7f1d1d'):'rgba(255,255,255,0.06)', color:'white', border: criticality===c?'none':'1px solid rgba(255,255,255,0.1)' }}
                        >{c}</button>
                    ))}
                </div>
            </div>

            {/* ── Hospital ETAs ── */}
            {hospitalETAs.length > 0 && (
                <div className="border-t border-white/10 pt-3">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">Hospital ETAs</p>
                    {hospitalETAs.map(h => (
                        <div key={h.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                            <span className="text-sm text-white/70">🏥 {h.name}</span>
                            <span className="text-sm font-semibold" style={{ color: h.selected?'#10b981':'white' }}>{h.eta}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Actions ── */}
            <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
                <button onClick={onAutoSelect} className="w-full py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ background:'linear-gradient(135deg,#1d4ed8,#2563eb)' }}>🏥 Auto-Select Nearest Hospital</button>
                <button onClick={onEnableAudio} className="w-full py-2 rounded-xl text-xs font-semibold text-white/70"
                    style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)' }}>🔔 Enable Driver Alerts</button>
                <button onClick={onReset} className="w-full py-2 rounded-xl text-xs font-semibold text-red-400"
                    style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)' }}>↺ Reset Learning Model</button>
            </div>

            {/* ── Recent activity ── */}
            <div className="rounded-xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,0.08)' }}>
                <div className="px-3 py-2 border-b border-white/8" style={{ background:'rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/35">Recent Activity</p>
                </div>
                {[
                    { time:'10:42 AM', event:'Trip completed — Lisie Hospital',      dot:'#10b981' },
                    { time:'08:15 AM', event:'Route assigned — Aster Medcity',       dot:'#3b82f6' },
                    { time:'Yesterday',event:'Corridor score updated to 98%',        dot:'#f59e0b' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 border-b border-white/5 last:border-0">
                        <span className="text-xs text-white/30 w-16 flex-shrink-0 font-mono">{item.time}</span>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.dot }} />
                        <span className="text-xs text-white/60 leading-snug">{item.event}</span>
                    </div>
                ))}
            </div>

            {/* ── Device / Mode ── */}
            <div className="rounded-xl p-2.5" style={{ background:'rgba(255,255,255,0.04)' }}>
                <p className="text-xs text-white/30">Mode: <span className="text-white/60 font-medium">{isMaster?'MASTER':'FOLLOWER'}</span></p>
                <p className="text-xs text-white/30 mt-0.5">Device: <span className="text-white/50">{deviceId.substr(0,10)}</span></p>
                <button onClick={() => setIsMaster(!isMaster)} className="mt-2 text-xs text-white/40 hover:text-white/70 underline transition-colors">Switch to {isMaster?'Follower':'Master'}</button>
            </div>
        </div>
    );
};

const HospitalDashboard = ({ eta, criticality, arrived, signals }) => {
    const accent = '#10b981';
    const greenCount = signals.filter(s => s.state==='GREEN').length;
    const critColor = criticality==='VERY CRITICAL' ? '#ef4444' : criticality==='CRITICAL' ? '#f59e0b' : '#10b981';
    const critIcon  = criticality==='VERY CRITICAL' ? '🔴' : criticality==='CRITICAL' ? '🟠' : '🟢';

    // Mock organ info (in real app this comes from the active corridor)
    const organInfo = { icon: '🫀', name: 'Heart', viability: '4h', from: 'AIMS Medical', to: 'City General' };

    return (
        <div className="flex flex-col gap-4">

            {/* Arrived banner */}
            {arrived && (
                <div className="rounded-xl p-3 text-center animate-pulse" style={{ background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)' }}>
                    <p className="text-emerald-400 font-bold text-sm">🏥 Ambulance Arrived</p>
                    <p className="text-emerald-400/70 text-xs mt-0.5">Prepare receiving bay now</p>
                </div>
            )}

            {/* ETA — hero display */}
            <div className="rounded-2xl p-4 text-center relative overflow-hidden"
                style={{ background:`linear-gradient(135deg, ${critColor}18, ${critColor}08)`, border:`1px solid ${critColor}35` }}>
                <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(circle at 50% 0%, ${critColor}22, transparent 60%)` }} />
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color:`${critColor}99` }}>Incoming ETA</p>
                <div className="text-5xl font-black text-white leading-none mb-1">{arrived ? '✅' : eta}</div>
                {!arrived && <p className="text-xs font-medium" style={{ color:`${critColor}aa` }}>until ambulance arrives</p>}
            </div>

            {/* Criticality badge */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background:`${critColor}12`, border:`1px solid ${critColor}35` }}>
                <span className="text-2xl">{critIcon}</span>
                <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider font-bold">Patient Criticality</p>
                    <p className="text-base font-black" style={{ color: critColor }}>{criticality}</p>
                </div>
                <div className="ml-auto w-2.5 h-2.5 rounded-full animate-ping" style={{ background: critColor, opacity:0.7 }} />
            </div>

            {/* Organ being transported */}
            <div className="rounded-xl overflow-hidden" style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}>
                <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/40">Organ in Transit</span>
                </div>
                <div className="px-4 py-3 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                        style={{ background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)' }}>
                        {organInfo.icon}
                    </div>
                    <div className="flex-1">
                        <p className="text-lg font-black text-white leading-tight">{organInfo.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                style={{ background:'rgba(245,158,11,0.2)', color:'#fbbf24' }}>
                                ⏱ Viable {organInfo.viability}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-white/50">
                            <span>{organInfo.from}</span>
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <span className="text-white/80 font-semibold">{organInfo.to}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hospital prep status */}
            <div className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)' }}>
                <span className="text-xl">{arrived ? '✅' : '🏥'}</span>
                <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider font-bold">Preparation Status</p>
                    <p className="text-sm font-bold text-white">{arrived ? 'RECEIVING TEAM READY' : 'STANDBY — Awaiting Ambulance'}</p>
                </div>
            </div>

            {/* Corridor signals */}
            <div className="rounded-xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,0.08)' }}>
                <div className="px-4 py-2.5 border-b flex items-center justify-between" style={{ background:'rgba(255,255,255,0.04)', borderColor:'rgba(255,255,255,0.08)' }}>
                    <span className="text-xs font-bold uppercase tracking-wider text-white/40">Corridor Signals</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background:'rgba(16,185,129,0.2)', color:'#10b981' }}>
                        {greenCount}/{signals.length} GREEN
                    </span>
                </div>
                <div className="divide-y" style={{ borderColor:'rgba(255,255,255,0.05)' }}>
                    {signals.map(s => (
                        <div key={s.id} className="flex justify-between items-center px-4 py-2.5">
                            <span className="text-sm text-white/70">{s.name}</span>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.state==='GREEN'?'bg-emerald-500/20 text-emerald-400':'bg-red-500/20 text-red-400'}`}>{s.state}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const TrafficDashboard = ({ signals, criticality, eta }) => {
    const accent = '#f59e0b';
    const greenCount = signals.filter(s => s.state==='GREEN').length;
    return (
        <div className="flex flex-col gap-3">
            <StatCard label="Active Corridor" value={`${greenCount} signals GREEN`} icon="🟢" accent={accent} />
            <StatCard label="Ambulance ETA" value={eta} sub="Time to destination" icon="⏱️" accent={accent} />
            <StatCard label="Alert Level" value={criticality} icon={criticality==='VERY CRITICAL'?'🔴':criticality==='CRITICAL'?'🟠':'🟡'} accent={accent} />
            <div className="border-t border-white/10 pt-3">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">Signal Status</p>
                {signals.map(s => (
                    <div key={s.id} className="flex justify-between items-center py-2 border-b border-white/5">
                        <div>
                            <p className="text-sm text-white/80 font-medium">{s.name}</p>
                            <p className="text-xs text-white/40">{s.position[0].toFixed(4)}, {s.position[1].toFixed(4)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.state==='GREEN'?'bg-emerald-500/20 text-emerald-300':'bg-red-500/20 text-red-300'}`}>{s.state}</span>
                            {s.state==='GREEN' && <span className="text-xs text-emerald-400/60">Cleared 🚑</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PublicDashboard = ({ signals, criticality, cars }) => {
    const accent = '#3b82f6';
    const activeCorridor = signals.some(s => s.state==='GREEN');
    return (
        <div className="flex flex-col gap-5">
            {/* Status banner */}
            <div className="rounded-2xl p-5" style={{ background: activeCorridor?'rgba(239,68,68,0.18)':'rgba(16,185,129,0.1)', border:`1.5px solid ${activeCorridor?'rgba(239,68,68,0.45)':'rgba(16,185,129,0.35)'}` }}>
                <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0 animate-pulse" style={{ background: activeCorridor?'#f87171':'#34d399' }} />
                    <p className="text-base font-black uppercase tracking-wider" style={{ color: activeCorridor?'#f87171':'#34d399' }}>
                        {activeCorridor?'⚠️ EMERGENCY CORRIDOR ACTIVE':'✅ No Active Corridor'}
                    </p>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{activeCorridor?'Pull over immediately. Emergency vehicle is approaching. Do NOT re-enter the route until cleared.':'Normal traffic flow. No action required at this time.'}</p>
            </div>

            {/* Emergency level card — enlarged inline */}
            <div className="rounded-2xl p-5 flex flex-col gap-2" style={{ background:'rgba(255,255,255,0.05)', border:`1.5px solid ${accent}40` }}>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-widest" style={{ color:`${accent}cc` }}>Emergency Level</span>
                    <span className="text-2xl">{criticality==='VERY CRITICAL'?'🔴':'🟠'}</span>
                </div>
                <div className="text-white font-black text-2xl leading-tight">{criticality}</div>
            </div>

            {/* Safety notice */}
            <div className="rounded-2xl p-5" style={{ background:'rgba(59,130,246,0.1)', border:'1.5px solid rgba(59,130,246,0.3)' }}>
                <p className="text-sm font-bold text-blue-300 mb-2">📱 Public Safety Notice</p>
                <p className="text-sm text-white/55 leading-relaxed">When signals show GREEN, an emergency vehicle has priority. Move left and come to a complete stop until the ambulance passes.</p>
            </div>
        </div>
    );
};

const ControlRoomDashboard = ({ signals, criticality, setCriticality, eta, arrived, cars, isMaster, setIsMaster, onAutoSelect, onReset, deviceId, hospitalETAs }) => {
    const accent = '#8b5cf6';
    const greenCount = signals.filter(s => s.state==='GREEN').length;
    const carsCleared = cars.filter(c => c.movedAside).length;
    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
                <StatCard label="Status" value={arrived?'COMPLETE':'ACTIVE'} icon={arrived?'✅':'🟢'} accent={accent} />
                <StatCard label="ETA" value={eta} icon="⏱️" accent={accent} />
                <StatCard label="Signals" value={`${greenCount}/${signals.length} 🟢`} accent={accent} />
                <StatCard label="Vehicles" value={`${carsCleared}/${cars.length} cleared`} icon="🚗" accent={accent} />
            </div>
            <StatCard label="Alert Level" value={criticality} sub="Ambulance criticality" icon={criticality==='VERY CRITICAL'?'🔴':criticality==='CRITICAL'?'🟠':'🟡'} accent={accent} />
            <div className="border-t border-white/10 pt-3">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">Override Criticality</p>
                <div className="flex gap-2 flex-wrap">
                    {['STABLE','CRITICAL','VERY CRITICAL'].map(c => (
                        <button key={c} onClick={() => setCriticality(c)} className="flex-1 py-1.5 text-xs font-bold rounded-lg transition-all"
                            style={{ background: criticality===c?(c==='STABLE'?'#1d4ed8':c==='CRITICAL'?'#d97706':'#dc2626'):'rgba(255,255,255,0.07)', color:'white', border: criticality===c?'none':'1px solid rgba(255,255,255,0.1)' }}
                        >{c}</button>
                    ))}
                </div>
            </div>
            <div className="border-t border-white/10 pt-3">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">Signal Overview</p>
                {signals.map(s => (
                    <div key={s.id} className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-xs text-white/60">{s.name}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.state==='GREEN'?'bg-emerald-500/20 text-emerald-400':'bg-red-500/20 text-red-400'}`}>{s.state}</span>
                    </div>
                ))}
            </div>
            {hospitalETAs.length > 0 && (
                <div className="border-t border-white/10 pt-3">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">Hospital ETAs</p>
                    {hospitalETAs.map(h => (
                        <div key={h.id} className="flex justify-between items-center py-1.5 border-b border-white/5">
                            <span className="text-xs text-white/60">🏥 {h.name}</span>
                            <span className="text-xs font-semibold text-white/80">{h.eta}</span>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
                <button onClick={onAutoSelect} className="w-full py-2.5 rounded-xl text-sm font-bold text-white" style={{ background:'linear-gradient(135deg,#6d28d9,#7c3aed)' }}>🏥 Auto-Select Hospital</button>
                <button onClick={onReset} className="w-full py-2 rounded-xl text-xs font-semibold text-red-400" style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)' }}>↺ Reset Learning</button>
            </div>
            <div className="rounded-xl p-2.5" style={{ background:'rgba(255,255,255,0.04)' }}>
                <p className="text-xs text-white/30">Mode: <span className="text-white/60">{isMaster?'MASTER':'FOLLOWER'}</span> · ID: <span className="text-white/50">{deviceId.substr(0,8)}</span></p>
                <button onClick={() => setIsMaster(!isMaster)} className="mt-1.5 text-xs text-white/40 hover:text-white/70 underline transition-colors">Switch to {isMaster?'Follower':'Master'}</button>
            </div>
        </div>
    );
};

const LiveClock = ({ accent }) => {
    const [t, setT] = useState(() => new Date().toLocaleTimeString());
    useEffect(() => {
        const id = setInterval(() => setT(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(id);
    }, []);
    return (
        <span style={{ marginLeft:'auto', color: accent, fontSize:11, fontFamily:'monospace', fontWeight:700, letterSpacing:'0.06em', textShadow:`0 0 8px ${accent}88` }}>{t}</span>
    );
};

function MapView({ role = 'ambulance', user = null, setCurrentPage, onLogout = null }) {
    const cfg = ROLE_CONFIGS[role] || ROLE_CONFIGS.ambulance;
    const ROLE_DASHBOARD = {
        ambulance:    'ambulance-dashboard',
        hospital:     'hospital-dashboard',
        traffic:      'traffic-dashboard',
        public:       'public-dashboard',
        control_room: 'controlroom-dashboard',
    };
    const backPage = ROLE_DASHBOARD[role] || 'home';
    const [criticality, setCriticality] = useState('CRITICAL');
    const [signals, setSignals] = useState(INIT_SIGNALS);
    const [cars, setCars] = useState(INIT_CARS);
    const [route, setRoute] = useState([]);
    const [segmentIndex, setSegmentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(CENTER);
    const [arrived, setArrived] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [hospitalETAs, setHospitalETAs] = useState([]);
    const [etaBias, setEtaBias] = useState({ morning:0, afternoon:0, night:0 });
    const [initialETA, setInitialETA] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [etaLogged, setEtaLogged] = useState(false);
    const [isMaster, setIsMaster] = useState(role==='ambulance'||role==='control_room');
    const [deviceId] = useState(() => `device_${Math.random().toString(36).substr(2,9)}`);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const audioCtxRef = useRef(null);
    const beepRef = useRef(null);

    const AMBULANCE_SPEED = 12;
    const getThreshold = () => criticality==='STABLE'?40:criticality==='CRITICAL'?80:200;
    const getTimeBucket = () => { const h=new Date().getHours(); return h<10?'morning':h<18?'afternoon':'night'; };
    const getDelayTime = () => criticality==='STABLE'?10:criticality==='CRITICAL'?5:2;

    const getDistance = () => {
        let d=0; if(!route.length) return 0;
        if(segmentIndex<route.length-1) d+=haversine(currentPosition[0],currentPosition[1],route[segmentIndex+1][0],route[segmentIndex+1][1]);
        for(let i=segmentIndex+1;i<route.length-1;i++) d+=haversine(route[i][0],route[i][1],route[i+1][0],route[i+1][1]);
        return d;
    };

    const getRedSignalCount = () => {
        const rem=getDistance();
        return signals.filter(s => { const d=haversine(currentPosition[0],currentPosition[1],s.position[0],s.position[1]); return d<=rem&&s.state==='RED'; }).length;
    };

    const getETASeconds = () => {
        const rem=getDistance(), travel=rem/AMBULANCE_SPEED, delay=getRedSignalCount()*getDelayTime(), bias=etaBias[getTimeBucket()];
        return Math.max(0,Math.round(travel+delay+bias));
    };

    const formatETA = (s) => { if(arrived) return 'Arrived'; const m=Math.floor(s/60),sec=s%60; return `${m}m ${sec}s`; };

    const computeETAForRoute = (r,bias=etaBias) => {
        if(!r||r.length<2) return Infinity;
        let d=0; for(let i=0;i<r.length-1;i++) d+=haversine(r[i][0],r[i][1],r[i+1][0],r[i+1][1]);
        return Math.round(d/AMBULANCE_SPEED+signals.filter(s=>s.state==='RED').length*getDelayTime()+bias[getTimeBucket()]);
    };

    const triggerBeep = () => {
        try {
            if(!audioCtxRef.current) audioCtxRef.current=new(window.AudioContext||window.webkitAudioContext)();
            const ctx=audioCtxRef.current;
            if(ctx.state==='suspended') ctx.resume();
            const osc=ctx.createOscillator(), gain=ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.frequency.value=800; osc.type='sine';
            gain.gain.setValueAtTime(0.5,ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.3);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.3);
        } catch(e){}
    };

    const hasArrived = () => {
        if(!route||!route.length) return false;
        const [endLat,endLng]=route[route.length-1];
        return haversine(currentPosition[0],currentPosition[1],endLat,endLng)<=15;
    };

    // Master broadcast
    useEffect(() => {
        if(!isMaster||!route.length) return;
        const broadcast = async () => {
            const threshold=getThreshold();
            const nearbySignals=signals.filter(s=>{ const d=haversine(currentPosition[0],currentPosition[1],s.position[0],s.position[1]); return d<threshold&&d>10; }).map(s=>s.id);
            await saveSyncState({ position:currentPosition, nearbySignals, criticality, timestamp:Date.now(), masterId:deviceId, route, segmentIndex, arrived });
        };
        broadcast();
        const id=setInterval(broadcast,200);
        return ()=>clearInterval(id);
    },[isMaster,currentPosition,criticality,signals,route,segmentIndex,arrived,deviceId]);

    // Follower sync
    useEffect(() => {
        if(isMaster) return;
        const check=async()=>{
            const data=await getSyncState();
            if(!data||data.masterId===deviceId||(Date.now()-data.timestamp)>2000) return;
            if(data.position) setCurrentPosition(data.position);
            if(data.route&&data.route.length>0){ setRoute(data.route); setSegmentIndex(data.segmentIndex||0); }
            if(data.criticality) setCriticality(data.criticality);
            if(data.arrived!==undefined) setArrived(data.arrived);
            if(data.position){
                const thr=data.criticality==='STABLE'?40:data.criticality==='CRITICAL'?80:200;
                setSignals(prev=>prev.map(s=>{ const d=haversine(data.position[0],data.position[1],s.position[0],s.position[1]); return{...s,state:d<=thr?'GREEN':'RED'}; }));
            }
        };
        check(); const id=setInterval(check,200); return()=>clearInterval(id);
    },[isMaster,deviceId]);

    // Arrived detection
    useEffect(()=>{ if(!route.length||arrived) return; if(hasArrived()) setArrived(true); },[currentPosition,route,arrived]);

    // ETA learning
    useEffect(()=>{
        if(!arrived||etaLogged||!startTime||initialETA===null) return;
        const actual=Math.round((Date.now()-startTime)/1000), error=actual-initialETA, bucket=getTimeBucket();
        setEtaBias(prev=>({...prev,[bucket]:prev[bucket]+0.2*error}));
        setEtaLogged(true);
    },[arrived]);

    // Ambulance movement
    useEffect(()=>{
        if(!route||route.length<2||!isMaster) return;
        const id=setInterval(()=>{
            if(hasArrived()){ clearInterval(id); return; }
            if(segmentIndex>=route.length-1) return;
            const [lat1,lng1]=route[segmentIndex],[lat2,lng2]=route[segmentIndex+1];
            const np=progress+0.15;
            let lat,lng;
            if(np>=1){ setSegmentIndex(s=>s+1); setProgress(0); [lat,lng]=route[segmentIndex+1]||[lat2,lng2]; }
            else { lat=lat1+(lat2-lat1)*np; lng=lng1+(lng2-lng1)*np; setProgress(np); }
            if(lat&&lng){
                setCurrentPosition([lat,lng]);
                const thr=getThreshold();
                setSignals(prev=>prev.map(s=>{ const d=haversine(lat,lng,s.position[0],s.position[1]); return{...s,state:d<=thr?'GREEN':'RED'}; }));
                setCars(prev=>prev.map(car=>{ const d=haversine(lat,lng,car.position[0],car.position[1]); if(d<80&&!car.movedAside) return{...car,position:[car.position[0]-0.00008,car.position[1]+0.00008],movedAside:true}; return car; }));
                const nearSig=signals.some(s=>{const d=haversine(lat,lng,s.position[0],s.position[1]);return d<thr&&d>10;});
                if(nearSig&&!beepRef.current){triggerBeep();beepRef.current=setInterval(triggerBeep,500);}
                if(!nearSig&&beepRef.current){clearInterval(beepRef.current);beepRef.current=null;}
            }
        },100);
        return()=>{ clearInterval(id); if(beepRef.current){clearInterval(beepRef.current);beepRef.current=null;} };
    },[segmentIndex,progress,criticality,route,isMaster]);

    const getCorridorColor = () => criticality==='STABLE'?'#3b82f6':criticality==='CRITICAL'?'#f59e0b':'#ef4444';

    const getCorridorPoints = () => {
        const pts=[currentPosition]; for(let i=segmentIndex+1;i<route.length;i++) pts.push(route[i]); return pts;
    };

    const autoSelectNearestHospital = () => {
        if(beepRef.current){clearInterval(beepRef.current);beepRef.current=null;}
        setCars(INIT_CARS.map(c=>({...c,movedAside:false})));
        let best=null, bestETA=Infinity;
        const etaList=HOSPITALS.map(h=>({id:h.id,name:h.name,eta:formatETA(computeETAForRoute(h.route)),selected:false}));
        HOSPITALS.forEach(h=>{ const eta=computeETAForRoute(h.route); if(eta<bestETA){bestETA=eta;best=h;} });
        if(!best||best.route.length<2){ alert('No valid hospital routes found.'); return; }
        setHospitalETAs(etaList.map(e=>({...e,selected:e.id===best.id})));
        setSelectedHospital(best); setRoute(best.route); setSegmentIndex(0); setProgress(0);
        setCurrentPosition(best.route[0]);
        let totalD=0; for(let i=0;i<best.route.length-1;i++) totalD+=haversine(best.route[i][0],best.route[i][1],best.route[i+1][0],best.route[i+1][1]);
        setInitialETA(Math.round(totalD/AMBULANCE_SPEED)); setStartTime(Date.now()); setArrived(false); setEtaLogged(false);
    };

    const resetLearning = () => { setEtaBias({morning:0,afternoon:0,night:0}); setEtaLogged(false); setArrived(false); };

    const enableAudio = async () => {
        try {
            if(!audioCtxRef.current) audioCtxRef.current=new(window.AudioContext||window.webkitAudioContext)();
            if(audioCtxRef.current.state==='suspended') await audioCtxRef.current.resume();
            triggerBeep();
        } catch(e){ alert('Audio failed'); }
    };

    const etaSec = getETASeconds();
    const etaFormatted = formatETA(etaSec);

    const dashboardProps = { criticality, setCriticality, eta: etaFormatted, arrived, signals, hospitalETAs, isMaster, setIsMaster, deviceId, onAutoSelect: autoSelectNearestHospital, onReset: resetLearning, onEnableAudio: enableAudio, cars, user };

    const renderDashboard = () => {
        switch(role){
            case 'ambulance':    return <AmbulanceDashboard {...dashboardProps} />;
            case 'hospital':     return <HospitalDashboard {...dashboardProps} />;
            case 'traffic':      return <TrafficDashboard {...dashboardProps} />;
            case 'public':       return <PublicDashboard {...dashboardProps} />;
            case 'control_room': return <ControlRoomDashboard {...dashboardProps} />;
            default:             return <AmbulanceDashboard {...dashboardProps} />;
        }
    };

    return (
        <div style={{ position:'relative', height:'100vh', width:'100vw', overflow:'hidden' }}>
            {/* MAP */}
            <MapContainer center={CENTER} zoom={15} zoomControl={false} style={{ height:'100vh', width:'100vw', zIndex:0 }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                <ZoomControl position="bottomright" />
                {route.length>1 && (
                    <Polyline positions={getCorridorPoints()} pathOptions={{ color:getCorridorColor(), weight:6, opacity:0.9 }} />
                )}
                <Marker position={currentPosition} icon={makeIcon('🚑',34)}>
                    <Popup><b>Ambulance</b><br/>Criticality: {criticality}</Popup>
                </Marker>
                {signals.map(s => (
                    <Marker key={s.id} position={s.position} icon={signalIcon(s.state)}>
                        <Popup><b>{s.name}</b><br/>State: {s.state}</Popup>
                    </Marker>
                ))}
                {cars.map(car => (
                    <Marker key={car.id} position={car.position} icon={makeIcon('🚗',26)}>
                        <Popup>Public Vehicle</Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Panel keyframe styles */}
            <style>{`
              @keyframes panelGlowBreath {
                0%,100% { box-shadow: -8px 0 48px rgba(0,0,0,0.6), -2px 0 18px var(--p-accent-lo), 0 0 60px var(--p-accent-lo); }
                50%      { box-shadow: -8px 0 64px rgba(0,0,0,0.65), -2px 0 32px var(--p-accent-hi), 0 0 100px var(--p-accent-md); }
              }
              @keyframes scanLine {
                0%   { top: -6%; opacity: 0; }
                10%  { opacity: 0.55; }
                90%  { opacity: 0.35; }
                100% { top: 108%; opacity: 0; }
              }
              @keyframes blobFloat {
                0%,100% { transform: translateY(0px) scale(1);   opacity: 0.18; }
                50%     { transform: translateY(-18px) scale(1.1); opacity: 0.28; }
              }
              @keyframes topBarShimmer {
                0%   { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
              .panel-glow-breath { animation: panelGlowBreath 3.5s ease-in-out infinite; }
            `}</style>

            {/* ── SIDE PANEL — right side ── */}
            <div
              className="panel-glow-breath"
              style={{
                '--p-accent-lo': `${cfg.accent}20`,
                '--p-accent-md': `${cfg.accent}40`,
                '--p-accent-hi': `${cfg.accent}66`,
                position:'absolute', top:0, right:0, height:'100%',
                width: sidebarOpen ? '340px' : '0px',
                zIndex:1000,
                background:`linear-gradient(170deg, rgba(8,10,26,0.98) 0%, rgba(5,6,18,0.98) 45%, rgba(4,5,14,0.99) 100%)`,
                backdropFilter:'blur(32px)',
                borderLeft: sidebarOpen ? `2px solid ${cfg.accent}66` : 'none',
                display:'flex', flexDirection:'column', overflow:'hidden',
                transition:'width 0.35s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              {/* Ambient glow blob */}
              <div style={{
                position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
                width:240, height:240, borderRadius:'50%', pointerEvents:'none', zIndex:0,
                background:`radial-gradient(circle, ${cfg.accent}35 0%, ${cfg.accent}12 45%, transparent 70%)`,
                animation:'blobFloat 5s ease-in-out infinite',
              }} />
              {/* Scan-line sweep */}
              <div style={{
                position:'absolute', left:0, right:0, height:90, pointerEvents:'none', zIndex:1,
                background:`linear-gradient(180deg, transparent 0%, ${cfg.accent}22 40%, ${cfg.accent}12 60%, transparent 100%)`,
                animation:'scanLine 5s linear infinite',
              }} />
                {/* Header */}
                <div style={{ padding:'22px 20px 16px', borderBottom:`1.5px solid ${cfg.accent}40`, background:`linear-gradient(135deg, ${cfg.accent}30 0%, ${cfg.accent}10 55%, transparent 100%)`, flexShrink:0, whiteSpace:'nowrap', position:'relative', zIndex:2 }}>
                    {/* Top accent line — shimmer */}
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:3, backgroundSize:'200% auto', backgroundImage:`linear-gradient(90deg, transparent 0%, ${cfg.accent}88 30%, ${cfg.accent} 50%, ${cfg.accent}88 70%, transparent 100%)`, animation:'topBarShimmer 3s linear infinite', borderRadius:'0 0 4px 4px' }} />
                    <div className="flex items-center gap-3 mb-4">
                        <div style={{ width:40, height:40, borderRadius:'50%', background:`linear-gradient(135deg, ${cfg.accent}40, ${cfg.accent}18)`, border:`2.5px solid ${cfg.accent}`, boxShadow:`0 0 14px ${cfg.accent}55, 0 0 28px ${cfg.accent}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                            {cfg.icon}
                        </div>
                        <div>
                            <p style={{ color: cfg.accent, fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.14em', textShadow:`0 0 10px ${cfg.accent}88` }}>GreenNote</p>
                            <p style={{ color:'rgba(255,255,255,0.95)', fontSize:14, fontWeight:700, lineHeight:1.2, marginTop:2 }}>{cfg.label}</p>
                        </div>
                        {/* Logout button — top-right of panel */}
                        {onLogout && (
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                title="Logout"
                                style={{
                                    marginLeft:'auto', flexShrink:0,
                                    background:'rgba(6,8,20,0.92)',
                                    border:'2px solid rgba(239,68,68,0.55)',
                                    outline:'3px solid rgba(239,68,68,0.1)',
                                    borderRadius:10, padding:'7px 13px', cursor:'pointer',
                                    display:'flex', alignItems:'center', gap:6,
                                    boxShadow:'0 0 14px rgba(239,68,68,0.35), 0 3px 12px rgba(0,0,0,0.5)',
                                    transition:'all 0.25s ease',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background='rgba(239,68,68,0.18)';
                                    e.currentTarget.style.boxShadow='0 0 24px rgba(239,68,68,0.6), 0 4px 16px rgba(0,0,0,0.6)';
                                    e.currentTarget.style.transform='translateY(-1px) scale(1.04)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background='rgba(6,8,20,0.92)';
                                    e.currentTarget.style.boxShadow='0 0 14px rgba(239,68,68,0.35), 0 3px 12px rgba(0,0,0,0.5)';
                                    e.currentTarget.style.transform='translateY(0) scale(1)';
                                }}
                            >
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span style={{ color:'#ef4444', fontSize:11, fontWeight:800, letterSpacing:'0.06em' }}>LOGOUT</span>
                            </button>
                        )}
                    </div>
                    {/* Live indicator */}
                    <div className="flex items-center gap-2" style={{ background:`linear-gradient(90deg, ${cfg.accent}12, rgba(255,255,255,0.03))`, borderRadius:8, padding:'8px 12px', border:`1px solid ${cfg.accent}30`, boxShadow:`inset 0 0 18px ${cfg.accent}10` }}>
                        <div className="w-2.5 h-2.5 rounded-full animate-pulse flex-shrink-0" style={{ background: cfg.accent, boxShadow:`0 0 10px ${cfg.accent}, 0 0 20px ${cfg.accent}88` }} />
                        <span style={{ color:'rgba(255,255,255,0.7)', fontSize:11, fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', textShadow:`0 0 10px ${cfg.accent}66` }}>Live Monitoring</span>
                        <LiveClock accent={cfg.accent} />
                    </div>
                </div>

                {/* Scrollable content */}
                <div style={{ flex:1, overflowY:'auto', padding:'18px 16px', scrollbarWidth:'thin', scrollbarColor:`${cfg.accent}66 transparent`, position:'relative', zIndex:2 }}>
                    {renderDashboard()}
                </div>

                {/* ── Logout confirmation — anchored inside panel, does NOT cover the map ── */}
                {showLogoutConfirm && (
                    <div style={{
                        position:'absolute', bottom:0, left:0, right:0,
                        background:'linear-gradient(180deg,rgba(6,6,16,0) 0%,rgba(6,6,16,0.98) 18%)',
                        padding:'32px 20px 28px',
                        zIndex:100, display:'flex', flexDirection:'column', alignItems:'center', gap:14,
                    }}>
                        <div style={{
                            background:'rgba(14,18,30,0.97)', border:'1px solid rgba(239,68,68,0.35)',
                            borderRadius:18, padding:'22px 24px', width:'100%', boxSizing:'border-box',
                            boxShadow:'0 -8px 40px rgba(0,0,0,0.7)',
                        }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(239,68,68,0.15)', border:'1.5px solid rgba(239,68,68,0.4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                        <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div>
                                    <p style={{ color:'white', fontWeight:700, fontSize:14, lineHeight:1.3 }}>Are you sure you want to logout?</p>
                                    <p style={{ color:'rgba(255,255,255,0.38)', fontSize:11, marginTop:2 }}>You will leave the live corridor view.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setShowLogoutConfirm(false); if(onLogout) onLogout(); }}
                                    style={{ flex:1, padding:'10px 0', borderRadius:12, background:'linear-gradient(135deg,#dc2626,#b91c1c)', border:'none', color:'white', fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.opacity='0.85'}
                                    onMouseLeave={e => e.currentTarget.style.opacity='1'}
                                >Yes, Logout</button>
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    style={{ flex:1, padding:'10px 0', borderRadius:12, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.7)', fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.13)'}
                                    onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}
                                >Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Back button — bottom-left, above minimize (hidden for ambulance) ── */}
            {role !== 'ambulance' && (
            <button
                onClick={() => setCurrentPage && setCurrentPage(backPage)}
                style={{
                    position:'absolute', bottom:84, left:24, zIndex:2000,
                    background:`linear-gradient(135deg, rgba(6,8,20,0.96) 0%, rgba(6,8,20,0.92) 100%)`,
                    backdropFilter:'blur(18px)',
                    border:`2px solid ${cfg.accent}99`,
                    outline:`4px solid ${cfg.accent}1a`,
                    borderRadius:999,
                    padding:'12px 24px', cursor:'pointer',
                    display:'flex', alignItems:'center', gap:9,
                    boxShadow:`0 0 22px ${cfg.accent}55, 0 0 50px ${cfg.accent}1a, 0 6px 20px rgba(0,0,0,0.7)`,
                    transition:'all 0.28s ease',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform='translateY(-2px) scale(1.06)';
                    e.currentTarget.style.boxShadow=`0 0 38px ${cfg.accent}99, 0 0 70px ${cfg.accent}38, 0 8px 28px rgba(0,0,0,0.75)`;
                    e.currentTarget.style.background=`linear-gradient(135deg, rgba(10,14,35,0.98) 0%, rgba(6,8,20,0.95) 100%)`;
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform='translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow=`0 0 22px ${cfg.accent}55, 0 0 50px ${cfg.accent}1a, 0 6px 20px rgba(0,0,0,0.7)`;
                    e.currentTarget.style.background=`linear-gradient(135deg, rgba(6,8,20,0.96) 0%, rgba(6,8,20,0.92) 100%)`;
                }}
                aria-label="Go back to dashboard"
            >
                <svg width="17" height="17" fill="none" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
                    <path d="M15.75 19.25L8.75 12.25L15.75 5.25" stroke={cfg.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ color:'rgba(255,255,255,0.93)', fontSize:12, fontWeight:800, letterSpacing:'0.07em' }}>GO BACK</span>
            </button>
            )}

            {/* ── Minimize / Maximize button — bottom-left ── */}
            <button
                onClick={() => setSidebarOpen(v => !v)}
                style={{
                    position:'absolute', bottom:28, left:24, zIndex:2000,
                    background:`linear-gradient(135deg, rgba(6,8,20,0.96) 0%, rgba(6,8,20,0.92) 100%)`,
                    backdropFilter:'blur(18px)',
                    border:`2px solid ${cfg.accent}99`,
                    outline:`4px solid ${cfg.accent}1a`,
                    borderRadius:999,
                    padding:'12px 24px', cursor:'pointer',
                    display:'flex', alignItems:'center', gap:9,
                    boxShadow:`0 0 28px ${cfg.accent}65, 0 0 55px ${cfg.accent}20, 0 6px 20px rgba(0,0,0,0.7)`,
                    transition:'all 0.28s ease',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform='translateY(-2px) scale(1.06)';
                    e.currentTarget.style.boxShadow=`0 0 42px ${cfg.accent}99, 0 0 75px ${cfg.accent}38, 0 8px 28px rgba(0,0,0,0.75)`;
                    e.currentTarget.style.background=`linear-gradient(135deg, rgba(10,14,35,0.98) 0%, rgba(6,8,20,0.95) 100%)`;
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform='translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow=`0 0 28px ${cfg.accent}65, 0 0 55px ${cfg.accent}20, 0 6px 20px rgba(0,0,0,0.7)`;
                    e.currentTarget.style.background=`linear-gradient(135deg, rgba(6,8,20,0.96) 0%, rgba(6,8,20,0.92) 100%)`;
                }}
                aria-label={sidebarOpen ? 'Minimize panel' : 'Maximize panel'}
            >
                <svg width="17" height="17" fill="none" viewBox="0 0 24 24"
                    style={{ transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition:'transform 0.35s', flexShrink:0 }}>
                    <path d="M9 18l6-6-6-6" stroke={cfg.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ color:'rgba(255,255,255,0.93)', fontSize:12, fontWeight:800, letterSpacing:'0.07em' }}>
                    {sidebarOpen ? 'MINIMIZE PANEL' : 'SHOW PANEL'}
                </span>
            </button>

            {/* Top-LEFT status badge — below back button */}
            {arrived && (
                <div style={{
                    position:'absolute', top:90, left:24, zIndex:1000,
                    background:'rgba(16,185,129,0.9)', backdropFilter:'blur(10px)',
                    border:'1px solid rgba(16,185,129,0.5)', borderRadius:12,
                    padding:'10px 16px', color:'white', fontWeight:'bold', fontSize:14
                }}>
                    ✅ Ambulance Arrived at Destination
                </div>
            )}
        </div>
    );
}

export default MapView;
