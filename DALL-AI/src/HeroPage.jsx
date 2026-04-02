import React, { useState } from 'react';
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./components/ui/resizable-navbar";

export default function HeroPage() {
  const navigate = useNavigate();
  return (
    <div className="relative w-full min-h-screen bg-slate-50 flex flex-col overflow-x-hidden">
      <Navbar />
      <div className="flex-1 relative mx-auto my-10 flex w-full max-w-7xl flex-col items-center justify-center">
        {/* Background Gradients */}
        <div className="absolute inset-y-0 left-0 h-full w-px bg-slate-200 hidden md:block">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-indigo-500 to-transparent" />
        </div>
        <div className="absolute inset-y-0 right-0 h-full w-px bg-slate-200 hidden md:block">
          <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-indigo-500 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px w-full bg-slate-200 hidden md:block">
          <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </div>
        <div className="px-4 py-10 md:py-20 flex-1 flex flex-col justify-center w-full">
          <h1 className="relative z-10 mx-auto max-w-5xl text-center text-4xl font-black text-slate-800 md:text-6xl lg:text-7xl tracking-tight leading-tight">
            {"Ace your technical interview in hours, not days."
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="mr-3 inline-block"
                >
                  {word}
                </motion.span>
              ))}
          </h1>
          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 0.8,
            }}
            className="relative z-10 mx-auto max-w-2xl py-6 text-center text-lg md:text-xl font-medium text-slate-500"
          >
            Upload your resume and get a customized, state-of-the-art AI-driven mock interview. Practice real-world coding questions, improve your answers, and receive detailed scorecards.
          </motion.p>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 1,
            }}
            className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-4"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/setup')}
              className="w-48 md:w-60 rounded-2xl bg-indigo-600 px-6 py-3.5 font-bold text-white transition-all duration-300 hover:bg-indigo-700 shadow-xl shadow-indigo-200">
              Get Started Free
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-48 md:w-60 rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:border-slate-300">
              View Features
            </motion.button>
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 1.2,
            }}
            className="relative z-10 mx-auto mt-20 w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl"
          >
            <div className="w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 relative flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
               <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-white">
                  {/* Mock UI snippet to show a preview */}
                  <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-100 p-6 transform transition-transform hover:scale-105 duration-500">
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">AI</div>
                      <div>
                        <h3 className="font-bold text-slate-800">DALL-AI Proctor</h3>
                        <p className="text-sm text-slate-500">Live Mock Interview Environment</p>
                      </div>
                      <div className="ml-auto w-3 h-3 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="w-3/4 h-4 bg-slate-100 rounded"></div>
                      <div className="w-full h-4 bg-slate-100 rounded"></div>
                      <div className="w-5/6 h-4 bg-slate-100 rounded"></div>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="h-40 bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden relative shadow-inner">
                         <div className="absolute inset-0 opacity-30 bg-center bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600')" }}></div>
                         <div className="text-white text-xs font-bold z-10 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 uppercase tracking-widest">Webcam Preview</div>
                      </div>
                      <div className="h-40 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-xl flex items-center justify-center text-indigo-500 font-bold p-6 text-center leading-relaxed">
                         Integrated Code Editor & Real-time Evaluation
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
      <FeaturesSection />
    </div>
  );
}

const FeaturesSection = () => {
  const features = [
    {
      title: "Contextual Interviews",
      description: "Our AI engine analyzes your uploaded resume to instantly generate tailored, role-specific questions.",
      icon: (
        <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Active Proctoring",
      description: "Advanced head-pose tracking and tab-switching monitoring maintains strict assessment integrity.",
      icon: (
        <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      title: "Voice-Based Answers",
      description: "Candidates respond naturally using their microphone. Answers are transcribed in real-time via speech-to-text for accurate evaluation.",
      icon: (
        <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    },
    {
      title: "Detailed Scorecards",
      description: "Receive immediate, comprehensive breakdowns highlighting hard skills, problem-solving, and communication.",
      icon: (
        <svg className="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <section id="features" className="w-full py-24 bg-white border-t border-slate-100 flex justify-center z-10 relative scroll-mt-6">
      <div className="max-w-7xl px-4 md:px-8 w-full flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mb-16"
        >
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Core Capabilities</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight mb-6">
            Everything you need to <br className="hidden md:block" /> screen talent at scale.
          </h3>
          <p className="text-slate-500 text-lg">
            DALL-AI Proctor replaces hours of manual screening with an automated, high-fidelity technical interview suite.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-2xl hover:border-indigo-200 hover:-translate-y-2 transition-all duration-300 flex flex-col items-start"
            >
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center justify-center">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const navItems = [];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
      <ResizableNavbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <div className="flex items-center gap-4">
            <NavbarButton variant="primary" onClick={() => navigate('/setup')}>Get Started</NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            <div className="flex w-full flex-col gap-4 mt-2">
              <NavbarButton
                onClick={() => { setIsMobileMenuOpen(false); navigate('/setup'); }}
                variant="primary"
                className="w-full">
                Get Started
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </ResizableNavbar>
  );
};
