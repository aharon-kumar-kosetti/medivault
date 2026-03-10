import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  .bio-app * { box-sizing: border-box; margin: 0; padding: 0; }
  .bio-app {
    font-family: 'DM Sans', -apple-system, sans-serif;
    background: linear-gradient(135deg, #0A2472 0%, #0D47A1 50%, #00B4D8 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .glass-card {
    background: rgba(255,255,255,0.11);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 28px;
    padding: 32px;
    width: 100%;
    max-width: 460px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.35);
  }

  .screen-enter {
    animation: screenIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }
  @keyframes screenIn {
    from { opacity: 0; transform: translateY(28px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* PULSE BADGE */
  @keyframes pulseBadge {
    0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255,59,48,0.4); }
    50%      { opacity: 0.75; box-shadow: 0 0 0 6px rgba(255,59,48,0); }
  }
  .emergency-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,59,48,0.2);
    border: 1px solid rgba(255,59,48,0.45);
    border-radius: 999px; padding: 5px 14px;
    color: #FF6B6B; font-size: 11px; font-weight: 700;
    letter-spacing: 0.8px; text-transform: uppercase;
    animation: pulseBadge 2s infinite;
  }
  .success-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(52,199,89,0.2);
    border: 1px solid rgba(52,199,89,0.45);
    border-radius: 999px; padding: 5px 14px;
    color: #34C759; font-size: 11px; font-weight: 700;
    letter-spacing: 0.8px; text-transform: uppercase;
  }

  /* SCANNER */
  @keyframes rotateSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes scanLine { from { top: 0%; } to { top: 100%; } }
  @keyframes successPop {
    0%   { transform: scale(0.85); }
    60%  { transform: scale(1.08); }
    100% { transform: scale(1); }
  }
  @keyframes fingerFloat {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-6px); }
  }
  .fp-float { animation: fingerFloat 2.5s ease-in-out infinite; }

  /* DOTS */
  @keyframes bounceDot {
    0%,60%,100% { transform: translateY(0); opacity: 0.35; }
    30%          { transform: translateY(-7px); opacity: 1; }
  }

  /* SHIMMER */
  @keyframes shimmer {
    from { left: -100%; }
    to   { left: 150%; }
  }

  /* STEP CARDS */
  @keyframes stepSlide {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* STAGGER RECORD CARDS */
  @keyframes cardFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* COUNTDOWN PULSE */
  @keyframes timerGlow {
    0%,100% { text-shadow: 0 0 8px rgba(255,149,0,0.6); }
    50%      { text-shadow: 0 0 20px rgba(255,149,0,1); }
  }

  .scrollable {
    max-height: 82vh;
    overflow-y: auto;
    padding-right: 6px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.18) transparent;
  }
  .scrollable::-webkit-scrollbar { width: 4px; }
  .scrollable::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 999px; }
`;

// ── DATA ──────────────────────────────────────────────
const PATIENT = {
  name: "Arjun Sharma",
  dob: "12 Aug 1990",
  gender: "Male",
  age: 34,
  mvId: "MV-29481-IND",
  aadhaar: "XXXX-XXXX-4821",
  bloodGroup: "B+ Positive",
  hba1c: "7.8% · High",
  bp: "138/88 mmHg",
  weight: "74kg · BMI 24.1",
  allergies: ["🚫 Penicillin", "🚫 NSAIDs", "⚠️ Aspirin"],
  conditions: ["Type 2 Diabetes", "Hypertension Stage 1"],
  medications: [
    { name: "Metformin", dose: "500mg", freq: "Twice daily" },
    { name: "Warfarin", dose: "5mg", freq: "Once daily" },
    { name: "Amlodipine", dose: "5mg", freq: "Once daily" },
  ],
  emergency: { name: "Priya Sharma (Wife)", phone: "+91 98765 43210" },
  lastHospital: "Apollo, Chennai",
  lastVisit: "18 Feb 2026",
  documents: [
    { emoji: "🩸", title: "CBC Blood Report", date: "18 Feb 2026", hospital: "Apollo Chennai" },
    { emoji: "❤️", title: "ECG Report", date: "10 Jan 2026", hospital: "KIMS Hyderabad" },
    { emoji: "🏥", title: "Discharge Summary", date: "22 Dec 2025", hospital: "Apollo Chennai" },
  ],
};

const STEPS = [
  { id: 1, emoji: "🖐️", title: "Reading Fingerprint", sub: "Extracting biometric markers..." },
  { id: 2, emoji: "🇮🇳", title: "Aadhaar API Match", sub: "Connecting to UIDAI database..." },
  { id: 3, emoji: "🔒", title: "Decrypting Vault", sub: "AES-256 secure unlock..." },
  { id: 4, emoji: "📋", title: "Loading Medical Records", sub: "Fetching emergency data..." },
  { id: 5, emoji: "⏱️", title: "Granting 24h Access", sub: "Emergency access token issued..." },
];

// ── COMPONENTS ────────────────────────────────────────

function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 5, marginLeft: 8, verticalAlign: "middle" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: "#00B4D8", display: "inline-block",
          animation: `bounceDot 1.2s infinite`,
          animationDelay: `${i * 0.18}s`,
        }} />
      ))}
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "11px 14px",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: 12, marginBottom: 8,
    }}>
      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{label}</span>
      <span style={{ color: "white", fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{value}</span>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: "1.2px",
      margin: "18px 0 8px",
    }}>{children}</div>
  );
}

function GlassBtn({ children, onClick, variant = "default", style = {} }) {
  const base = {
    width: "100%", padding: "15px 20px", borderRadius: 16,
    border: "none", fontFamily: "'DM Sans', sans-serif",
    fontSize: 15, fontWeight: 700, cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
    marginTop: 10, letterSpacing: 0.2,
    ...style,
  };
  const variants = {
    default: {
      background: "rgba(255,255,255,0.18)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.3)",
      color: "white",
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    },
    emergency: {
      background: "linear-gradient(135deg, rgba(255,59,48,0.65), rgba(255,59,48,0.35))",
      border: "1px solid rgba(255,59,48,0.5)",
      color: "white",
      boxShadow: "0 4px 24px rgba(255,59,48,0.25)",
    },
    teal: {
      background: "linear-gradient(135deg, rgba(0,180,216,0.65), rgba(0,180,216,0.35))",
      border: "1px solid rgba(0,180,216,0.5)",
      color: "white",
      boxShadow: "0 4px 24px rgba(0,180,216,0.2)",
    },
  };
  return (
    <button
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      onMouseDown={e => e.currentTarget.style.transform = "scale(0.96)"}
      onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
      onClick={onClick}
    >{children}</button>
  );
}

// ── SCREEN 1 — SCANNER ────────────────────────────────
function ScannerScreen({ onScanComplete, onDemo }) {
  const [scanState, setScanState] = useState("idle"); // idle | scanning | success

  const startScan = () => {
    setScanState("scanning");
    setTimeout(() => {
      setScanState("success");
      setTimeout(onScanComplete, 900);
    }, 2600);
  };

  const ringColor = scanState === "success"
    ? "rgba(52,199,89,0.55)" : scanState === "scanning"
    ? "rgba(0,180,216,0.55)" : "rgba(255,255,255,0.18)";

  const ringGlow = scanState === "success"
    ? "0 0 32px rgba(52,199,89,0.4)" : scanState === "scanning"
    ? "0 0 32px rgba(0,180,216,0.35)" : "none";

  return (
    <div className="glass-card screen-enter">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 999, padding: "7px 18px", marginBottom: 12,
        }}>
          <span style={{ fontSize: 18 }}>⚕️</span>
          <span style={{ color: "white", fontWeight: 800, fontSize: 15, letterSpacing: 0.3 }}>MediVault</span>
        </div>
        <div style={{ marginBottom: 12 }}>
          <span className="emergency-badge">🚨 Emergency Access Mode</span>
        </div>
        <h1 style={{ color: "white", fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Patient Identification</h1>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6 }}>
          Scan patient fingerprint to retrieve emergency medical records via Aadhaar verification
        </p>
      </div>

      {/* Scanner */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "24px 0" }}>
        {/* Outer rotating ring */}
        <div style={{ position: "relative", width: 180, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Spinning dashed ring */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: `2px solid ${ringColor}`,
            animation: "rotateSlow 4s linear infinite",
            transition: "border-color 0.4s",
          }} />
          {/* Static dashed ring */}
          <div style={{
            position: "absolute", inset: 10, borderRadius: "50%",
            border: "2px dashed rgba(255,255,255,0.12)",
          }} />
          {/* Inner circle */}
          <div
            onClick={scanState === "idle" ? startScan : undefined}
            style={{
              width: 145, height: 145, borderRadius: "50%",
              background: scanState === "success"
                ? "rgba(52,199,89,0.15)" : scanState === "scanning"
                ? "rgba(0,180,216,0.12)" : "rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)",
              border: `1.5px solid ${ringColor}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: scanState === "idle" ? "pointer" : "default",
              position: "relative", overflow: "hidden",
              boxShadow: ringGlow,
              transition: "all 0.4s ease",
              animation: scanState === "success" ? "successPop 0.5s cubic-bezier(0.34,1.56,0.64,1)" : "none",
            }}
          >
            {/* Scan line */}
            {scanState === "scanning" && (
              <div style={{
                position: "absolute", left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg, transparent, #00B4D8, transparent)",
                animation: "scanLine 1.4s linear infinite",
                top: 0,
              }} />
            )}
            {/* Emoji */}
            <span
              style={{
                fontSize: 60, zIndex: 2,
                animation: scanState === "idle" ? "fingerFloat 2.5s ease-in-out infinite" : "none",
              }}
            >
              {scanState === "success" ? "✅" : scanState === "scanning" ? "🖐️" : "👆"}
            </span>
          </div>
        </div>

        {/* Status */}
        <div style={{ marginTop: 14, color: "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: 500, textAlign: "center" }}>
          {scanState === "idle" && "Tap the scanner to scan fingerprint"}
          {scanState === "scanning" && <span>Scanning fingerprint<TypingDots /></span>}
          {scanState === "success" && <span style={{ color: "#34C759" }}>✓ Fingerprint captured successfully!</span>}
        </div>
      </div>

      <GlassBtn variant="emergency" onClick={scanState === "idle" ? startScan : undefined}>
        {scanState === "scanning" ? <span>🔍 Scanning<TypingDots /></span> : "🔍 Scan Fingerprint"}
      </GlassBtn>
      <GlassBtn onClick={onDemo}>⚡ Demo — Skip to Results</GlassBtn>
    </div>
  );
}

// ── SCREEN 2 — PROCESSING ─────────────────────────────
function ProcessingScreen({ onComplete }) {
  const [activeStep, setActiveStep] = useState(0);
  const [doneSteps, setDoneSteps] = useState([]);
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState("Initializing...");
  const pcts = [20, 40, 65, 85, 100];
  const labels = [
    "Reading fingerprint...",
    "Matching Aadhaar identity...",
    "Decrypting medical vault...",
    "Loading medical records...",
    "Granting 24-hour access...",
  ];

  useEffect(() => {
    let i = 0;
    const tick = () => {
      if (i >= STEPS.length) {
        setTimeout(onComplete, 600);
        return;
      }
      setActiveStep(i + 1);
      setProgress(pcts[i]);
      setLabel(labels[i]);
      if (i > 0) setDoneSteps(d => [...d, i]);
      i++;
      setTimeout(tick, 950);
    };
    setTimeout(tick, 300);
  }, []);

  return (
    <div className="glass-card screen-enter">
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 999, padding: "7px 18px", marginBottom: 12,
        }}>
          <span style={{ fontSize: 18 }}>⚕️</span>
          <span style={{ color: "white", fontWeight: 800, fontSize: 15 }}>MediVault</span>
        </div>
        <div style={{ marginBottom: 12 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(0,180,216,0.2)", border: "1px solid rgba(0,180,216,0.4)",
            borderRadius: 999, padding: "5px 14px",
            color: "#00B4D8", fontSize: 11, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase",
          }}>🔍 Verifying Identity</span>
        </div>
        <h1 style={{ color: "white", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Aadhaar Verification</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Matching biometric data with national health registry</p>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 20 }}>
        {STEPS.map((step, idx) => {
          const isDone = doneSteps.includes(idx + 1);
          const isActive = activeStep === idx + 1;
          return (
            <div key={step.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 15px", borderRadius: 14,
              background: isDone
                ? "rgba(52,199,89,0.1)" : isActive
                ? "rgba(0,180,216,0.12)" : "rgba(255,255,255,0.04)",
              border: isDone
                ? "1px solid rgba(52,199,89,0.28)" : isActive
                ? "1px solid rgba(0,180,216,0.3)" : "1px solid rgba(255,255,255,0.07)",
              opacity: (!isDone && !isActive) ? 0.38 : 1,
              transition: "all 0.4s ease",
              animation: isActive ? "stepSlide 0.35s ease" : "none",
            }}>
              <span style={{ fontSize: 20, width: 30, textAlign: "center" }}>{step.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{step.title}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 2 }}>{step.sub}</div>
              </div>
              <span style={{ color: "#34C759", fontSize: 17, opacity: isDone ? 1 : 0, transition: "opacity 0.3s" }}>✓</span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{label}</span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{progress}%</span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 999,
            background: "linear-gradient(90deg, #00B4D8, #34C759)",
            width: `${progress}%`,
            transition: "width 0.5s ease",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, bottom: 0, width: "60%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
              animation: "shimmer 1.2s linear infinite",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SCREEN 3 — PATIENT PROFILE ────────────────────────
function PatientScreen({ onViewRecords, onReset }) {
  const [seconds, setSeconds] = useState(23 * 3600 + 59 * 47);
  const accessTime = useRef(new Date().toLocaleString("en-IN"));

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");

  return (
    <div className="glass-card screen-enter">
      <div className="scrollable">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 999, padding: "7px 18px", marginBottom: 12,
          }}>
            <span style={{ fontSize: 18 }}>⚕️</span>
            <span style={{ color: "white", fontWeight: 800, fontSize: 15 }}>MediVault</span>
          </div>
          <div><span className="success-badge">✅ Identity Verified</span></div>
        </div>

        {/* Aadhaar Row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "11px 15px",
          background: "rgba(52,199,89,0.08)", border: "1px solid rgba(52,199,89,0.22)",
          borderRadius: 14, marginBottom: 14,
        }}>
          <span style={{ fontSize: 18 }}>🇮🇳</span>
          <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>Aadhaar Verified</span>
          <span style={{
            marginLeft: "auto", color: "#34C759",
            fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600,
          }}>{PATIENT.aadhaar}</span>
        </div>

        {/* Patient Card */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "18px", background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.13)", borderRadius: 20, marginBottom: 16,
        }}>
          <div style={{
            width: 62, height: 62, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #0A2472, #00B4D8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, border: "2px solid rgba(255,255,255,0.28)",
          }}>👤</div>
          <div>
            <div style={{ color: "white", fontSize: 17, fontWeight: 800 }}>{PATIENT.name}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 3 }}>
              DOB: {PATIENT.dob} · {PATIENT.gender} · {PATIENT.age} yrs
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 2 }}>
              MediVault ID: {PATIENT.mvId}
            </div>
            <div style={{
              marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4,
              background: "rgba(52,199,89,0.18)", border: "1px solid rgba(52,199,89,0.35)",
              borderRadius: 999, padding: "3px 10px",
              color: "#34C759", fontSize: 11, fontWeight: 700,
            }}>✓ Biometric Match Confirmed</div>
          </div>
        </div>

        {/* Timer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "13px 16px",
          background: "rgba(255,149,0,0.09)", border: "1px solid rgba(255,149,0,0.28)",
          borderRadius: 14, marginBottom: 14,
        }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>🔓 Emergency Access Active</div>
            <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 11, marginTop: 2 }}>Auto-expires · Patient notified on recovery</div>
          </div>
          <div style={{
            color: "#FF9500", fontSize: 18, fontWeight: 700,
            fontFamily: "'DM Mono', monospace",
            animation: "timerGlow 2s ease-in-out infinite",
          }}>{h}:{m}:{s}</div>
        </div>

        {/* Critical Alerts */}
        <div style={{
          padding: "15px 16px",
          background: "rgba(255,59,48,0.12)", border: "1px solid rgba(255,59,48,0.35)",
          borderRadius: 16, marginBottom: 12,
        }}>
          <div style={{
            color: "#FF6B6B", fontSize: 12, fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10,
          }}>⚠️ Critical Alerts</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {PATIENT.allergies.concat(["⚠️ Diabetic", "🩸 Blood Thinner"]).map((a, i) => (
              <span key={i} style={{
                background: "rgba(255,59,48,0.18)", border: "1px solid rgba(255,59,48,0.32)",
                borderRadius: 999, padding: "4px 12px",
                color: "#FF8A80", fontSize: 12, fontWeight: 600,
              }}>{a}</span>
            ))}
          </div>
        </div>

        {/* Vitals Grid */}
        <SectionLabel>🩸 Vital Information</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 6 }}>
          {[
            { emoji: "🩸", title: "Blood Group", val: PATIENT.bloodGroup },
            { emoji: "💉", title: "HbA1c", val: PATIENT.hba1c },
            { emoji: "❤️", title: "Blood Pressure", val: PATIENT.bp },
            { emoji: "⚖️", title: "Weight / BMI", val: PATIENT.weight },
          ].map((item, i) => (
            <div key={i} style={{
              padding: "15px", background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
              cursor: "pointer", transition: "all 0.25s",
              animation: `cardFadeUp 0.4s ease ${i * 0.07}s both`,
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.13)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 7 }}>{item.emoji}</div>
              <div style={{ color: "white", fontSize: 12, fontWeight: 700 }}>{item.title}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 3, fontFamily: "'DM Mono', monospace" }}>{item.val}</div>
            </div>
          ))}
        </div>

        {/* Medications */}
        <SectionLabel>💊 Current Medications</SectionLabel>
        {PATIENT.medications.map((med, i) => (
          <InfoRow key={i} label={`💊 ${med.name}`} value={`${med.dose} · ${med.freq}`} />
        ))}

        {/* Conditions */}
        <SectionLabel>🏥 Present Conditions</SectionLabel>
        {PATIENT.conditions.map((c, i) => (
          <InfoRow key={i} label="Diagnosis" value={c} />
        ))}
        <InfoRow label="Last Hospital" value={PATIENT.lastHospital} />
        <InfoRow label="Last Visit" value={PATIENT.lastVisit} />

        {/* Emergency Contact */}
        <SectionLabel>📞 Emergency Contact</SectionLabel>
        <InfoRow label={`👩 ${PATIENT.emergency.name}`} value={PATIENT.emergency.phone} />

        <div style={{ height: 1, background: "rgba(255,255,255,0.09)", margin: "18px 0" }} />

        <GlassBtn variant="teal" onClick={onViewRecords}>📄 View Full Medical Records</GlassBtn>
        <GlassBtn onClick={onReset}>🔄 New Patient Scan</GlassBtn>

        {/* Access Log */}
        <div style={{
          padding: "13px 15px",
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, marginTop: 12,
        }}>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 11, textAlign: "center", lineHeight: 1.7 }}>
            🔐 This access is logged and audited<br />
            Doctor: Dr. Ravi Kumar · Apollo Hospital Hyd<br />
            Access granted: {accessTime.current}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── SCREEN 4 — FULL RECORDS ───────────────────────────
function RecordsScreen({ onBack, onReset }) {
  return (
    <div className="glass-card screen-enter">
      <div className="scrollable">
        {/* Back */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button
            onClick={onBack}
            style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 10, padding: "8px 14px", color: "white",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >← Back</button>
          <div>
            <div style={{ color: "white", fontSize: 19, fontWeight: 800 }}>📋 Full Records</div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 1 }}>Arjun Sharma · Emergency Access</div>
          </div>
        </div>

        {/* Documents */}
        <SectionLabel>📄 Uploaded Documents</SectionLabel>
        {PATIENT.documents.map((doc, i) => (
          <div key={i}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 16px",
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16, marginBottom: 9, cursor: "pointer",
              transition: "all 0.25s",
              animation: `cardFadeUp 0.4s ease ${i * 0.08}s both`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.13)";
              e.currentTarget.style.transform = "translateX(3px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <span style={{ fontSize: 30 }}>{doc.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "white", fontSize: 14, fontWeight: 700 }}>{doc.title}</div>
              <div style={{ color: "rgba(255,255,255,0.42)", fontSize: 11, marginTop: 3, fontFamily: "'DM Mono', monospace" }}>
                {doc.date} · {doc.hospital}
              </div>
            </div>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 18 }}>›</span>
          </div>
        ))}

        {/* AI Summary */}
        <SectionLabel>🤖 AI Summary — Latest Report</SectionLabel>
        <div style={{
          padding: "16px", background: "rgba(0,180,216,0.1)",
          border: "1px solid rgba(0,180,216,0.25)", borderRadius: 16, marginBottom: 12,
        }}>
          <div style={{ color: "#00B4D8", fontSize: 12, fontWeight: 800, marginBottom: 8, letterSpacing: "0.5px" }}>
            🧠 PLAIN LANGUAGE SUMMARY
          </div>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.75 }}>
            Patient has Type 2 Diabetes with borderline HbA1c of 7.8%.
            Currently on blood thinners (Warfarin) — avoid procedures without checking INR.
            Known allergy to Penicillin — use alternative antibiotics only.
            Blood pressure slightly elevated. Patient is stable but requires careful monitoring.
          </p>
        </div>

        {/* Doctor Action Points */}
        <div style={{
          padding: "15px 16px", background: "rgba(255,59,48,0.12)",
          border: "1px solid rgba(255,59,48,0.3)", borderRadius: 16,
        }}>
          <div style={{ color: "#FF6B6B", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>
            ⚠️ Doctor's Action Points
          </div>
          {[
            "❌ Do NOT administer Penicillin or NSAIDs",
            "🩸 Check INR before any invasive procedure (on Warfarin)",
            "💉 Monitor blood sugar — patient is diabetic",
            `📞 Contact family: ${PATIENT.emergency.phone}`,
          ].map((point, i) => (
            <div key={i} style={{
              color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.7,
              paddingBottom: i < 3 ? 4 : 0,
            }}>{i + 1}. {point}</div>
          ))}
        </div>

        <GlassBtn onClick={onReset} style={{ marginTop: 16 }}>🔄 New Patient Scan</GlassBtn>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────
export default function BiometricEmergencyDemo() {
  const [screen, setScreen] = useState("scan"); // scan | processing | patient | records

  return (
    <>
      <style>{styles}</style>
      <div className="bio-app">
        {screen === "scan" && (
          <ScannerScreen
            onScanComplete={() => setScreen("processing")}
            onDemo={() => setScreen("patient")}
          />
        )}
        {screen === "processing" && (
          <ProcessingScreen onComplete={() => setScreen("patient")} />
        )}
        {screen === "patient" && (
          <PatientScreen
            onViewRecords={() => setScreen("records")}
            onReset={() => setScreen("scan")}
          />
        )}
        {screen === "records" && (
          <RecordsScreen
            onBack={() => setScreen("patient")}
            onReset={() => setScreen("scan")}
          />
        )}
      </div>
    </>
  );
}
