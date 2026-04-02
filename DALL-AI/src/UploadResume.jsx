import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState("Medium");
  const [isUploading, setIsUploading] = useState(false);

  // Toast States
  const [showToast, setShowToast] = useState(false);
  const [shrink, setShrink] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.cancelled) {
      setShowToast(true);
      setTimeout(() => setShrink(true), 50);

      const timer = setTimeout(() => {
        setShowToast(false);
        setShrink(false);
        navigate(location.pathname, { replace: true, state: {} });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location.state?.cancelled, location.pathname, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF resume first.");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("questionCount", questionCount);
      formData.append("difficulty", difficulty);

      const response = await fetch("http://localhost:5000/api/analyze-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/interview", {
          state: { questions: data.questions, difficulty: difficulty },
        });
      } else {
        alert(data.error || "Failed to analyze resume.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Could not connect to the backend server.");
    } finally {
      setIsUploading(false);
    }
  };

  const timePerQuestion =
    difficulty === "Easy" ? 2 : difficulty === "Medium" ? 3 : 5;
  const estimatedTime = questionCount * timePerQuestion;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full max-w-5xl h-[calc(100vh-2.5rem)] flex justify-center items-center"
    >
      {/* Toast Notification */}
      <div
        className={`fixed top-8 right-8 w-80 bg-slate-900 text-white rounded-xl shadow-2xl overflow-hidden z-50 transition-all duration-500 transform ${
          showToast
            ? "translate-x-0 opacity-100"
            : "translate-x-12 opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <p className="text-sm font-medium tracking-wide">
            Interview cancelled.
          </p>
        </div>
        <div className="h-1 w-full bg-slate-800">
          <div
            className="h-full bg-indigo-500 ease-linear"
            style={{
              width: shrink ? "0%" : "100%",
              transition: "width 3000ms linear",
            }}
          ></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-h-full bg-slate-50/80 backdrop-blur-3xl rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-200/50 overflow-hidden flex flex-col md:flex-row relative z-10">
        
        {/* LEFT COLUMN: Branding & Upload */}
        <div className="w-full md:w-1/2 p-6 md:p-10 border-b md:border-b-0 md:border-r border-slate-200/30 flex flex-col justify-center relative overflow-y-auto bg-slate-50/50" style={{ scrollbarWidth: 'none' }}>
          {/* Subtle Background Glows */}
          <div className="absolute -top-32 -left-32 w-48 h-48 bg-indigo-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-32 -right-32 w-48 h-48 bg-emerald-500/20 rounded-full blur-[80px]"></div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Step 1: Context
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight leading-none">
                Upload your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Resume</span>
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                Our AI instantly parses your document to build a highly tailored, role-specific technical interview environment.
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center">
              <label className="group relative flex flex-col items-center justify-center w-full h-full min-h-[160px] border-2 border-slate-300 border-dashed rounded-3xl cursor-pointer bg-slate-100/30 hover:bg-slate-100/80 hover:border-indigo-400 transition-all duration-500 overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 bg-slate-900 text-slate-100 rounded-2xl flex items-center justify-center mb-4 shadow-2xl transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-400 transition-colors">
                    Click to browse
                  </h3>
                  <p className="text-slate-500 text-sm max-w-[200px]">
                    or drag and drop your PDF file here
                  </p>
                 </div>
                 <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
              </label>
            </div>

            <div className="h-12 mt-4 flex justify-center items-center">
              <AnimatePresence mode="wait">
              {file ? (
                <motion.div 
                  initial={{ opacity:0, y:10, scale:0.95 }} 
                  animate={{ opacity:1, y:0, scale:1 }} 
                  exit={{ opacity:0, y:-10, scale:0.95 }} 
                  className="px-4 py-3 bg-indigo-500/10 text-indigo-400 text-sm font-bold rounded-2xl flex items-center justify-between w-full max-w-xs border border-indigo-500/20 backdrop-blur-md shadow-inner"
                >
                   <div className="flex items-center gap-3 overflow-hidden">
                     <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     <span className="truncate">{file.name}</span>
                   </div>
                   <button onClick={(e) => { e.preventDefault(); setFile(null); }} className="p-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 rounded-full text-indigo-300 hover:text-white transition-colors ml-2 flex-shrink-0">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                   </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-slate-400 text-xs font-semibold uppercase tracking-widest flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full border border-slate-400"></span>
                  Awaiting File
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Configuration & Action */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col bg-white overflow-y-auto relative" style={{ scrollbarWidth: 'none' }}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-slate-100 rounded-bl-[100px] opacity-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest mb-3">
                Step 2: Configuration
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Interview Settings</h2>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <label className="flex items-center justify-between text-sm font-bold text-slate-700 mb-3">
                  <span>Difficulty Level</span>
                  <span className="text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md text-xs">{difficulty}</span>
                </label>
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                  {["Easy", "Medium", "Hard"].map((level) => (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`py-3 px-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                        difficulty === level
                          ? "bg-white text-slate-900 shadow-md shadow-slate-200/50"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                      }`}
                    >
                      {level}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex justify-between items-center text-sm font-bold text-slate-700 mb-4">
                  <span>Question Count</span>
                  <span className="text-xl font-black text-slate-900 w-8 text-right">{questionCount}</span>
                </label>
                <div className="relative pt-1 pb-4">
                  <input
                    type="range"
                    min="3"
                    max="10"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(e.target.value)}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 hover:bg-slate-300 transition-colors focus:outline-none accent-indigo-500"
                  />
                  <div className="absolute top-8 w-full flex justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                    <span>3 (Short)</span>
                    <span>10 (Deep)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <svg className="w-5 h-5 opacity-70 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>Estimated Time</span>
                </div>
                <span className="text-xl font-black text-slate-900">~{estimatedTime} min</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={isUploading || !file}
                className="w-full bg-slate-900 text-slate-50 hover:bg-indigo-600 hover:text-white hover:shadow-indigo-500/25 font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 text-base group"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 opacity-70 border-2 border-slate-500 border-t-slate-50 rounded-full" viewBox="0 0 24 24"></svg>
                    <span>Generating Environment...</span>
                  </>
                ) : (
                  <>
                    <span>Initialize Interview</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UploadResume;
