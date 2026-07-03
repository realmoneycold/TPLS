/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Download,
  Wand2,
  BookOpen,
  ArrowRight,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  X,
  Send,
  MessageCircle,
  TrendingUp,
  Shirt,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateAIChatReply } from "./services/aiConfig";
// @ts-ignore
import cyanFlower from "../assets/cyan-flower.png";

const tplLogo = "/TPL logo.png";

// Vector-perfect, organic, smoothly curved, cyan/teal blooming gradient petals forming a clover
function CyanBloomLogo({ size = "small" }: { size?: "small" | "large" }) {
  const isLarge = size === "large";
  const containerClass = isLarge ? "w-16 h-16 filter drop-shadow-[0_0_20px_rgba(34,211,238,0.55)]" : "w-6 h-6 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.45)]";

  return (
    <svg viewBox="0 0 100 100" className={containerClass}>
      <defs>
        <linearGradient id="petal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" /> {/* Cyan 300 */}
          <stop offset="50%" stopColor="#0d9488" /> {/* Teal 600 */}
          <stop offset="100%" stopColor="#0284c7" /> {/* Sky 600 */}
        </linearGradient>
      </defs>
      <g fill="url(#petal-grad)">
        {/* Top Petal - organic curve */}
        <path d="M 50 49 C 32 37, 28 16, 50 8 C 72 16, 68 37, 50 49 Z" />
        {/* Right Petal - organic curve */}
        <path d="M 51 50 C 63 32, 84 28, 92 50 C 84 72, 63 68, 51 50 Z" />
        {/* Bottom Petal - organic curve */}
        <path d="M 50 51 C 68 63, 72 84, 50 92 C 28 84, 32 68, 50 51 Z" />
        {/* Left Petal - organic curve */}
        <path d="M 49 50 C 37 68, 16 72, 8 50 C 16 28, 37 32, 49 50 Z" />
      </g>
      {/* Soft core glow */}
      <circle cx="50" cy="50" r="4.5" fill="#ffffff" className="opacity-90 blur-[0.5px]" />
    </svg>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [plusClicked, setPlusClicked] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: string; text: string}[]>([
    { role: "ai", text: "Hello! Welcome to Time Piece Lifestyle (TPLS). I am Markus, your AI assistant. How can I assist you with our community, apparel, or trading education today?" }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIntroComplete(true), 2800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isThinking]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage;
    
    // Add user message
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setChatMessage("");
    setIsThinking(true);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        throw new Error("API Key is not configured in .env file.");
      }
      
      const reply = await generateAIChatReply(
        apiKey,
        [...chatMessages, { role: "user", text: userMsg }],
        userMsg,
        "User is browsing the home/landing page of TPLS."
      );
      
      setChatMessages(prev => [...prev, { role: "ai", text: reply }]);
    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => [...prev, { 
        role: "ai", 
        text: `Markus: Failed to connect to Gemini API. Please make sure VITE_GEMINI_API_KEY is correctly set in your .env file.` 
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  // Stagger variants for elegant entry animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white font-sans bg-transparent flex flex-col justify-between selection:bg-white/20">

      {/* === Premium Intro Splash Animation === */}
      <AnimatePresence>
        {!introComplete && (
          <motion.div
            key="intro-overlay"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050a14]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Subtle radial glow behind logo */}
            <motion.div
              className="absolute w-[400px] h-[400px] rounded-full bg-blue-600/15 blur-[120px]"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />

            {/* Logo */}
            <motion.img
              src={tplLogo}
              alt="TPLS"
              className="w-20 h-20 object-contain relative z-10"
              initial={{ scale: 0.3, opacity: 0, filter: "blur(12px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Brand Name */}
            <motion.p
              className="text-2xl font-semibold tracking-[0.35em] uppercase text-white/90 mt-6 relative z-10"
              initial={{ opacity: 0, y: 20, letterSpacing: "0.6em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.35em" }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              TPLS
            </motion.p>

            {/* Tagline */}
            <motion.p
              className="text-xs tracking-[0.25em] uppercase text-white/40 mt-3 relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Every Tick, His Glory
            </motion.p>

            {/* Loading bar */}
            <motion.div
              className="mt-10 h-[2px] rounded-full bg-blue-500/40 relative z-10 overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 2.2, delay: 0.5, ease: "easeInOut" }}
            >
              <motion.div
                className="h-full bg-blue-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.2, delay: 0.5, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Autoplay, looping, muted video background - positioned on the right side behind the widgets */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-[72%_center] pointer-events-none scale-105 opacity-70"
          style={{ filter: 'hue-rotate(105deg) brightness(0.65) contrast(1.2)' }}
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Radiant blue and indigo cosmic rim-light glow for the planet */}
      <div className="absolute top-[5%] right-[-15%] w-[110vh] h-[110vh] rounded-full bg-blue-600/20 blur-[130px] pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute top-[12%] right-[-5%] w-[85vh] h-[85vh] rounded-full bg-sky-400/12 blur-[90px] pointer-events-none z-0 mix-blend-screen" />

      {/* Blue/indigo nebula clarity glow behind left panel */}
      <div className="absolute top-[20%] left-[5%] w-[70vw] h-[70vw] rounded-full bg-blue-500/12 blur-[160px] pointer-events-none z-0 mix-blend-screen" />

      {/* Main Container Layer above the video */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen lg:h-screen w-full p-4 lg:p-6 justify-between gap-6 box-border overflow-y-auto lg:overflow-hidden custom-scrollbar">

        {/* Left Panel - Dark translucent vertical glass panel (43% width) */}
        <div className="w-full lg:w-[43%] lg:ml-[4%] relative flex flex-col min-h-[85vh] lg:h-full">
          {/* Distinct, dark translucent vertical glass backplate */}
          <div className="absolute inset-0 rounded-[2rem] glass-panel-left z-0" />

          {/* Inner content wrapper with animations */}
          <motion.div
            className="relative z-10 flex flex-col flex-1 p-6 lg:p-8 2xl:p-12 justify-between h-full overflow-y-auto custom-scrollbar"
            initial="hidden"
            animate={introComplete ? "visible" : "hidden"}
            variants={containerVariants}
          >

            {/* Nav Header */}
            <motion.div className="flex items-center justify-between w-full mb-4 lg:mb-6 2xl:mb-16 shrink-0" variants={itemVariants}>
              <div className="flex items-center gap-3">
                <img src={tplLogo} alt="TPLS Logo" className="w-10 h-10 object-contain rounded-sm" />
                <span className="text-2xl font-semibold tracking-tighter text-white font-sans uppercase">TPLS</span>
              </div>

              <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="glass-card px-5 py-2 rounded-full flex items-center gap-2 cursor-pointer text-xs font-semibold hover:scale-105 active:scale-95 transition-all select-none z-50 relative"
                >
                  <span>{isMenuOpen ? "Close" : "Menu"}</span>
                  {isMenuOpen ? <X size={14} strokeWidth={1.5} /> : <Menu size={14} strokeWidth={1.5} />}
                </button>

              {/* Professional Full-Panel Menu Overlay */}
              <AnimatePresence>
                {isMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    {/* Menu Panel */}
                    <motion.div
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="fixed top-6 left-6 bottom-6 w-[340px] rounded-[2rem] bg-black/80 backdrop-blur-xl border border-white/10 z-50 flex flex-col p-8 overflow-hidden"
                    >
                      {/* Menu Header */}
                      <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                          <img src={tplLogo} alt="TPLS" className="w-9 h-9 object-contain" />
                          <span className="text-xl font-semibold tracking-tight text-white uppercase">TPLS</span>
                        </div>
                        <button
                          onClick={() => setIsMenuOpen(false)}
                          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Menu Items */}
                      <nav className="flex flex-col gap-1 flex-1">
                        {[
                          { label: "Trading Academy", icon: TrendingUp, path: "/" },
                          { label: "Apparel Collection", icon: Shirt, path: "/apparel" },
                          { label: "Market Analysis", icon: BarChart3, path: "/market-news" },
                          { label: "About TPLS", icon: BookOpen, path: "/" },
                        ].map((item, i) => (
                          <motion.button
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            onClick={() => {
                              setIsMenuOpen(false);
                              if (item.path !== "/") navigate(item.path);
                            }}
                            className="w-full text-left px-4 py-3.5 rounded-xl hover:bg-white/8 transition-all text-white/80 hover:text-white flex items-center gap-4 group cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/15 group-hover:border-blue-400/30 transition-all">
                              <item.icon size={16} strokeWidth={1.5} />
                            </div>
                            <span className="text-sm font-medium tracking-wide">{item.label}</span>
                          </motion.button>
                        ))}
                      </nav>

                      {/* Menu Footer */}
                      <div className="pt-6 border-t border-white/10">
                        <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">Connect</p>
                        <div className="flex gap-3">
                          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                            <Twitter size={14} />
                          </a>
                          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                            <Linkedin size={14} />
                          </a>
                          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                            <Instagram size={14} />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Hero Center */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-2">
              {/* TPLS Logo centered above headline */}
              <motion.div variants={itemVariants} className="mb-2 2xl:mb-3">
                <img src={tplLogo} alt="TPLS" className="w-10 h-10 2xl:w-14 2xl:h-14 object-contain" />
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                className="text-3xl lg:text-4xl xl:text-[2.6rem] 2xl:text-[3.8rem] font-medium tracking-[-0.04em] leading-[1.05] mb-3 2xl:mb-5 text-white max-w-2xl font-sans"
                variants={itemVariants}
              >
                Lifestyle company offering <br />
                trading education and <span className="font-serif-elegant text-sky-400 font-normal">premium apparel.</span>
              </motion.h1>

              {/* Explore Memberships button */}
              <motion.div variants={itemVariants} className="mb-3 2xl:mb-5">
                <button
                  onClick={() => navigate('/trading')}
                  className="flex items-center gap-3 2xl:gap-5 px-6 py-2.5 2xl:px-9 2xl:py-3 rounded-full bg-blue-600 border border-blue-400/30 hover:bg-blue-500 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_25px_rgba(37,99,235,0.4)]"
                >
                  <span className="text-base font-semibold tracking-wide text-white">
                    Explore Memberships
                  </span>
                  <div className="w-7 h-7 rounded-full bg-blue-800 border border-blue-700 flex items-center justify-center text-white">
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </div>
                </button>
              </motion.div>

              {/* Three tag pills */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-2 2xl:gap-3"
                variants={itemVariants}
              >
                 {[
                   { label: "Trading Academy", path: "/trading" },
                   { label: "Market Analysis", path: "/market-news" },
                   { label: "Apparel Collection", path: "/apparel" },
                 ].map((item) => (
                  <span
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="px-3 py-1.5 2xl:px-5 2xl:py-2 rounded-full text-[10px] 2xl:text-xs font-medium text-white select-none hover:scale-105 transition-transform cursor-pointer bg-black/45 hover:bg-black/60 backdrop-blur-md border border-white/20 shadow-sm"
                  >
                    {item.label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Bottom Quote Section */}
            <motion.div
              className="pt-2 pb-1 2xl:pt-4 2xl:pb-4 text-center hidden md:flex flex-col items-center justify-center w-full shrink-0"
              variants={itemVariants}
            >
              <p className="text-[10px] 2xl:text-[11px] tracking-[0.35em] uppercase text-white/70 mb-2 2xl:mb-4 font-semibold">
                Our Philosophy
              </p>

              <p className="text-xs 2xl:text-base italic text-white font-serif max-w-lg leading-relaxed px-6 mb-2 2xl:mb-4">
                "Precision in execution. <span className="font-serif italic text-blue-300">Distinction in presentation.</span>"
              </p>

              <div className="flex items-center justify-center gap-4 w-full">
                <div className="h-[1px] w-10 2xl:w-14 bg-white/20" />
                <p className="text-[9px] 2xl:text-[11px] tracking-[0.25em] text-white/80 uppercase font-semibold">
                  TPLS Ecosystem
                </p>
                <div className="h-[1px] w-10 2xl:w-14 bg-white/20" />
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* Right Panel (Responsive Layout - 48% width on desktop) */}
        <motion.div
          className="flex w-full lg:w-[48%] flex-col justify-between p-4 gap-6 lg:gap-4 z-10 relative mt-8 lg:mt-0 pb-12 lg:pb-0"
          initial="hidden"
          animate={introComplete ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.18,
                delayChildren: 0.3,
              }
            }
          }}
        >

          {/* Top Bar */}
          <motion.div
            className="flex justify-end items-center gap-3 w-full"
            variants={{
              hidden: { opacity: 0, y: -30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
            }}
          >

            {/* Social Icons Pill */}
            <div className="glass-card px-4 py-2 rounded-full flex items-center gap-4">
              <div className="flex gap-4 items-center">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white opacity-40 hover:opacity-80 transition-opacity hover:scale-110"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white opacity-40 hover:opacity-80 transition-opacity hover:scale-110"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white opacity-40 hover:opacity-80 transition-opacity hover:scale-110"
                >
                  <Instagram size={18} />
                </a>
              </div>
              <button
                className="text-white opacity-40 hover:opacity-80 hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <ArrowRight size={18} />
              </button>
            </div>

            {/* AI Chat Button */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="glass-card p-2 rounded-full w-12 h-12 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer relative"
            >
              <Sparkles size={20} />
              {isChatOpen && <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-blue-400 border-2 border-black" />}
            </button>

            {/* AI Chatbox */}
            <AnimatePresence>
              {isChatOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed top-20 right-8 w-[360px] h-[460px] rounded-[1.5rem] bg-black/85 backdrop-blur-xl border border-white/12 z-50 flex flex-col overflow-hidden shadow-2xl"
                >
                  {/* Chat Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center">
                        <MessageCircle size={14} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Markus</p>
                        <p className="text-[10px] text-blue-400/80">Online</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsChatOpen(false)}
                      className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 custom-scrollbar">
                    {chatMessages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          msg.role === "ai"
                            ? "bg-white/8 text-white/90 self-start rounded-bl-md"
                            : "bg-blue-600/25 border border-blue-500/20 text-white self-end rounded-br-md"
                        }`}
                      >
                        {msg.text}
                      </motion.div>
                    ))}
                    {isThinking && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-[85%] px-4 py-3 rounded-2xl text-xs bg-white/8 text-white/90 self-start rounded-bl-md"
                      >
                        <div className="flex items-center gap-1.5 py-1 px-0.5">
                          <motion.span
                            className="w-1.5 h-1.5 rounded-full bg-white/60"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0 }}
                          />
                          <motion.span
                            className="w-1.5 h-1.5 rounded-full bg-white/60"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.15 }}
                          />
                          <motion.span
                            className="w-1.5 h-1.5 rounded-full bg-white/60"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.3 }}
                          />
                        </div>
                      </motion.div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat Input */}
                  <div className="px-4 py-3 border-t border-white/10">
                    <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/10">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Ask Markus..."
                        className="flex-1 bg-transparent text-xs text-white placeholder-white/30 outline-none"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-white hover:bg-blue-600/50 transition-all cursor-pointer"
                      >
                        <Send size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Join TPLS Button with Discord icon */}
            <button
              className="glass-card pl-5 pr-2.5 py-2 rounded-full flex items-center gap-3 cursor-pointer text-sm font-semibold hover:scale-105 active:scale-95 transition-transform text-white/95"
            >
              <span>Join TPLS</span>
              <div className="w-8 h-8 rounded-full bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-white">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>
            </button>

          </motion.div>

          {/* Ecosystem Widget with updated TPLS branding */}
          <motion.div
            className="flex justify-end w-full"
            variants={{
              hidden: { opacity: 0, x: 40 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
            }}
          >
            <div className="glass-card p-6 rounded-2xl w-72 hover:scale-[1.02] transition-transform duration-300 text-left">
              <p className="text-sm font-semibold tracking-wide mb-2 text-white/95">Every Tick, His Glory</p>
              <p className="text-sm font-light text-white/70 leading-relaxed">
                TPLS builds and operates premium lifestyle brands—clothing, trading education, and consumer goods—for those who lead with purpose.
              </p>
            </div>
          </motion.div>

          {/* Bottom Feature Section Container */}
          <motion.div
            className="mt-auto glass-card-transparent p-3 rounded-[2.5rem] w-full flex flex-col gap-3"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
          >

            {/* Side-by-Side Cards with updated subtitles */}
            <motion.div
              className="flex gap-3"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.12, delayChildren: 0.05 }
                }
              }}
            >

              {/* Card 1: TPL: Markets */}
              <motion.div 
                onClick={() => navigate("/market-news")}
                variants={{
                  hidden: { opacity: 0, y: 25, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="border border-white/15 bg-black/45 flex-1 p-5 rounded-[1.8rem] text-left hover:scale-[1.03] hover:bg-black/55 transition-all duration-300 flex flex-col justify-between min-h-[140px] relative overflow-hidden cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white mb-4">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <p className="text-base font-semibold text-white/95">TPL: Markets</p>
                  <p className="text-sm font-light text-white/70 leading-relaxed mt-2">
                    Real-time market analysis and trading signals for informed decisions.
                  </p>
                </div>
              </motion.div>

              {/* Card 2: TPL: Apparel */}
              <motion.div 
                onClick={() => navigate("/apparel")}
                variants={{
                  hidden: { opacity: 0, y: 25, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="border border-white/15 bg-black/45 flex-1 p-5 rounded-[1.8rem] text-left hover:scale-[1.03] hover:bg-black/55 transition-all duration-300 flex flex-col justify-between min-h-[140px] relative overflow-hidden cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white mb-4">
                  <Shirt size={16} />
                </div>
                <div>
                  <p className="text-base font-semibold text-white/95">TPL: Apparel</p>
                  <p className="text-sm font-light text-white/70 leading-relaxed mt-2">
                    Premium lifestyle apparel curated for the modern trader.
                  </p>
                </div>
              </motion.div>

            </motion.div>

            {/* Bottom Accent Card with TPL logo and updated subtext */}
            <motion.div 
              onClick={() => navigate('/trading')}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="border border-white/15 bg-black/45 rounded-[1.8rem] flex items-stretch text-left hover:scale-[1.02] hover:bg-black/55 transition-all duration-300 relative overflow-hidden min-h-[110px] cursor-pointer"
            >
              <div className="w-32 overflow-hidden relative flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-950/60 to-black/80">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 z-10" />
                <img
                  src={tplLogo}
                  alt="TPLS Logo"
                  className="w-16 h-16 object-contain relative z-20 drop-shadow-[0_0_15px_rgba(59,130,246,0.35)]"
                />
              </div>

              <div className="flex-1 py-4 pl-5 pr-6 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-base lg:text-lg font-semibold text-white/95">Join the Trading Community</p>
                  <p className="text-sm font-light text-white/70 mt-2 leading-relaxed">
                    Institutional-grade trading education and market insights.
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlusClicked(!plusClicked);
                  }}
                  className="glass-card w-10 h-10 rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer relative z-20 flex-shrink-0"
                >
                  <span className={`text-lg transition-transform duration-300 inline-block ${plusClicked ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
              </div>

              {/* Pop success interaction when clicked */}
              <AnimatePresence>
                {plusClicked && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 bg-black/95 flex items-center justify-between px-6 rounded-[1.8rem] z-30"
                  >
                    <span className="text-xs font-medium text-blue-300">Sculpting template activated!</span>
                    <button
                      onClick={() => setPlusClicked(false)}
                      className="text-xs underline text-white/60 hover:text-white cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </motion.div>

        </motion.div>

      </div>

    </div>
  );
}
