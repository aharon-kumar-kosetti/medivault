<div align="center">

# 🏥 MediVault

### *Your health records. Your control. Always.*

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Appwrite](https://img.shields.io/badge/Appwrite-FD366E?style=for-the-badge&logo=appwrite&logoColor=white)](https://appwrite.io/)
[![OpenAI](https://img.shields.io/badge/GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openrouter.ai/)

**Built at Hackathon 2026** 🚀

</div>

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
git clone https://github.com/your-username/medivault-react.git
cd medivault-react

# 2. Install dependencies
npm install
```

### Environment Setup

**Frontend** — create `.env`:
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_ENABLE_MOCK_AUTH=false
```

**Backend** — create `.env.server`:
```env
DATABASE_URL=your_postgres_url
SESSION_SECRET=your_secret_key
API_PORT=3001
API_HOST=0.0.0.0
ALLOWED_ORIGINS=http://localhost:5173

# Appwrite
APPWRITE_API_KEY=your_appwrite_key
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
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

## 👥 Team

Built with 💙 at **Hackathon 2026**

> *See [`public/docs/MediVault-Team-Briefing.docx`](public/docs/MediVault-Team-Briefing.docx) for full team details.*

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**MediVault** — *Because your health story belongs to you.*

⭐ Star this repo if you found it useful!

</div>
