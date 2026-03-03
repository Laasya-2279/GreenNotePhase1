# 🚑 GreenNote — Real-Time Emergency Green Corridor Management System

**GreenNote** is a production-grade, full-stack emergency green corridor coordination system that orchestrates real-time ambulance transit through urban traffic. It coordinates **5 user roles** — Hospital, Control Room, Traffic Department, Ambulance Driver, and Public — through a complete lifecycle from corridor request to journey completion.

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 🏥 **Green Corridor Lifecycle** | Hospital → Control Room → Traffic → Ambulance → Public → Completion |
| 📡 **Real-Time GPS Streaming** | 1Hz GPS updates via WebSocket with route snapping and deviation detection |
| 🧠 **Federated Learning ETA** | Privacy-preserving ML that learns from trip data without storing raw GPS logs |
| 🚦 **Traffic Signal Automation** | Automatic signal preemption based on ambulance proximity and criticality |
| 🗺️ **Dynamic Route Calculation** | Haversine-based routing with real-time ETA updates and rerouting |
| 🔐 **JWT Authentication + RBAC** | Role-based access control with OTP verification |
| 📊 **Audit Trail** | Every critical action is logged for compliance and review |

---

## 🏗️ Architecture

```
GreenNoteFrontned/
├── BackEnd/                    # Node.js + Express + MongoDB + Socket.IO
│   ├── server.js               # Entry point (HTTP + WebSocket)
│   ├── database/seed.js        # Demo data seeder
│   └── src/
│       ├── algorithms/         # Routing, ETA, signal scheduling, ML
│       ├── config/             # Database, constants, logging
│       ├── controllers/        # 8 REST controllers
│       ├── middleware/         # Auth, validation, rate limiting, audit
│       ├── models/             # 9 Mongoose schemas
│       ├── routes/             # 8 route modules
│       ├── sockets/            # Real-time GPS corridor handler
│       └── utils/              # Haversine distance engine
│
├── FrontEnd/                   # React 19 + Vite + Leaflet
│   └── src/
│       ├── App.jsx             # Main app with page-based routing
│       ├── components/         # Shared UI (backgrounds, map)
│       │   └── map/MapView.jsx # Live map with corridor visualization
│       └── pages/
│           ├── ambulance/      # Ambulance dashboard + signup
│           ├── hospital/       # Hospital dashboard + signup
│           ├── traffic/        # Traffic dashboard + signup
│           ├── public/         # Public dashboard + signup
│           ├── controlroom/    # Control room dashboard
│           ├── home/           # Landing page + loader
│           └── misc/           # Login, Signup router, Navbar
│
└── README.md                   # ← You are here
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally (or Atlas URI)
- **npm** v9+

### 1. Clone & Install

```bash
git clone https://github.com/Laasya-2279/GreenNotePhase1.git
cd GreenNotePhase1
```

```bash
# Install backend
cd BackEnd
npm install

# Install frontend
cd ../FrontEnd
npm install
```

### 2. Configure Environment

```bash
cd BackEnd
cp .env.example .env
# Edit .env if needed (defaults work for local dev)
```

### 3. Seed Database & Run

```bash
# Terminal 1 — Backend
cd BackEnd
npm run seed          # Populate demo data
npm run dev           # Starts on http://localhost:5001

# Terminal 2 — Frontend
cd FrontEnd
npm run dev           # Starts on http://localhost:5173
```

### 4. Open the App

Navigate to **http://localhost:5173** in your browser.

---

## 👤 Demo Credentials

All accounts use password: **`demo123`**

| Role | Email | Dashboard |
|------|-------|-----------|
| 🚑 Ambulance Driver | `ambulance@demo.com` | Live map with GPS streaming |
| 🏥 Hospital | `hospital@demo.com` | Corridor request management |
| 🚦 Traffic Control | `traffic@demo.com` | Signal monitoring & override |
| 🖥️ Control Room | `controlroom@demo.com` | System-wide oversight |
| 🚗 Public / Driver | `public@demo.com` | Route alerts & notifications |

---

## 📡 API Reference

**Base URL:** `http://localhost:5001/api`

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/signup` | Register new user |
| `POST` | `/auth/login` | Login → JWT token |
| `POST` | `/auth/verify-otp` | Verify OTP code |
| `POST` | `/auth/logout` | Logout |
| `POST` | `/auth/refresh-token` | Refresh JWT |
| `GET` | `/auth/me` | Current user profile |

### Green Corridors
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/corridors` | Hospital | Create corridor request |
| `GET` | `/corridors` | Any | List corridors |
| `GET` | `/corridors/active` | CR/Traffic | Active corridors |
| `GET` | `/corridors/:id` | Any | Get details |
| `GET` | `/corridors/:id/route` | Any | Get route data |
| `GET` | `/corridors/statistics` | CR | Dashboard stats |
| `PATCH` | `/corridors/:id/approve` | CR | Approve request |
| `PATCH` | `/corridors/:id/reject` | CR | Reject request |
| `POST` | `/corridors/:id/start` | AMB/CR | Start journey |
| `POST` | `/corridors/:id/complete` | AMB/CR | Complete journey |
| `DELETE` | `/corridors/:id` | HOSP/CR | Cancel corridor |

### GPS Tracking
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/gps/update` | Submit GPS coordinates |
| `GET` | `/gps/latest/:corridorId` | Latest position |
| `GET` | `/gps/trail/:corridorId` | GPS trail history |

### Hospitals & Ambulances
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/hospitals` | List all hospitals |
| `GET` | `/hospitals/nearby?lat=X&lng=Y` | Nearby hospitals |
| `GET` | `/ambulances` | List all ambulances |
| `GET` | `/ambulances/available` | Available units |
| `PATCH` | `/ambulances/:id/location` | Update GPS |

### Traffic Signals
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/signals` | List all signals |
| `GET` | `/signals/nearby?lat=X&lng=Y` | Nearby signals |
| `PATCH` | `/signals/:id/override` | Override to GREEN |

### Analytics & Audit
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/analytics/dashboard` | Dashboard statistics |
| `GET` | `/analytics/eta-accuracy` | ML model accuracy |
| `GET` | `/audit` | All audit logs |
| `GET` | `/audit/corridor/:id` | Logs by corridor |

---

## 🔌 Socket.IO Events

### Client → Server
| Event | Data | Description |
|-------|------|-------------|
| `join_role` | `{ role }` | Join role-based room |
| `join_corridor` | `{ corridorId, role }` | Join corridor room |
| `ambulanceLocationUpdate` | `{ lat, lng, corridorId }` | GPS update (1/sec throttle) |
| `manual_signal_override` | `{ signalId, corridorId }` | Traffic: override signal |

### Server → Client
| Event | Description |
|-------|-------------|
| `routeUpdate` | Updated route geometry + distance |
| `etaUpdate` | New ETA calculation |
| `signalStateUpdate` | Signal states (auto-preemption) |
| `corridorStatusUpdate` | Corridor lifecycle change |
| `corridor_created` | New request notification |
| `corridor_approved` | Corridor approved |
| `corridor_started` | Journey started |
| `corridor_completed` | Journey completed |
| `route_deviation` | Ambulance deviated from route |

---

## 🧠 Core Algorithms

| Algorithm | File | Description |
|-----------|------|-------------|
| **Haversine Distance** | `distance.js` | Spherical distance calculation between GPS coordinates |
| **ETA Calculator** | `etaCalculator.js` | Combines distance, speed, signal delays, and ML bias |
| **Signal Scheduler** | `signalScheduler.js` | Proximity-based automatic signal preemption (40m/80m/200m thresholds) |
| **Movement Engine** | `movementEngine.js` | GPS deviation detection and rerouting triggers |
| **ML Predictor** | `mlPredictor.js` | Federated learning for ETA bias correction via SGD |
| **Emergency Cost Engine** | `emergencyCostEngine.js` | Graph-based Dijkstra routing with priority scoring |
| **Route Optimizer** | `routeOptimizer.js` | Best route selection from candidate paths |
| **Traffic Analyzer** | `trafficAnalyzer.js` | Congestion-aware routing |

---

## 🛡️ Security

- **JWT Authentication** with access + refresh tokens
- **Role-Based Access Control (RBAC)** — 5 roles with fine-grained permissions
- **Rate Limiting** — API request throttling
- **Helmet** — HTTP security headers
- **express-mongo-sanitize** — NoSQL injection prevention
- **Input Validation** — express-validator on all routes

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5001` | Backend server port |
| `MONGODB_URI` | `mongodb://localhost:27017/greennote` | MongoDB connection |
| `JWT_SECRET` | — | JWT signing secret |
| `FRONTEND_URL` | `http://localhost:5173` | CORS allowed origin |
| `OTP_EXPIRY_MINUTES` | `10` | OTP validity period |
| `LOG_LEVEL` | `info` | Winston log level |

---

## 🔬 Technical Highlights

- **Zero-Dependency ML Engine** — Custom SGD optimizer in pure JavaScript, no TensorFlow/PyTorch overhead
- **Federated Learning** — Only weight biases are aggregated; raw GPS data never leaves the edge
- **In-Memory Corridor Session** — Single active corridor optimized for real-time performance
- **GPS Throttling** — 1 update/second prevents route computation storms
- **Signal Preemption** — Automatic GREEN override with criticality-aware distance thresholds
- **Deviation Detection** — Reroute only if deviation > 50m or ETA variance > 30s

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Leaflet, TailwindCSS |
| **Backend** | Node.js, Express, Socket.IO |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT, bcryptjs |
| **Real-Time** | Socket.IO (WebSocket) |
| **Map** | Leaflet + OpenStreetMap |
| **ML** | Custom federated learning engine |
| **Security** | Helmet, CORS, express-mongo-sanitize, rate limiting |

---

## 📄 License

This project is developed as part of an academic/research initiative.

---

<p align="center">
  Built with ❤️ for saving lives through technology
</p>
