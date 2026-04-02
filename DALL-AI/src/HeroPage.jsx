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
    </div>
  );
}

const Navbar = () => {
  const navigate = useNavigate();
  const navItems = [
    { name: "Features", link: "#features" },
    { name: "Pricing", link: "#pricing" },
    { name: "Contact", link: "#contact" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
      <ResizableNavbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary">Login</NavbarButton>
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
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-xl font-bold text-slate-800 dark:text-slate-300 block py-2 border-b border-transparent hover:text-indigo-600 transition-colors">
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 mt-8">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="secondary"
                className="w-full">
                Login
              </NavbarButton>
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
