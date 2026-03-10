# MediVault — Judge Presentation Guide

> A secure, role-based medical document vault built for patients, doctors, and hospitals.

---

## What is MediVault?

MediVault is a web application that lets patients safely store their medical records in the cloud. Doctors and hospitals can request access to those records, and patients decide who gets to see what. Everything is encrypted, every action is logged, and emergency access is available when lives are on the line.

---

## The Problem We Solved

Medical records today are scattered — paper files, different hospital portals, WhatsApp photos of reports. When a patient lands in an emergency room, the doctor has no idea what medications they are on, what they are allergic to, or what conditions they have. MediVault fixes this.

---

## Three Types of Users

| Role | What they can do |
|------|-----------------|
| **Patient** | View their documents, approve or reject access requests, see who has access |
| **Doctor** | Upload documents for patients, request access to records, view shared records, record drug interactions, initiate emergency access |
| **Hospital** | Upload documents for patients, manage staff access, view compliance logs |

---

## Tech Stack — Simple Explanation

### Frontend (what you see in the browser)

**React + Vite**
React is a JavaScript library for building interactive user interfaces. Vite is the tool that bundles and serves it during development. Think of React as the engine and Vite as the garage that keeps it running fast.

**React Router**
Handles navigation between pages (`/login`, `/dashboard/patient`, etc.) without reloading the whole browser page.

**Plain CSS (design system)**
All styling is hand-written with CSS variables for a consistent ocean-blue colour palette. No heavy UI framework — everything is custom.

---

### Backend (the server that runs the logic)

**Node.js + Express**
Node.js lets JavaScript run on a server (not just in a browser). Express is a lightweight framework that makes it easy to define API endpoints — the URLs the frontend calls to get or send data.

Example: when a patient clicks "Approve" on an access request, the frontend calls `PATCH /api/access-requests/:id` on the Express server, which updates the database and creates a grant.

---

### Database (where data is stored permanently)

**PostgreSQL on Neon (cloud)**
PostgreSQL is a powerful, open-source relational database. Neon hosts it in the cloud so we don't need our own server. All user accounts, documents, access grants, audit logs, and drug interactions are stored here across **11 tables**.

Key tables:

| Table | What it stores |
|-------|---------------|
| `users` | Email, hashed password, role |
| `patients / doctors / hospitals` | Role-specific profile details |
| `documents` | File metadata + encryption keys |
| `document_access_grants` | Who can access which document |
| `access_requests` | Pending requests from doctors/hospitals |
| `audit_logs` | Every action ever taken (who, what, when, from which IP) |
| `drug_interactions` | Doctor-written drug interaction notes per patient |
| `emergency_access_events` | 24-hour emergency access sessions |

---

### File Storage (where actual files live)

**Appwrite Cloud (Singapore region)**
Medical documents (PDFs, images) are encrypted and then uploaded to Appwrite, a cloud storage service. The database stores only the file's ID and its decryption key — the raw file never sits unprotected anywhere.

---

### Encryption (how files are protected)

**AES-256-GCM**
This is the same encryption standard used by banks and the military. Here is how it works in MediVault:

1. When a doctor uploads a file, the server generates a random 32-byte key (called a DEK — Data Encryption Key).
2. The file is encrypted with that key before it leaves the server's memory.
3. The encrypted file goes to Appwrite. The key goes to the database.
4. When someone downloads the file, the server fetches the encrypted blob from Appwrite, fetches the key from the database, decrypts on the fly, and streams the plain file to the browser.

The file is **never stored unencrypted anywhere** — not in the database, not in Appwrite.

---

### Authentication (how we know who you are)

**HMAC-SHA256 signed tokens (stateless auth)**
When you log in, the server creates a token — a small string that encodes your user ID and role, then signs it with a secret key using HMAC-SHA256 (a cryptographic signature). Every subsequent request sends this token in the `Authorization` header. The server verifies the signature without needing to look anything up in a database.

This means:
- No session table needed
- Tokens survive server restarts
- Forgery is computationally impossible without the secret key

Passwords are hashed with **bcrypt** (10 rounds) before storage — the raw password is never saved.

---

## Key Features — How They Work

### Document Upload & Download

```
Doctor uploads file
  → Server encrypts it (AES-256-GCM)
  → Encrypted blob sent to Appwrite
  → Metadata + encryption key stored in PostgreSQL
  → Audit log entry created

Patient/Doctor downloads file
  → Auth check (is this user allowed?)
  → Encrypted blob fetched from Appwrite
  → Decrypted in server memory
  → Streamed to browser
  → Audit log entry created
```

### Access Request & Approval Flow

```
Doctor requests access to specific documents
  → access_requests row created (status: pending)
  → Patient sees it in their dashboard

Patient approves
  → document_access_grants rows created (30-day expiry)
  → Doctor can now view/download those documents

Patient revokes
  → Grant marked revoked_at = NOW()
  → Doctor loses access immediately
```

### Drug Interactions

Doctors can record drug interaction notes for any patient. Each note includes:
- **Drug A** and **Drug B** (the two interacting drugs)
- **Severity**: Mild / Moderate / Severe / Contraindicated (colour-coded)
- **Interaction Type**: Pharmacokinetic, Pharmacodynamic, Food-Drug, Allergy, Other
- **Description** and **Recommendation** for the treating physician

These notes are visible to the patient, to any doctor with an active grant, and automatically surface during emergency access.

### Emergency Access (24-hour Biometric)

For true medical emergencies:

1. Doctor enters the patient's email and triggers the biometric scanner (simulated Aadhaar fingerprint verification).
2. The server creates a 24-hour emergency access session, logs the event, and returns the patient's full profile — including allergies, chronic conditions, current medications, and all drug interaction notes.
3. The doctor sees a live countdown timer, critical allergy alerts, all uploaded documents, an AI-generated summary, and action points.
4. The patient is notified. The event is permanently logged in the audit trail.

### Audit Logging

Every single action — uploads, downloads, access requests, approvals, revocations, emergency access, AI summaries, drug interaction writes — is written to the `audit_logs` table with:
- Who did it (actor user ID)
- What they did (action enum)
- Which patient it concerned
- IP address and browser user agent
- Timestamp

This makes MediVault fully compliant-ready and tamper-evident.

---

## Security Summary

| Threat | How MediVault handles it |
|--------|--------------------------|
| Stolen database | Files aren't in the DB; keys without files are useless |
| Stolen Appwrite bucket | Encrypted blobs without keys are useless |
| Forged tokens | HMAC signature cannot be faked without the server secret |
| Brute-force passwords | bcrypt hashing with 10 rounds |
| Unauthorized file access | Every download checks ownership or active grant |
| Duplicate grants | DB-level UNIQUE constraint + ON CONFLICT DO UPDATE |
| Audit tampering | Append-only audit_logs table; every action is recorded |

---

## Development Setup

| Command | What it does |
|---------|-------------|
| `npm run dev:all` | Starts both the API server (port 3001) and frontend (port 5177) |
| `npm run dev:api` | API server only |
| `npm run dev` | Frontend only |
| `npm run build` | Production build |

Frontend: `http://192.168.39.125:5177`
API: `http://192.168.39.125:3001`

---

## Team Roles & Responsibilities

> Fill in your team members here before presenting.

| Name | Role |
|------|------|
|      | Frontend / React |
|      | Backend / Express + PostgreSQL |
|      | Security / Encryption design |
|      | UI/UX / Design system |

---

## One-Line Pitch

> "MediVault puts patients in control of their medical data — encrypted in the cloud, shared only with consent, accessible in seconds when it matters most."
