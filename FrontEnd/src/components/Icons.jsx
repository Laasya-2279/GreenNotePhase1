// GreenNote Icon Library — all SVGs are stroke-based (outlined), no emoji
// Stroke colors match role themes: green #10b981, blue #3b82f6, amber #f59e0b, red #ef4444, purple #8b5cf6
// strokeWidth 1.5–2, strokeLinecap="round" strokeLinejoin="round", size 16–22px for inline, 32–48px for hero

import React from 'react';

export const AmbulanceIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <rect x="1" y="10" width="18" height="8" rx="1.5" stroke={color} strokeWidth="1.5"/>
    <path d="M19 13h3l-2 5h-1" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="6" cy="19" r="2" stroke={color} strokeWidth="1.5"/>
    <circle cx="15" cy="19" r="2" stroke={color} strokeWidth="1.5"/>
    <path d="M9 7h6M12 4v6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const HospitalIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M3 21V8a2 2 0 012-2h14a2 2 0 012 2v13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 21h18M9 21v-6h6v6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11h4M12 9v4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const TrafficLightIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <rect x="7" y="2" width="10" height="18" rx="5" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="7" r="2" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="2" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="17" r="2" stroke={color} strokeWidth="1.5"/>
    <path d="M12 20v2M12 2V1" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const CarIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M5 17H3a1 1 0 01-1-1v-4l2-5h14l2 5v4a1 1 0 01-1 1h-2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7.5" cy="17.5" r="2.5" stroke={color} strokeWidth="1.5"/>
    <circle cx="16.5" cy="17.5" r="2.5" stroke={color} strokeWidth="1.5"/>
    <path d="M5.5 7.5h13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const MonitorIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <rect x="2" y="3" width="20" height="14" rx="2" stroke={color} strokeWidth="1.5"/>
    <path d="M8 21h8M12 17v4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const HeartOrganIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const KidneyIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M12 3C8 3 5 6.5 5 10.5c0 2.5 1 4.5 2.5 6 1 1 2 2 2 3.5 0 1 .7 1 1 1h3c.3 0 1 0 1-1 0-1.5 1-2.5 2-3.5 1.5-1.5 2.5-3.5 2.5-6C19 6.5 16 3 12 3z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 8v4M10 10h4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const LiverIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M4 14c0-5 3-9 8-9s10 2 10 7c0 4-3 6-6 6H8c-2 0-4-1.5-4-4z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 14c0 2 1 4 2 4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const LungsIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M12 5v14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 8C9 8 6 10 5 13c-1 2.5-.5 5 1.5 6S10 19 11 17v-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8c3 0 6 2 7 5 1 2.5.5 5-1.5 6S14 19 13 17v-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PancreasIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M3 14c1-3 3-5 5-5s4 2 4 2 2-2 4-2 5 2 5 5c0 2-2 3-4 3-1 0-2-.5-3-1.5C13 14.5 12 15 11 15H8c-2 0-5-.5-5-1z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

export const EyeIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5"/>
  </svg>
);

export const TestTubeIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M14.5 2L20 7.5 9 18.5a3.54 3.54 0 01-5-5L14.5 2z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 17l1.5-1.5M16 4l2 2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const CheckCircleIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5"/>
    <path d="M8 12l3 3 5-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const WarningIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 9v4M12 17h.01" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Filled circle for status indicators (green/amber/red)
export const CircleDotIcon = ({ size = 10, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <circle cx="12" cy="12" r="8"/>
  </svg>
);

export const InboxIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M4 4h16v10H4z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 14H2v6h20v-6h-2M12 8v6m0 0l-3-3m3 3l3-3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const RoadIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M5 21L8 3M19 21L16 3M8 12h8M9 6h6M7 18h10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ClipboardIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="9" y="3" width="6" height="4" rx="1" stroke={color} strokeWidth="1.5"/>
    <path d="M9 12h6M9 16h4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const MapIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M9 20L3 17V4l6 3m0 13V7M9 7l6-3m0 16l6-3V4l-6 3m0 13V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BoltIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const TrophyIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M8 21h8M12 17v4M7 7H2v3a5 5 0 005 5M17 7h5v3a5 5 0 01-5 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 4h10v8a5 5 0 01-10 0V4z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const RulerIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BellIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const RobotIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <rect x="7" y="7" width="10" height="10" rx="1" stroke={color} strokeWidth="1.5"/>
    <path d="M9 7V5M12 7V5M15 7V5M9 19v-2M12 19v-2M15 19v-2M5 9H7M5 12H7M5 15H7M17 9h2M17 12h2M17 15h2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="9" y="9" width="6" height="6" rx="0.5" stroke={color} strokeWidth="1.5"/>
  </svg>
);

export const SatelliteIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M13 7L17 3M17 3l2 2-4 4-2-2 4-4zM3 17l4 4M7 21l-2-2 4-4 2 2-4 4z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12a7 7 0 0014 0 7 7 0 00-14 0z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2"/>
    <circle cx="12" cy="12" r="2" stroke={color} strokeWidth="1.5"/>
  </svg>
);

export const BarChartIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M18 20V10M12 20V4M6 20v-6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ClockIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5"/>
    <path d="M12 6v6l4 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SirenIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M12 2v2M4.22 4.22l1.42 1.42M2 12h2M20 12h2M18.36 5.64l1.42-1.42" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 16a4 4 0 018 0H8z" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="5" y="16" width="14" height="4" rx="1" stroke={color} strokeWidth="1.5"/>
  </svg>
);

export const HourglassIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M5 3h14M5 21h14M8 3v4l4 4-4 4v4M16 3v4l-4 4 4 4v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const RadioIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="20" r="1" fill={color}/>
  </svg>
);

export const PhoneIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <rect x="5" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth="1.5"/>
    <path d="M12 18h.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const LightbulbIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M9 21h6M12 3a6 6 0 016 6c0 2.22-1.2 4.16-3 5.2V17H9v-2.8A6.001 6.001 0 0112 3z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const JoystickIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <rect x="4" y="14" width="16" height="6" rx="2" stroke={color} strokeWidth="1.5"/>
    <path d="M12 14V4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="4" r="2" stroke={color} strokeWidth="1.5"/>
    <path d="M8 17h.01M16 17h.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const TrashIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const WrenchIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MapPinIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.5"/>
  </svg>
);

export const RefreshIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M23 4v6h-6M1 20v-6h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ArrowRightIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const InboxDownIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M2 12l2-8h16l2 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6H2z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7v6m0 0l-3-3m3 3l3-3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ShieldCheckIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// SignalIcon — shows a green or red circle to represent signal state
export const SignalIcon = ({ size = 18, color = 'currentColor', state = 'GREEN' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8" stroke={state === 'GREEN' ? '#10b981' : '#ef4444'} strokeWidth="1.5" fill={state === 'GREEN' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}/>
    <circle cx="12" cy="12" r="3" fill={state === 'GREEN' ? '#10b981' : '#ef4444'}/>
  </svg>
);

// UserIcon — generic person avatar for team cards
export const UserIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const StethoscopeIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M4.5 6.5A3.5 3.5 0 008 10v4a5 5 0 0010 0v-1a2 2 0 10-2 0v1a3 3 0 01-6 0v-4a3.5 3.5 0 003.5-3.5V4h-1v2.5A2.5 2.5 0 015.5 9 2.5 2.5 0 013 6.5V4H2v2.5z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="19" cy="13" r="1.5" stroke={color} strokeWidth="1.5"/>
  </svg>
);

export const BedIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path d="M2 20v-8l3-4h14l3 4v8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 16h20M7 12V8M17 12V8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 8h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const NotePadIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth="1.5"/>
    <path d="M8 7h8M8 11h8M8 15h5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ICONS map for string-key lookup
export const ICONS = {
  ambulance:    (props) => <AmbulanceIcon {...props} />,
  hospital:     (props) => <HospitalIcon {...props} />,
  traffic:      (props) => <TrafficLightIcon {...props} />,
  car:          (props) => <CarIcon {...props} />,
  monitor:      (props) => <MonitorIcon {...props} />,
  heart:        (props) => <HeartOrganIcon {...props} />,
  kidney:       (props) => <KidneyIcon {...props} />,
  liver:        (props) => <LiverIcon {...props} />,
  lungs:        (props) => <LungsIcon {...props} />,
  pancreas:     (props) => <PancreasIcon {...props} />,
  eye:          (props) => <EyeIcon {...props} />,
  testtube:     (props) => <TestTubeIcon {...props} />,
  check:        (props) => <CheckCircleIcon {...props} />,
  warning:      (props) => <WarningIcon {...props} />,
  dot:          (props) => <CircleDotIcon {...props} />,
  inbox:        (props) => <InboxIcon {...props} />,
  road:         (props) => <RoadIcon {...props} />,
  clipboard:    (props) => <ClipboardIcon {...props} />,
  map:          (props) => <MapIcon {...props} />,
  bolt:         (props) => <BoltIcon {...props} />,
  trophy:       (props) => <TrophyIcon {...props} />,
  ruler:        (props) => <RulerIcon {...props} />,
  bell:         (props) => <BellIcon {...props} />,
  robot:        (props) => <RobotIcon {...props} />,
  satellite:    (props) => <SatelliteIcon {...props} />,
  barchart:     (props) => <BarChartIcon {...props} />,
  clock:        (props) => <ClockIcon {...props} />,
  siren:        (props) => <SirenIcon {...props} />,
  hourglass:    (props) => <HourglassIcon {...props} />,
  radio:        (props) => <RadioIcon {...props} />,
  phone:        (props) => <PhoneIcon {...props} />,
  lightbulb:    (props) => <LightbulbIcon {...props} />,
  joystick:     (props) => <JoystickIcon {...props} />,
  trash:        (props) => <TrashIcon {...props} />,
  wrench:       (props) => <WrenchIcon {...props} />,
  pin:          (props) => <MapPinIcon {...props} />,
  refresh:      (props) => <RefreshIcon {...props} />,
  arrowright:   (props) => <ArrowRightIcon {...props} />,
  inboxdown:    (props) => <InboxDownIcon {...props} />,
  shield:       (props) => <ShieldCheckIcon {...props} />,
  signal:       (props) => <SignalIcon {...props} />,
  user:         (props) => <UserIcon {...props} />,
  stethoscope:  (props) => <StethoscopeIcon {...props} />,
  bed:          (props) => <BedIcon {...props} />,
  notepad:      (props) => <NotePadIcon {...props} />,
};

// Universal Icon component — use <Icon name="ambulance" size={20} color="#ef4444" />
export const Icon = ({ name, size = 18, color = 'currentColor' }) => {
  const Comp = ICONS[name];
  return Comp ? <Comp size={size} color={color} /> : null;
};

export default Icon;
