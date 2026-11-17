# IoT Auto-Registration & Operations Dashboard

A production-ready full-stack IoT Device Auto-Registration and Operations management portal inspired by an industrial auto-registration workflow. Built with a 4-Tier modular architecture in Node.js/Express, a clean feature-based React frontend with TypeScript, and a persistent SQLite database.

---

## 🛠 Tech Stack

* **Backend**: Node.js (CommonJS), Express, native `node:sqlite`, CORS, dotenv, Nodemon
* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Axios
* **Database**: Local SQLite database with parameterized queries and auto-migrations (`backend/data/iot_devices.db`)
* **Architecture**: 
  * Backend: 4-Tier Feature Module (`Routes` $\to$ `Controller` $\to$ `Service` $\to$ `DAO` $\to$ `Model`) with `asyncHandler` and uniform `{ code, data, message }` `Format` envelope.
  * Frontend: Feature Module (`src/features/devices/`) with clean Separation of Concerns, TypeScript enums, cohesive custom hook (`use-devices.ts`), and decoupled presentational components.

---

## 📁 Repository Structure

```
.
├── backend/
│   ├── data/                   # Persisted SQLite database (iot_devices.db)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js     # Native SQLite database singleton (node:sqlite)
│   │   │   └── format.js       # Standardized response envelope (Format.success, etc.)
│   │   ├── db/
│   │   │   ├── init.js         # Database migration runner & count verification
│   │   │   └── seed.js         # Atomic 6-record seed data transaction
│   │   ├── middleware/
│   │   │   └── errorHandler.js # Centralized { code, data, message, type } error middleware
│   │   ├── modules/
│   │   │   └── device/         # Modular 4-Tier Device Domain
│   │   │       ├── device.constants.js   # Frozen Enums (RegistrationStatus, DeviceStatus, etc.)
│   │   │       ├── device.controller.js  # Express handlers wrapped in asyncHandler
│   │   │       ├── device.dao.js         # Parameterized SQLite query layer (DAO)
│   │   │       ├── device.model.js       # Table schema DDL and indexes
│   │   │       ├── device.routes.js      # Module route definitions
│   │   │       ├── device.service.js     # State machine & business logic (APIError)
│   │   │       └── device.validator.js   # Strict input validation & trimming
│   │   ├── utils/
│   │   │   ├── APIError.js     # Functional APIError factory function
│   │   │   └── asyncHandler.js # Higher-order controller wrapper
│   │   ├── app.js              # Express app setup & CORS
│   │   ├── routes.js           # Top-level route aggregation
│   │   └── server.js           # Server bootstrap & live listening
│   ├── .env.example            # Environment variables template
│   ├── .gitignore              # Backend-specific ignore rules
│   └── package.json            # Scripts & dependencies
├── frontend/
│   ├── src/
│   │   ├── components/common/  # Reusable UI (Badge, Button, Modal, Toast)
│   │   ├── features/devices/   # Compact, Clean Feature Module
│   │   │   ├── components/
│   │   │   │   ├── device-dashboard.tsx       # Main page container
│   │   │   │   ├── device-summary-cards.tsx   # 6 summary metrics cards
│   │   │   │   ├── device-filter-bar.tsx      # Search + status dropdowns
│   │   │   │   ├── device-table.tsx           # Table + row actions
│   │   │   │   └── device-modals.tsx          # Create/Edit, View Detail, and Delete modals
│   │   │   ├── hooks/
│   │   │   │   └── use-devices.ts             # Cohesive hook for device state & mutations
│   │   │   ├── services/
│   │   │   │   └── device-api.ts              # Clean Axios API functions
│   │   │   ├── types/
│   │   │   │   └── device.types.ts            # Enums & all TypeScript interfaces
│   │   │   └── constants.ts                   # Frozen Enums (RegistrationStatus, DeviceStatus)
│   │   ├── services/
│   │   │   └── api-service/
│   │   │       └── axios-client.ts            # Centralized Axios setup & envelope unwrapper
│   │   ├── utils/
│   │   │   └── date-formatter.ts              # Day.js formatter for Asia/Kolkata (IST)
│   │   ├── App.tsx             # Root app mounting device-dashboard
│   │   └── main.tsx            # React bootstrap
│   ├── .gitignore              # Frontend-specific ignore rules
│   ├── vite.config.ts
│   └── package.json
└── README.md                   # Full documentation & run instructions
```

---

## 🚀 Running the Application

### 1. Backend Setup & Run

```bash
cd backend
npm install
cp .env.example .env    # On Windows PowerShell: Copy-Item .env.example .env
npm run db:init         # Initialize schema & seed demo devices
npm run dev             # Start with live reload (Nodemon) on http://localhost:5000
```

* Dashboard Summary: `http://localhost:5000/api/dashboard/summary`
* Devices API: `http://localhost:5000/api/devices`

---

### 2. Frontend Setup & Run

In a separate terminal:

```bash
cd frontend
npm install
npm run dev       # Start Vite dev server on http://localhost:5173
```

---

## 📊 Acceptance Criteria & Verification Counts

Initial startup produces the exact dashboard metrics matching the assessment specification:

| Metric | Count | Description |
| :--- | :---: | :--- |
| **TOTAL DEVICES** | **6** | Seeded demo devices (`DEMO-1001` to `DEMO-1006`) |
| **PENDING** | **2** | Devices awaiting registration (`DEMO-1002`, `DEMO-1005`) |
| **REGISTERED** | **3** | Successfully registered devices (`DEMO-1001`, `DEMO-1004`, `DEMO-1006`) |
| **ERROR** | **1** | Device with registration error (`DEMO-1003`) |
| **ONLINE** | **2** | Online devices (`DEMO-1001`, `DEMO-1006`) |
| **OFFLINE** | **4** | Offline devices (`DEMO-1002`, `DEMO-1003`, `DEMO-1004`, `DEMO-1005`) |

---

## 🔌 API Contract Reference (Uniform Envelope)

All successful responses return:
```json
{
  "code": 200,
  "data": { ... },
  "message": "Success description"
}
```

All error responses return:
```json
{
  "code": 400,
  "data": null,
  "message": "Error description",
  "type": "ERROR_TYPE_CONSTANT"
}
```

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/summary` | Real-time computed count metrics | `200 OK` |
| `GET` | `/api/devices` | List devices (supports `q`, `registrationStatus`, `deviceStatus`) | `200 OK` |
| `GET` | `/api/devices/:deviceId` | Retrieve single device detail | `200 OK`, `404 Not Found` |
| `POST` | `/api/devices` | Create new device (defaults: Pending, Offline) | `201 Created`, `400 Bad Request`, `409 Conflict` |
| `PUT` | `/api/devices/:deviceId` | Update device name or solution type (IMEI immutable) | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/devices/:deviceId` | Delete device record from database | `204 No Content`, `404 Not Found` |
| `POST` | `/api/devices/:deviceId/register` | Register device (allowed only for Pending or Error) | `200 OK`, `400 Bad Request` |
| `POST` | `/api/devices/:deviceId/simulate-online` | Set status Online and update `LastSeenUtc` to current time | `200 OK`, `404 Not Found` |
| `POST` | `/api/devices/:deviceId/simulate-offline` | Set status Offline while preserving `LastSeenUtc` timestamp | `200 OK`, `404 Not Found` |
| `POST` | `/api/devices/:deviceId/retry-registration` | Reset Error status back to Pending | `200 OK`, `400 Bad Request` |
