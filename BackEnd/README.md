# GreenNote Backend API

Production-grade Node.js backend for the GreenNote Emergency Green Corridor Management System.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment config
cp .env.example .env
# Edit .env with your MongoDB URI and secrets

# 3. Start MongoDB (must be running)
# mongod --dbpath /your/data/path

# 4. Seed the database
npm run seed

# 5. Start the server
npm run dev        # development (with nodemon)
npm start          # production
```

The server runs on **http://localhost:5001** by default.

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 🚑 Ambulance | ambulance@demo.com | demo123 |
| 🏥 Hospital | hospital@demo.com | demo123 |
| 🚦 Traffic | traffic@demo.com | demo123 |
| 🖥️ Control Room | controlroom@demo.com | demo123 |
| 🚗 Public | public@demo.com | demo123 |

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | — | Register new user |
| POST | `/api/auth/verify-otp` | — | Verify OTP |
| POST | `/api/auth/login` | — | Login (returns JWT) |
| POST | `/api/auth/logout` | ✅ | Logout |
| POST | `/api/auth/refresh-token` | — | Refresh access token |
| GET | `/api/auth/me` | ✅ | Get current user profile |

### Green Corridors (Core Workflow)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/corridors` | ✅ | HOSPITAL | Create request |
| GET | `/api/corridors` | ✅ | Varies | List corridors |
| GET | `/api/corridors/active` | ✅ | CR/TRAFFIC | Active corridors |
| GET | `/api/corridors/:id` | ✅ | Any | Get details |
| PATCH | `/api/corridors/:id/approve` | ✅ | CONTROL_ROOM | Approve request |
| PATCH | `/api/corridors/:id/reject` | ✅ | CONTROL_ROOM | Reject request |
| POST | `/api/corridors/:id/start` | ✅ | AMB/CR | Start journey |
| POST | `/api/corridors/:id/complete` | ✅ | AMB/CR | Complete journey |
| DELETE | `/api/corridors/:id` | ✅ | HOSP/CR | Cancel |

### GPS Tracking
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/gps/update` | ✅ AMB | Submit GPS coordinates |
| GET | `/api/gps/latest/:corridorId` | ✅ | Latest GPS position |
| GET | `/api/gps/trail/:corridorId` | ✅ | GPS trail history |

### Hospitals, Ambulances, Signals, Audit, Analytics
See route files under `src/routes/` for full specifications.

## Socket.IO Events

### Client → Server
| Event | Data | Description |
|-------|------|-------------|
| `join_role` | `{ role }` | Join role-based room |
| `join_corridor` | `{ corridorId, role }` | Join corridor room |
| `ambulanceLocationUpdate` | `{ lat, lng, corridorId }` | GPS update (1/sec throttle) |
| `request_status` | `{ corridorId }` | Request current status |
| `manual_signal_override` | `{ signalId, corridorId }` | Traffic: override signal |

### Server → Client
| Event | Description |
|-------|-------------|
| `routeUpdate` | Updated route + remaining distance |
| `etaUpdate` | New ETA value |
| `signalStateUpdate` | Current signal states (auto-preemption) |
| `corridorStatusUpdate` | Corridor status changed |
| `corridor_created` | New corridor request (to CR) |
| `corridor_approved` | Corridor approved |
| `corridor_started` | Journey started |
| `corridor_completed` | Journey completed |
| `route_deviation` | Ambulance deviated from route |

## Project Structure

```
BackEnd/
├── server.js                        # Entry point
├── database/
│   └── seed.js                      # Database seeder
├── src/
│   ├── algorithms/
│   │   ├── emergencyCostEngine.js   # Graph-based Dijkstra cost function
│   │   ├── etaCalculator.js         # ETA = distance/speed + signals + ML bias
│   │   ├── mlPredictor.js           # Federated learning ETA bias
│   │   ├── movementEngine.js        # GPS deviation detection
│   │   ├── osrmService.js           # OSRM geometry fetch
│   │   ├── routeOptimizer.js        # Best route selection
│   │   ├── routeRepository.js       # Static route coordinate arrays
│   │   ├── signalScheduler.js       # Auto signal preemption
│   │   └── trafficAnalyzer.js       # Congestion monitoring
│   ├── config/
│   │   ├── constants.js             # Roles, statuses, thresholds
│   │   ├── db.js                    # MongoDB connection
│   │   └── logger.js                # Winston logger
│   ├── controllers/                 # 8 controllers
│   ├── middleware/                   # Auth, error, validate, rate-limit, audit
│   ├── models/                      # 9 Mongoose schemas
│   ├── routes/                      # 8 route files
│   ├── sockets/
│   │   └── corridorSocket.js        # Real-time GPS streaming
│   └── utils/
│       └── distance.js              # Haversine distance engine
├── .env.example
├── .gitignore
└── package.json
```

## Environment Variables

See `.env.example` for all required variables. Key ones:

- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `PORT` — Server port (default: 5001)
- `FRONTEND_URL` — CORS allowed origin

## Architecture Notes

- **No pothole logic** — completely removed per spec
- **In-memory corridor session** — single active corridor at a time for real-time performance
- **GPS throttling** — 1 update/second to prevent route thrashing
- **Federated learning** — only aggregate biases stored, no raw traffic data
- **Signal preemption** — automatic GREEN override within urgency-based distance threshold
- **Deviation detection** — reroute only if deviation > 50m or ETA variance > 30s
