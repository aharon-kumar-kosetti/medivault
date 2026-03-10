# MediVault — Project Context (v6)

> Full-stack medical document vault with role-based dashboards, AES-256-GCM encryption, and Appwrite cloud storage.

---

## Root

`c:\Users\hp 440 G7\OneDrive\Desktop\Absolute cinema\medivault-react\`

---

## Full File Structure

```
medivault-react/
├── .env                              ← All environment variables (frontend + backend + Appwrite)
├── context.md                        ← This file
├── eslint.config.js                  ← ESLint v9 config (React Hooks, Refresh)
├── vite.config.js                    ← Vite build config with React JSX plugin
├── package.json                      ← Dependencies & scripts
├── index.html                        ← Vite entry (Google Fonts: Poppins + Inter)
│
├── db/
│   ├── drizzle.config.ts
│   ├── README.md
│   ├── migrations/
│   │   ├── 0001_medivault_init.sql   ← 11 tables: users, patients, doctors, hospitals, documents, blobs, grants, requests, audit, emergency, notifications
│   │   └── 0002_appwrite_storage.sql ← Adds appwrite_file_id to documents
│   └── schema/
│       ├── index.ts
│       ├── users.ts
│       ├── documents.ts
│       └── workflow.ts
│
├── server/
│   └── src/
│       ├── index.js                  ← Server entry: DB check → Appwrite bucket check → listen on 0.0.0.0:3001
│       ├── app.js                    ← Express app with all routes (~750 lines)
│       ├── db.js                     ← PostgreSQL pool (Neon, SSL, max 5), testConnection(), withTransaction()
│       ├── appwrite.js               ← Appwrite Storage client: ensureBucket(), uploadToAppwrite(), downloadFromAppwrite()
│       └── utils.js                  ← normalizeEmail, camelRow/camelRows, HMAC-signed issueToken/resolveSession, requireAuth middleware
│
├── public/
│   ├── MEDIVAULT BG REMOVER.png      ← Logo (transparent PNG)
│   ├── carousel/
│   │   ├── slide-1.png … slide-4.png
│   └── docs/
│       ├── MediVault-Architecture.pdf
│       └── MediVault-Team-Briefing.docx
│
├── src/
│   ├── main.jsx                      ← React entry point
│   ├── App.jsx                       ← React Router v7 — 12 routes (public + protected)
│   ├── App.css
│   ├── index.css                     ← ALL styles (design system + components + dashboard + auth)
│   ├── MediVault-Flowcharts.jsx      ← Reference document (not rendered)
│   │
│   ├── context/
│   │   ├── AuthContext.jsx           ← React Context provider (user, token, login/logout)
│   │   └── authContextObject.js
│   │
│   ├── hooks/
│   │   └── useAuth.jsx              ← Custom hook to consume AuthContext
│   │
│   ├── components/
│   │   ├── Navbar.jsx               ← Sticky nav, hamburger mobile, smooth scroll
│   │   ├── Hero.jsx
│   │   ├── HeroCarousel.jsx         ← 4s autoplay, fade, pause-on-hover, dot nav
│   │   ├── Features.jsx             ← IntersectionObserver scroll fade-in
│   │   ├── FlowSection.jsx          ← Step-bubble cycling with glow animation
│   │   ├── CTA.jsx
│   │   ├── Footer.jsx
│   │   ├── auth/
│   │   │   ├── auth.css
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── AuthInput.jsx
│   │   │   ├── AuthSelect.jsx
│   │   │   ├── AuthSubmitButton.jsx
│   │   │   ├── AuthErrorBanner.jsx
│   │   │   ├── AuthFileUpload.jsx
│   │   │   └── ProtectedRoute.jsx   ← Role-based route guard
│   │   └── dashboard/
│   │       ├── dashboard.css
│   │       ├── DashboardLayout.jsx
│   │       ├── DashboardSection.jsx
│   │       ├── DataTable.jsx
│   │       ├── MetricCard.jsx
│   │       └── ActivityFeed.jsx
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx          ← Public landing (hero, carousel, features, flow, CTA)
│   │   ├── auth/
│   │   │   ├── AuthRoleEntryPage.jsx     ← Role selector (login/register)
│   │   │   ├── RoleLoginPage.jsx
│   │   │   ├── RoleRegisterPage.jsx
│   │   │   ├── PatientLoginPage.jsx
│   │   │   ├── PatientRegisterPage.jsx
│   │   │   ├── DoctorLoginPage.jsx
│   │   │   ├── DoctorRegisterPage.jsx
│   │   │   ├── HospitalLoginPage.jsx
│   │   │   └── HospitalRegisterPage.jsx
│   │   └── dashboard/
│   │       ├── PatientDashboardPage.jsx   ← Vault, upload, download, approve/reject, filters, profile save
│   │       ├── DoctorDashboardPage.jsx    ← Access requests, granted records, profile save
│   │       ├── HospitalDashboardPage.jsx  ← Upload for patients, revoke access, compliance, profile save
│   │       └── RoleDashboardPage.jsx      ← Generic fallback
│   │
│   ├── services/
│   │   ├── authApi.js               ← loginUser(), registerUser() — supports mock mode
│   │   ├── dashboardApi.js          ← getPatientDashboardData(), getDoctorDashboardData(), getHospitalDashboardData()
│   │   ├── vaultApi.js              ← uploadDocument(), downloadDocument()
│   │   ├── accessApi.js             ← submitAccessRequest(), resolveAccessRequest(), revokeGrant(), revokeGrantsByGrantee()
│   │   └── profileApi.js            ← updateProfile(role, data)
│   │
│   └── utils/
│       ├── authRoles.js             ← AUTH_ROLES array with role definitions
│       └── authValidation.js        ← Email, password, phone validators
│
└── legacy/                          ← Original static site (reference only)
    ├── index.html
    ├── script.js
    └── styles.css
```

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + Vite | 19.2 / 7.3.1 |
| Routing | react-router-dom | 7.13.1 |
| Backend | Express | 5.2.1 |
| Database | PostgreSQL (Neon) | pg 8.20.0 |
| File Storage | Appwrite Cloud (SGP) | node-appwrite 22.1.3 |
| Encryption | AES-256-GCM | Node crypto (built-in) |
| Password Hashing | bcryptjs | 3.0.3 |
| File Uploads | Multer | 2.1.1 (20 MB limit) |
| Dev Runner | Concurrently | 9.2.1 |

---

## NPM Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Frontend dev server (localhost:5173) |
| `dev:api` | `node server/src/index.js` | Backend API (0.0.0.0:3001) |
| `dev:all` | `concurrently "npm run dev:api" "npm run dev -- --host 0.0.0.0 --port 5177"` | Both servers, LAN accessible |
| `build` | `vite build` | Production build → dist/ |
| `lint` | `eslint .` | Lint check |
| `preview` | `vite preview` | Preview production build |

---

## Environment Variables (.env)

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Backend API URL (http://192.168.39.125:3001) |
| `VITE_ENABLE_MOCK_AUTH` | Enable localStorage-based mock auth for dev |
| `VITE_APPWRITE_PROJECT_ID` | Appwrite project ID |
| `VITE_APPWRITE_PROJECT_NAME` | Appwrite project name |
| `VITE_APPWRITE_ENDPOINT` | Appwrite API endpoint (https://sgp.cloud.appwrite.io/v1) |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `API_PORT` | Express server port (3001) |
| `APPWRITE_API_KEY` | Server-side Appwrite API key (Storage scopes) |
| `APPWRITE_BUCKET_ID` | Appwrite bucket ID (documentvault) |

---

## Backend API Endpoints

### Health
- `GET /health` — DB connectivity check

### Authentication
- `POST /auth/register/patient` — Register patient (email, password, fullName, DOB, bloodGroup)
- `POST /auth/register/doctor` — Register doctor (email, password, fullName, licenseNumber, specialization)
- `POST /auth/register/hospital` — Register hospital (email, password, hospitalName, licenseNumber, phone, address + proof doc)
- `POST /auth/login` — Login (role, email, password) → token + user + profile

### Dashboards (Bearer token required)
- `GET /api/dashboard/patient` — Metrics, documents, pending requests, active grants, audit log
- `GET /api/dashboard/doctor` — Metrics, active grants, pending requests, emergency sessions
- `GET /api/dashboard/hospital` — Metrics, upload queue, staff access, compliance events

### Profile (Bearer token required)
- `PATCH /api/profile/patient` — Update fullName, bloodGroup, emergency contact
- `PATCH /api/profile/doctor` — Update fullName, specialization
- `PATCH /api/profile/hospital` — Update hospitalName, phone

### Document Management (Bearer token required)
- `POST /api/documents/upload` — Encrypt file (AES-256-GCM) → upload to Appwrite → store metadata + DEK in DB
- `GET /api/documents/:id/download` — Auth check → download from Appwrite (or legacy blobs) → decrypt → stream to client

### Access Control (Bearer token required)
- `POST /api/access-requests` — Doctor/hospital requests patient access (patientEmail, reason, scope)
- `PATCH /api/access-requests/:id` — Patient approve/reject (creates grant on approval)
- `POST /api/grants/:id/revoke` — Revoke a single grant
- `POST /api/grants/revoke-by-grantee` — Bulk revoke all grants for a user

---

## Database Schema (Neon PostgreSQL)

**11 tables** defined in `db/migrations/0001_medivault_init.sql`:

| Table | Purpose |
|-------|---------|
| `users` | Accounts (email, password_hash, role enum) |
| `patients` | Patient profiles (full_name, DOB, blood_group, emergency contact) |
| `doctors` | Doctor profiles (full_name, license_number, specialization) |
| `hospitals` | Hospital profiles (hospital_name, license_number, phone, address) |
| `documents` | Document metadata + encryption keys (DEK, IV) + `appwrite_file_id` |
| `document_blobs` | Legacy chunked encrypted storage (pre-Appwrite) |
| `document_access_grants` | Who can access which documents (status, access_type, expiry) |
| `access_requests` | Doctor→patient access requests (pending/approved/rejected) |
| `emergency_access_events` | Emergency break-glass access records |
| `audit_logs` | Full compliance trail (action, status, IP, user_agent, metadata) |
| `notifications` | User notification records |

**Enums:** document_type, grant_status, grant_access_type, audit_action, audit_status, emergency_status

---

## Frontend Routes

### Public
| Path | Page |
|------|------|
| `/` | Landing page (hero, carousel, features, flow, CTA) |
| `/login` | Role selector → login |
| `/login/patient\|doctor\|hospital` | Role-specific login form |
| `/register` | Role selector → register |
| `/register/patient\|doctor\|hospital` | Role-specific registration form |

### Protected (requires token + matching role)
| Path | Role | Dashboard Features |
|------|------|--------------------|
| `/dashboard/patient` | patient | Document vault, upload, download, approve/reject requests, document filters, profile save, audit log |
| `/dashboard/doctor` | doctor | Submit access requests, view granted records, profile save |
| `/dashboard/hospital` | hospital | Upload for patients, revoke access, compliance events, profile save |

---

## Security Architecture

- **Encryption:** AES-256-GCM single-pass encryption; DEK (32-byte random) + IV (12-byte random) stored in DB; encrypted blob stored in Appwrite
- **Auth:** HMAC-SHA256 signed tokens (stateless); payload encodes userId + role; signature verified with `SESSION_SECRET` or `DATABASE_URL`; survives server restarts
- **Passwords:** bcryptjs 10-round hashing
- **Authorization:** `requireAuth` middleware validates Bearer token; role checks per endpoint; document access verified against owner/uploader/active grants
- **Audit:** Every document action logged with actor, IP, user-agent, metadata JSON
- **File Storage:** Files encrypted server-side before upload to Appwrite; Appwrite bucket allows .pdf, .jpg, .png only
- **Legacy Support:** Old documents stored as chunked base64 in `document_blobs` table still downloadable

---

## Design Tokens (`src/index.css` `:root`)

| Variable | Hex | Use |
|----------|-----|-----|
| `--deep-twilight` | `#03045e` | Navbar, footer |
| `--bright-teal` | `#0077b6` | Primary buttons, step-active |
| `--turquoise-surf` | `#00b4d8` | Hovers, gradients |
| `--frosted-blue` | `#90e0ef` | Nav link text |
| `--light-cyan` | `#caf0f8` | Hero + flow section bg |

**Fonts:** Poppins (headings) + Inter (body) — loaded in `index.html`

---

## ★ How to Change Carousel Images

Open `src/components/HeroCarousel.jsx` → find `CAROUSEL_SLIDES` at the top. Drop replacement PNGs/JPGs into `public/carousel/` and update the `src` paths.

---

## Change History

| Version | Changes |
|---------|---------|
| v1 | Static glassmorphism site |
| v2 | Full rebuild: ocean-blue palette, 4 sections |
| v3 | Custom PNG logo, step-bubble cycling, context.md |
| v4 | React (Vite) migration, logo text, hover animations |
| v5 | All outer files consolidated into medivault-react; real carousel PNGs wired in |
| v6 | Full-stack: Express backend, Neon PostgreSQL (11 tables), AES-256-GCM encryption, role-based auth, 3 dashboards (patient/doctor/hospital), Appwrite cloud storage, profile save, document filters, access request/grant/revoke workflow, audit logging, LAN network access |

---

## v6 Dashboard + Database + Vault Update

### New Frontend Dashboard Architecture

Added shared dashboard system under `src/components/dashboard/`:

```
src/components/dashboard/
├── ActivityFeed.jsx
├── DashboardLayout.jsx
├── DashboardSection.jsx
├── DataTable.jsx
├── MetricCard.jsx
└── dashboard.css
```

Implemented role dashboards with V1 modules:

```
src/pages/dashboard/
├── PatientDashboardPage.jsx
├── DoctorDashboardPage.jsx
└── HospitalDashboardPage.jsx
```

Each dashboard now includes:

1. Overview KPI cards
2. Document upload/listing or access tables
3. Access requests/approvals module
4. Audit/activity feed
5. Profile/settings section
6. Notification preferences section

Mock dashboard data service added at:

`src/services/dashboardApi.js`

### Dashboard Route Map

- `/dashboard/patient`
- `/dashboard/doctor`
- `/dashboard/hospital`

Role routing continues through `ProtectedRoute` guards.

### PostgreSQL + Drizzle Schema (Upcoming Backend)

Added schema workspace:

```
db/
├── drizzle.config.ts
├── README.md
├── schema/
│   ├── index.ts
│   ├── users.ts
│   ├── documents.ts
│   └── workflow.ts
└── migrations/
	└── 0001_medivault_init.sql
```

Core domains covered:

1. Identity: `users`, `patients`, `doctors`, `hospitals`
2. Vault metadata: `documents`, `document_access_grants`
3. Workflow/compliance: `access_requests`, `emergency_access_events`, `audit_logs`, `notifications`

### Storage Vault Implementation Blueprint (MinIO)

Recommended V1 model:

1. Store encrypted file blobs in MinIO (S3-compatible object store).
2. Store metadata and access state in PostgreSQL.
3. Use per-document DEK (AES-256-GCM) wrapped by backend-managed KEK.
4. Persist wrapped DEK + IV in `documents` table.
5. Enforce access through grants + expiry + scope checks.
6. Append every access event to immutable `audit_logs`.

Upload flow:

`client upload -> backend in-memory encrypt -> MinIO object write -> Postgres metadata write -> audit log event`

Download flow:

`auth check -> grant/scope validation -> unwrap key -> stream decrypt -> audit log event`

### Notes for Next Backend Phase

1. Connect dashboard API endpoints to `db/` schema and replace frontend mocks.
2. Add KMS/Vault integration for KEK management (production hardening).
3. Add DB trigger/policy to protect `audit_logs` as append-only.

---

## v7 Vault Strategy Update (No Docker / No MinIO)

Because local object storage is not available on this device, vault storage is switched to PostgreSQL-only encrypted blobs for MVP.

### What changed

1. `documents` no longer depends on `storage_object_key`.
2. `documents` now stores chunk metadata: `chunk_size_bytes`, `total_chunks`.
3. New table `document_blobs` stores encrypted file chunks (base64 text payload) keyed by `document_id + chunk_index`.
4. AES-256-GCM envelope model remains unchanged (`dek_wrapped`, `dek_iv`).

### Current DB-only upload/download flow

Upload:

`client upload -> backend encrypt in memory -> split to chunks -> write documents + document_blobs -> audit log`

Download:

`auth check -> load chunks ordered by chunk_index -> decrypt stream -> audit log`

### MVP limits

1. Max file size target: `20 MB`
2. Chunk size target: `512 KB`

### Future migration path

When object storage becomes available, keep metadata schema and move chunk payloads from `document_blobs` to object storage with a migration script.

### Execution status

1. PostgreSQL CLI (`psql` 17) is installed on this machine at `C:\Program Files\PostgreSQL\17\bin\psql.exe`.
2. Baseline migration `db/migrations/0001_medivault_init.sql` has been executed successfully against Neon on `2026-03-05`.

---

## v8 Auth/Data Seed Update

1. Mock auth now enforces register-first behavior.
2. Login with arbitrary/default credentials is blocked.
3. Stored sessions are validated against registered accounts; invalid sessions are cleared on app load.
4. Dashboard API seed data has been removed; role dashboards now start with zero metrics and empty lists.

---

## v9 Live Auth API + Neon Persistence

1. Added backend API server under `server/src/` using `express + pg + bcryptjs + multer`.
2. Implemented endpoints:
	- `GET /health`
	- `POST /auth/register/patient`
	- `POST /auth/register/doctor`
	- `POST /auth/register/hospital`
	- `POST /auth/login`
3. Registration now writes to Neon tables (`users` + role-specific profile table) in DB transactions.
4. Login now validates credentials from Neon (`users.password_hash`) instead of local-only mocks.
5. Frontend env now points to local backend API:
	- `VITE_API_BASE_URL=http://localhost:3001`
	- `VITE_ENABLE_MOCK_AUTH=false`
6. Added scripts:
	- `npm run dev:api`
	- `npm run start:api`
7. Smoke test succeeded:
	- Registered a new patient account via API
	- Logged in successfully
	- Verified row exists in Neon `users` table

---

## v10 Appwrite-Only Storage + Upload Role Change

### Storage changes
1. All document storage now goes exclusively through Appwrite Cloud. Legacy `document_blobs` chunked storage path has been removed.
2. Hospital registration proof documents are now encrypted and stored in Appwrite. New `proof_file_id` and `proof_filename` columns added to `hospitals` table (migration: `0003_hospital_proof_appwrite.sql`).
3. Download endpoint returns HTTP 410 for any document without an `appwrite_file_id` (legacy docs require re-upload).
4. `downloadFromAppwrite()` now handles `Buffer`, `ArrayBuffer`, and `Uint8Array` return types from node-appwrite v22.
5. CORS now exposes `Content-Disposition`, `Content-Type`, `Content-Length` headers for proper cross-origin file downloads.

### Upload role change
1. Document upload is now restricted to **doctors and hospitals only**. Patients can no longer upload.
2. Doctor dashboard gained an "Upload Document" section with patient email, file, document type, visit date, and description fields.
3. Patient dashboard "Storage Vault" section is now view/download only (upload button and form removed).

### Dashboard tab redesign
1. Added reusable `TabBar` component (`src/components/dashboard/TabBar.jsx`) for sub-tab navigation within dense sections.
2. **Patient dashboard**: Combined "Access Requests" + "Audit Log" into a single "Access & Audit" section with sub-tabs. Sidebar reduced to 5 items.
3. **Doctor dashboard**: Added "Documents & Access" section with sub-tabs (Shared Documents + Active Grants). Added "Requests & Activity" section with sub-tabs (Request Access + Request History + Activity Log). Added shared documents table with download capability. Sidebar reduced to 6 items.
4. **Hospital dashboard**: Combined "Access Management" + "Compliance & Audit" into "Access & Compliance" section with sub-tabs. Sidebar reduced to 5 items.

### Bug fixes
1. `logAudit()` now wrapped in try-catch — audit INSERT failures no longer crash API requests.
2. All 3 dashboard audit queries fixed: return `id`, `description` (via `COALESCE(reason, metadata_json::text)`) instead of wrong alias `details`.
3. Doctor dashboard API now includes `sharedDocuments` query — fetches documents with active grants for the doctor.
4. `DOCTOR_EMPTY` fallback in `dashboardApi.js` now includes `sharedDocuments: []`.

---

## v11 Auth Token Fix + Dashboard View Redesign

### Signed token auth (replaces in-memory session Map)
1. Replaced volatile in-memory `Map` session store in `server/src/utils.js` with **HMAC-SHA256 signed tokens**.
2. `issueToken(userId, role)` now creates `base64url(JSON payload) + "." + HMAC-SHA256 signature`.
3. `resolveSession(token)` verifies signature using timing-safe comparison, then decodes payload.
4. Signing key: `process.env.SESSION_SECRET || process.env.DATABASE_URL || fallback`.
5. Tokens are **stateless** — survive server restarts without session loss. No database table needed.
6. `revokeToken()` is now a no-op (stateless tokens; logout clears localStorage client-side).

### Upload 403 fix
1. Upload endpoint (`POST /api/documents/upload`) now also verifies role from `users` table as fallback: `SELECT role FROM users WHERE id = $1`.
2. This double-check ensures role is correct even if token payload is stale.

### Dashboard separate-view redesign
1. Replaced sub-tab approach with **separate views** per nav item in all 3 dashboards.
2. `DashboardLayout.jsx` now accepts `activeView` + `onViewChange` props; sidebar buttons drive view switching.
3. Added `UploadModal.jsx` — multi-step overlay (Uploading → Verifying → Stamping) with drag-drop file zone.
4. Added `VerifiedStamp.jsx` — SVG "MEDIVAULT VERIFIED DOCUMENT" badge with animation.
5. Doctor dashboard: 9 views (overview, upload, shared-docs, grants, request, history, activity, settings, notifications).
6. Patient dashboard: 6 views (overview, documents, requests, audit, settings, notifications).
7. Hospital dashboard: 7 views (overview, upload, queue, access, compliance, settings, notifications).
8. `dashboard.css` updated with fadeUp, stepPop, popBadge, shimmer keyframe animations and upload modal styles.

## v12 DocumentViewer + Emergency Access Integration

### DocumentViewer
1. Created `src/components/dashboard/DocumentViewer.jsx` — fullscreen modal with zoom (+/−/Ctrl+scroll), rotate (↻), reset (⟲), pan/drag for images, PDF iframe, unsupported file fallback.
2. Floating `VerifiedStamp` badge in bottom-right corner of viewport + mini badge in header.
3. Added `viewDocument()` to `src/services/vaultApi.js` — fetches file as blob URL for in-browser viewing.
4. Doctor and Patient dashboards: "Download" buttons replaced with "View" buttons that open DocumentViewer overlay.
5. Full `.docviewer-*` CSS classes added to `dashboard.css`.

### Emergency Access (Biometric 24h Access)
1. Created `src/components/dashboard/EmergencyAccess.jsx` — 4-screen biometric emergency access flow:
   - **Scanner Screen**: Patient email input + fingerprint scanner simulation (idle → scanning → success).
   - **Processing Screen**: 5-step animated verification (Fingerprint → Aadhaar → Decrypt Vault → Load Records → 24h Grant) with progress bar.
   - **Patient Screen**: Verified patient profile with 24h countdown timer, critical alerts/allergies, vitals, medications, emergency contact, audit log.
   - **Records Screen**: Full document list, AI summary, doctor action points.
2. Glassmorphism dark-blue card UI with animations (screen-enter, pulse badge, rotating scanner ring, scan line, finger float, bouncing dots, shimmer, step slide, card fade-up, timer glow).
3. Backend: `POST /api/emergency-access/initiate` endpoint in `server/src/app.js`:
   - Requires auth (doctor or hospital role only).
   - Looks up patient by email, creates `emergency_access_events` record (24h window).
   - Logs `emergency_access` audit event.
   - Returns patient profile data (name, DOB, blood group, emergency contact) + documents list.
4. Doctor dashboard: Added "🚨 Emergency Access" nav item (10 views total now).
5. Hospital dashboard: Added "🚨 Emergency Access" nav item (8 views total now).
6. Full `ea-*` CSS classes added to `dashboard.css` (~250 lines) with all animations and responsive breakpoints.
