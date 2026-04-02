import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

function Malpractice() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center border-t-8 border-rose-600"
    >
      <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-10 h-10 text-rose-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-4">
        Interview Terminated
      </h1>
      <p className="text-slate-600 mb-8 leading-relaxed">
        Your session has been canceled due to a violation of the interview
        environment rules (exiting fullscreen or switching tabs). No report will
        be generated.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg"
      >
        Return to Home
      </motion.button>
    </motion.div>
  );
}

export default Malpractice;
