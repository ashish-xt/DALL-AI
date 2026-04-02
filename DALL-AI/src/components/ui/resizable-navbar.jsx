import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = ({ children }) => {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 inset-x-0 mx-auto z-50 w-[95%] max-w-5xl border border-slate-200 bg-slate-100/90 backdrop-blur-md rounded-full shadow-2xl"
    >
      <div className="px-6">
        {children}
      </div>
    </motion.nav>
  );
};

export const NavBody = ({ children }) => (
  <div className="hidden md:flex h-16 items-center justify-between">
    {children}
  </div>
);

export const NavItems = ({ items }) => (
  <div className="flex items-center gap-8">
    {items.map((item, idx) => (
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        key={idx}
        href={item.link}
        className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        {item.name}
      </motion.a>
    ))}
  </div>
);

export const MobileNav = ({ children }) => (
  <div className="md:hidden flex flex-col w-full py-4 px-2 relative">
    {children}
  </div>
);

export const NavbarLogo = () => (
  <div className="flex items-center gap-2">
    <div className="size-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-50 font-black text-xs shadow-sm">AI</div>
    <h1 className="text-xl font-bold text-slate-900 tracking-tight">DALL-AI</h1>
  </div>
);

export const NavbarButton = ({ children, variant, className = "", onClick }) => {
  const base = "px-5 py-2 text-sm font-semibold rounded-full shadow-sm transition-colors";
  const variants = {
    primary: "bg-slate-900 text-slate-50 hover:bg-slate-800",
    secondary: "bg-transparent text-slate-800 hover:bg-slate-200",
  };
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export const MobileNavHeader = ({ children }) => (
  <div className="flex items-center justify-between w-full h-12">
    {children}
  </div>
);

export const MobileNavToggle = ({ isOpen, onClick }) => (
  <motion.button 
    whileTap={{ scale: 0.9 }}
    onClick={onClick} 
    className="p-2 text-slate-800 hover:bg-slate-200 rounded-full transition-colors"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {isOpen ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
      )}
    </svg>
  </motion.button>
);

export const MobileNavMenu = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden bg-slate-100 rounded-3xl mt-4 border border-slate-200"
      >
        <div className="flex flex-col gap-4 p-6 pt-2">
          {children}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
