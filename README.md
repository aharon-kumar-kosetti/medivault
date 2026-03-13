<div align="center">

# 🏥 MediVault

### *Encrypted. Consent-driven. AI-augmented. Patient-first.*

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Appwrite](https://img.shields.io/badge/Appwrite-FD366E?style=for-the-badge&logo=appwrite&logoColor=white)](https://appwrite.io/)
[![OpenAI](https://img.shields.io/badge/GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openrouter.ai/)

🥈 **2nd Place — Udhbhav 2k26** 🏆

</div>

---

## 👥 Built By

> 🥈 **2nd Place — Udhbhav 2k26**

| Name | GitHub |
|------|--------|
| Aharon Kosetti | [@aharon-kumar-kosetti](https://github.com/aharon-kumar-kosetti) |
| Bhanu Prakash Yirri | [@bhanuprakashyirri](https://github.com/bhanuprakashyirri) |
| Mohith Kumar Baggu | [@mohithkumar64](https://github.com/mohithkumar64) |
| Abishai Jogi | [@abishai-jogi](https://github.com/abishai-jogi) |
| Saketh | — |
| Ram Sai | [@ramsaik3339-cloud](https://github.com/ramsaik3339-cloud) | 

---

## 🩺 The Problem

> Every year, patients repeat tests, face delayed diagnoses, and receive unsafe care — all because their records are scattered across different hospitals and providers.

Healthcare data is **fragmented**, **inaccessible**, and **out of the patient's hands**. In emergencies, this costs lives.

**MediVault fixes this.**

---

## 💡 What is MediVault?

MediVault is a **secure, role-based medical records platform** that puts patients in full control of their health data. Patients own their records. Doctors request access. Hospitals stay accountable. AI makes it all understandable.

- 🔐 **Patient-owned encrypted records**
- ✅ **Explicit, auditable consent flows**
- 🚨 **Emergency break-glass access with guardrails**
- 🤖 **AI-powered report summaries**

---

## ✨ Key Features

| Feature | Description |
|--------|-------------|
| 🧑‍⚕️ **Role-Based Dashboards** | Separate, purpose-built flows for Patients, Doctors, and Hospitals |
| 🗄️ **Secure Document Vault** | Encrypted upload/download with strict role-based authorization |
| 🤝 **Consent & Access Governance** | Request, approve, reject, grant, revoke — full lifecycle control |
| 🚨 **Emergency Access Workflow** | 24-hour break-glass access with full audit trail |
| 🤖 **AI Medical Summarization** | GPT-4o powered structured summaries of uploaded medical records |

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ React 19 + React Router 7
- ⚡ Vite 7
- 🎨 Custom CSS (landing, auth, dashboards)

### Backend
- 🟢 Node.js + Express 5
- 🔑 Custom HMAC-signed bearer token auth (role-aware)
- 🛡️ Rate limiting, CORS controls, bcrypt password hashing

### Data & Storage
- 🐘 PostgreSQL + Drizzle ORM
- ☁️ Appwrite Storage (document files)

### AI
- 🤖 OpenRouter → GPT-4o (medical document summarization)

### Tooling
- ESLint 9 · Concurrently · dotenv

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS)
- npm
- PostgreSQL database
- Appwrite project + bucket
- OpenRouter API key (for AI summaries)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/aharon-kumar-kosetti/medivault-react.git
cd medivault-react

# 2. Install dependencies
npm install
```

### Environment Setup

Create a single `.env` file in the project root (you can copy from `.env.example`).

```env
# Frontend (Vite)
# Keep empty to use relative paths (recommended for Vercel rewrites).
VITE_API_BASE_URL=
VITE_ENABLE_MOCK_AUTH=false

# Backend (Node/Express)
DATABASE_URL=your_postgres_url
SESSION_SECRET=your_secret_key
API_PORT=3001
API_HOST=0.0.0.0
ALLOWED_ORIGINS=http://localhost:5173
NODE_ENV=development

# Appwrite
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_appwrite_key
APPWRITE_BUCKET_ID=medivault-documents

# AI
GEMINI_API_KEY=your_openrouter_key
```

### Database Setup

```bash
# Generate and run migrations
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Run the App

```bash
# Full stack (recommended)
npm run dev:all

# Frontend only
npm run dev

# Backend only
npm run dev:api

# Production build
npm run build
npm run preview
```

### Vercel Deployment

1. Push your repo to GitHub.
2. Import the project in Vercel.
3. Build settings are auto-read from `vercel.json`:
  - Build command: `npm run build`
  - Output directory: `dist`
4. Add environment variables in Vercel Project Settings → Environment Variables:
  - `DATABASE_URL`
  - `SESSION_SECRET`
  - `APPWRITE_ENDPOINT`
  - `APPWRITE_PROJECT_ID`
  - `APPWRITE_API_KEY`
  - `APPWRITE_BUCKET_ID`
  - `GEMINI_API_KEY`
  - Optional: `ALLOWED_ORIGINS`
5. Redeploy.

Operational notes:
- `/api/*`, `/auth/*`, and `/health` are rewritten to the Express serverless function in `api/server.js`.
- The catch-all rewrite sends other routes to `index.html`, so React Router works on refresh/deep links.
- Leave `VITE_API_BASE_URL` empty in production to use relative URLs through Vercel rewrites.

---

## 📐 Architecture

> See full architecture diagram: [`public/docs/MediVault-Architecture.pdf`](public/docs/MediVault-Architecture.pdf)

```
┌─────────────────────────────────────────────┐
│               React Frontend                │
│     Patient · Doctor · Hospital Dashboards  │
└──────────────────┬──────────────────────────┘
                   │ HMAC Bearer Token Auth
┌──────────────────▼──────────────────────────┐
│           Express API (Node.js)             │
│   Auth · Records · Consent · Emergency · AI │
└──────┬───────────┬──────────────┬───────────┘
       │           │              │
  ┌────▼────┐ ┌────▼─────┐ ┌─────▼──────┐
  │PostgreSQL│ │ Appwrite │ │  GPT-4o AI │
  │  (Data) │ │(Documents│ │ (Summaries)│
  └─────────┘ └──────────┘ └────────────┘
```

---

## 🗺️ Roadmap

- [ ] **Object storage migration** — Backfill blob payloads from DB to object storage at scale
- [ ] **Token revocation table** — `revoked_tokens` for immediate session invalidation
- [ ] **Legacy path cleanup** — Retire compatibility branches post-migration
- [ ] **Mobile app** — React Native patient portal
- [ ] **HL7 FHIR integration** — Interoperability with hospital systems

---

<div align="center">

**MediVault** — *Encrypted. Consent-driven. AI-augmented. Patient-first.*

⭐ Star this repo if you found it useful!

</div>
