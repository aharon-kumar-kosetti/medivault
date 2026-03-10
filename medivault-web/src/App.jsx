import React, { useState, useRef, useEffect } from 'react';
import {
  Plus, Send, Paperclip, X, FileText, Activity, AlertCircle,
  Stethoscope, Pill, HelpCircle, History, User, Heart,
  ArrowRight, CheckCircle2, LayoutDashboard, Settings,
  Loader2, Scan, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// MediVault System Prompt (same as before but consolidated)
const SYSTEM_PROMPT = `
You are MediVault AI — an intelligent medical document analysis and summarization assistant.
AUDIENCE: Patients, Doctors. TONE: Warm, clear, professional.

STRICT OUTPUT FORMAT:
🏥 DOCUMENT IDENTIFIED: [Type]
📋 KEY FINDINGS: [Bullet points]
⚠️ ALERTS: [Parameter] — [Value] vs [Range] — [Meaning]
💊 MEDICATIONS: [Names, Dose, Freq]
🧠 SIMPLE SUMMARY: [3-4 sentences, no jargon]
🩺 CLINICAL SUMMARY: [Technical details if any]
❓ QUESTIONS: [2-3 for doctor]
🔴 URGENCY: [Routine / Monitor / Urgent / Critical]

RULES:
- Never diagnose.
- Always flag abnormal values with ⚠️.
- Be empathetic.
- High priority ⚠️⚠️ for lesions, masses, or fractures.
`;

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState([
    { id: 1, type: "Blood Report", date: "2026-02-15", urgency: "Routine" },
    { id: 2, type: "Chest X-Ray", date: "2026-02-01", urgency: "Monitor" }
  ]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      dragCounter = 0;
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        setUploadedFile(files[0]);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnalyzing]);

  const handleSend = async () => {
    if (!inputText.trim() && !uploadedFile) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: inputText,
      file: uploadedFile ? { name: uploadedFile.name, type: uploadedFile.type } : null
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsAnalyzing(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      let promptParts = [SYSTEM_PROMPT, inputText];

      if (uploadedFile) {
        // Convert file to base64 generative part
        const base64Data = await fileToGenerativePart(uploadedFile);
        promptParts = [SYSTEM_PROMPT, inputText || "Analyze this document", base64Data];
      }

      const result = await model.generateContent(promptParts);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: text
      }]);

      // Add to history if it's the first analysis of a session
      if (uploadedFile) {
        setHistory(prev => [{
          id: Date.now(),
          type: "New Report",
          date: new Date().toISOString().split('T')[0],
          urgency: "Pending"
        }, ...prev]);
      }

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: "🚨 Error: Unable to analyze document. Please check your API key and try again."
      }]);
    } finally {
      setIsAnalyzing(false);
      setUploadedFile(null);
    }
  };

  async function fileToGenerativePart(file) {
    const base64Data = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });

    return {
      inlineData: {
        data: base64Data,
        mimeType: file.type
      },
    };
  }

  const QuickChip = ({ icon: Icon, text, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-medical-teal hover:text-medical-teal transition-all shadow-sm"
    >
      <Icon size={14} />
      {text}
    </button>
  );

  const triggerUpload = () => fileInputRef.current?.click();

  const loadHistoryItem = (item) => {
    // Simulation: Mock loading a past analysis
    setMessages([
      { id: Date.now(), role: 'user', text: `View ${item.type} from ${item.date}` },
      { id: Date.now() + 1, role: 'ai', text: `🏥 DOCUMENT IDENTIFIED: ${item.type}\n📋 KEY FINDINGS:\n* This is a past report from ${item.date}.\n* All previous values were analyzed.\n⚠️ ALERTS: ✅ All values were within normal limits.\n🧠 SIMPLE SUMMARY: This is a view of your previous report. It shows that your health was stable on ${item.date}.\n🔴 URGENCY: Routine` }
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-medical-bg scroll-smooth">
      {/* 1. TOP HEADER BAR */}
      <header className="h-16 bg-medical-blue flex items-center justify-between px-6 shadow-md z-30">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-medical-blue">
            <Heart size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-white font-dm-sans tracking-tight">MediVault<span className="text-medical-teal">AI</span></span>
        </div>

        <div className="hidden md:block text-slate-300 font-medium">
          MediVault AI — Medical Document Analyzer
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-medical-teal/20 text-medical-teal border border-medical-teal/30 rounded-full text-[10px] uppercase font-bold tracking-wider">
            Powered by Gemini AI
          </div>
          <div className="flex items-center gap-2 text-white">
            <span className="text-sm font-medium hidden sm:inline">Ramsai Kollar</span>
            <div className="w-9 h-9 bg-medical-teal rounded-full flex items-center justify-center border-2 border-white/20">
              <User size={20} />
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-medical-blue/80 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-[90%] max-w-xl aspect-video border-4 border-dashed border-white/50 rounded-3xl flex flex-col items-center justify-center text-white"
            >
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6">
                <Plus size={48} className="animate-bounce" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Drop Document Here</h2>
              <p className="text-white/60 font-medium italic">Upload PDF, Photos, or Text files</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        {/* 2. LEFT SIDEBAR */}
        <aside className="w-[260px] bg-[#F0F4FF] border-r border-slate-200 flex flex-col hidden lg:flex">
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 mb-6 text-medical-blue font-bold tracking-wider uppercase text-xs">
              <History size={16} />
              Document History
            </div>

            <div className="space-y-3">
              {history.map(item => (
                <div key={item.id}
                  onClick={() => loadHistoryItem(item)}
                  className="group p-3 bg-white rounded-xl shadow-sm border-l-4 border-transparent hover:border-medical-blue transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-medical-bg flex items-center justify-center text-medical-blue shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-slate-800 truncate">{item.type}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{item.date}</div>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                      item.urgency === "Routine" ? "bg-medical-green/10 text-medical-green" :
                        item.urgency === "Monitor" ? "bg-medical-amber/10 text-medical-amber" :
                          "bg-medical-red/10 text-medical-red"
                    )}>
                      {item.urgency}
                    </span>
                    <ArrowRight size={12} className="text-slate-300 group-hover:text-medical-blue" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-white/50 space-y-3">
            <button
              onClick={triggerUpload}
              className="w-full py-2.5 bg-medical-teal text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-medical-teal/20 hover:bg-medical-teal/90 transition-all active:scale-[0.98]"
            >
              <Plus size={18} />
              Upload New
            </button>
            <button className="w-full text-center text-xs text-slate-400 font-medium hover:text-slate-600 transition-colors">
              Clear History
            </button>
          </div>
        </aside>

        {/* 3. MAIN CHAT WINDOW */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-12">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-20 h-20 bg-medical-blue/10 rounded-3xl flex items-center justify-center text-medical-blue mb-6 shadow-xl shadow-medical-blue/5"
                >
                  <Heart size={40} fill="currentColor" className="opacity-80" />
                </motion.div>

                <h1 className="text-3xl font-bold text-slate-800 mb-2 font-dm-sans">Welcome to MediVault AI</h1>
                <p className="text-slate-500 max-w-md text-center mb-10 font-medium leading-relaxed">
                  Upload any medical document and I'll explain it in simple, actionable language.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                  {[
                    { icon: Activity, title: "Blood Report", sub: "CBC, LFT, KFT...", color: "bg-blue-50 text-blue-600" },
                    { icon: Scan, title: "Scan Report", sub: "MRI, CT, X-Ray...", color: "bg-teal-50 text-teal-600" },
                    { icon: Stethoscope, title: "Discharge Summary", sub: "Post-hospital records", color: "bg-violet-50 text-violet-600" },
                    { icon: Pill, title: "Prescription", sub: "Medicine Analysis", color: "bg-amber-50 text-amber-600" }
                  ].map((card, idx) => (
                    <button
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl text-left hover:border-medical-teal hover:shadow-xl hover:shadow-medical-teal/5 transition-all group"
                      onClick={() => {
                        setInputText(`Analyze this ${card.title} please.`);
                        // Trigger file upload for specific card types
                        if (card.title === "Blood Report" || card.title === "Scan Report") {
                          triggerUpload();
                        }
                      }}
                    >
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", card.color)}>
                        <card.icon size={24} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{card.title}</div>
                        <div className="text-xs text-slate-500 font-medium">{card.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto w-full space-y-6 pb-20">
                {messages.map((msg, idx) => (
                  <div key={msg.id} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn("flex gap-3 max-w-[85%]", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                        msg.role === 'user' ? "bg-medical-blue border-white/20 text-white" : "bg-white border-medical-teal/40 text-medical-teal"
                      )}>
                        {msg.role === 'user' ? <User size={16} /> : <Heart size={16} fill="currentColor" />}
                      </div>

                      <div className={cn(
                        "p-4 rounded-2xl shadow-soft whitespace-pre-wrap leading-relaxed",
                        msg.role === 'user'
                          ? "bg-medical-blue text-white rounded-tr-none text-sm font-medium"
                          : "bg-white border-l-4 border-medical-teal text-slate-800 rounded-tl-none font-medium"
                      )}>
                        {msg.role === 'ai' ? (
                          <div className="space-y-4 prose prose-slate max-w-none text-sm">
                            {parseResponse(msg.text)}
                          </div>
                        ) : (
                          <div>
                            {msg.text}
                            {msg.file && (
                              <div className="mt-2 flex items-center gap-2 p-2 bg-white/10 rounded-lg border border-white/20 text-xs">
                                <FileText size={14} />
                                {msg.file.name}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isAnalyzing && (
                  <div className="flex justify-start">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-white border border-medical-teal/40 text-medical-teal flex items-center justify-center shrink-0">
                        <Heart size={16} fill="currentColor" className="animate-pulse" />
                      </div>
                      <div className="p-4 bg-white border-l-4 border-medical-teal rounded-2xl rounded-tl-none shadow-soft flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-600">Analyzing your document...</span>
                        <div className="flex gap-1">
                          <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 bg-medical-teal rounded-full" />
                          <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-medical-teal rounded-full" />
                          <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-medical-teal rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* 4. BOTTOM INPUT BAR */}
          <div className="p-4 border-t border-slate-100 bg-white shadow-2xl relative z-10">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex flex-wrap gap-2">
                <QuickChip icon={Activity} text="Analyze Blood Report" onClick={() => setInputText("Analyze my blood report results.")} />
                <QuickChip icon={Scan} text="Explain My Scan" onClick={() => setInputText("Explain the findings in my medical scan.")} />
                <QuickChip icon={Pill} text="Check Prescription" onClick={() => setInputText("Review this prescription and side effects.")} />
              </div>

              {uploadedFile && (
                <div className="flex items-center gap-2 p-2 bg-medical-bg border border-medical-teal/30 rounded-lg max-w-fit px-3 shadow-sm">
                  <FileText size={16} className="text-medical-teal" />
                  <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{uploadedFile.name}</span>
                  <button onClick={() => setUploadedFile(null)} className="text-slate-400 hover:text-medical-red transition-colors">
                    <X size={14} />
                  </button>
                </div>
              )}

              <div className="relative flex items-end gap-3 bg-medical-bg rounded-2xl border border-slate-200 p-3 focus-within:border-medical-teal transition-all group">
                <label className="p-2 text-slate-400 hover:text-medical-teal cursor-pointer transition-colors shrink-0">
                  <Paperclip size={20} />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => setUploadedFile(e.target.files[0])}
                  />
                </label>

                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Type or paste your document details..."
                  className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 resize-none max-h-[150px] font-medium text-slate-700"
                  rows={1}
                />

                <button
                  onClick={handleSend}
                  disabled={isAnalyzing || (!inputText.trim() && !uploadedFile)}
                  className={cn(
                    "p-2 rounded-xl transition-all shrink-0",
                    (inputText.trim() || uploadedFile) && !isAnalyzing ? "bg-medical-teal text-white shadow-lg shadow-medical-teal/20 active:scale-95" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  )}
                >
                  <Send size={20} />
                </button>
              </div>
              <div className="text-[10px] text-center text-slate-400 font-bold tracking-wide uppercase px-4">
                🔒 MediVault AI is secure & private. Consultant your doctor for final medical decisions.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Simple Parser to render the structured AI response as cards
function parseResponse(text) {
  const sections = text.split(/\n(?=[🏥📋⚠️💊🧠🩺❓🔴])/g);

  return sections.map((section, idx) => {
    let title = "";
    let content = section;

    if (section.startsWith("🏥")) {
      title = "Document Identified";
      return <div key={idx} className="bg-medical-blue p-3 rounded-xl text-white font-bold flex items-center gap-2 mb-2 shadow-sm">
        <CheckCircle2 size={16} />
        {section.replace("🏥 DOCUMENT IDENTIFIED:", "").trim()}
      </div>;
    }

    if (section.startsWith("📋")) {
      return <div key={idx} className="bg-white p-3 border border-slate-100 rounded-xl shadow-sm mb-2">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest flex items-center gap-1">
          <Activity size={12} /> Key Findings
        </div>
        <div className="text-slate-700 text-xs leading-5">
          {section.split("\n").slice(1).map((line, i) => (
            <div key={i} className="flex gap-2 items-start mb-1">
              <div className="w-1 h-1 rounded-full bg-medical-teal mt-1.5 shrink-0" />
              {line.replace(/^[*-]\s*/, "")}
            </div>
          ))}
        </div>
      </div>;
    }

    if (section.startsWith("⚠️")) {
      const alerts = section.split("\n").filter(l => l.trim().startsWith("⚠️"));
      return <div key={idx} className="space-y-2 mb-2">
        {alerts.map((a, i) => (
          <div key={i} className="bg-medical-amber/10 border-l-4 border-medical-amber p-3 rounded-r-xl flex gap-3">
            <AlertCircle size={16} className="text-medical-amber shrink-0" />
            <div className="text-xs font-bold text-amber-800">{a.replace("⚠️ ALERTS:", "").replace("⚠️", "").trim()}</div>
          </div>
        ))}
      </div>;
    }

    if (section.startsWith("💊")) {
      return <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-2">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest flex items-center gap-1">
          <Pill size={12} /> Medications & Recs
        </div>
        <div className="text-xs text-slate-700">{section.replace("💊 MEDICATIONS:", "").trim()}</div>
      </div>;
    }

    if (section.startsWith("🧠")) {
      return <div key={idx} className="bg-medical-teal/5 p-4 rounded-xl border border-medical-teal/20 text-slate-800 mb-2 shadow-sm">
        <div className="text-[10px] uppercase font-bold text-medical-teal mb-2 tracking-widest">Plain Language Summary</div>
        <div className="text-sm font-semibold leading-relaxed">{section.replace("🧠 SIMPLE SUMMARY:", "").trim()}</div>
      </div>;
    }

    if (section.startsWith("🩺")) {
      return <CollapsibleSection key={idx} title="Clinical Details" icon={Stethoscope} content={section.replace("🩺 CLINICAL SUMMARY:", "").trim()} />;
    }

    if (section.startsWith("❓")) {
      return <div key={idx} className="p-3 border border-dashed border-slate-200 rounded-xl mb-2">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Questions for your doctor</div>
        <div className="text-xs text-slate-800 space-y-1">
          {section.split("\n").slice(1).map((q, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-medical-teal font-bold">{i + 1}.</span>
              {q.replace(/^\d+\.\s*/, "")}
            </div>
          ))}
        </div>
      </div>;
    }

    if (section.startsWith("🔴")) {
      const level = section.replace("🔴 URGENCY LEVEL:", "").replace("🔴", "").trim().toLowerCase();
      const colors = level.includes("routine") ? "bg-medical-green" : level.includes("monitor") ? "bg-medical-amber" : "bg-medical-red";
      return <div key={idx} className={cn("mt-4 p-2 text-center text-white rounded-lg font-bold tracking-widest uppercase text-[10px] shadow-lg", colors)}>
        Urgency Level: {level}
      </div>;
    }

    return <div key={idx} className="text-slate-600 mb-2">{section}</div>;
  });
}

function CollapsibleSection({ title, icon: Icon, content }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-slate-100/50 rounded-xl mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-[10px] uppercase font-bold text-slate-500 tracking-widest"
      >
        <div className="flex items-center gap-2">
          <Icon size={12} /> {title}
        </div>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 text-xs text-slate-600 italic leading-relaxed">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

