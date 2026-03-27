import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
    <div className="relative w-full h-full flex justify-center items-center p-4">
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
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row relative z-10">
        {/* LEFT COLUMN: Branding & Upload */}
        <div className="w-full md:w-1/2 bg-slate-50 p-8 md:p-10 border-r border-slate-100 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-100/50 to-transparent"></div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">
              DALL-AI <span className="text-indigo-600">Proctor</span>
            </h1>
            <p className="text-slate-500 mb-6 text-sm md:text-base leading-relaxed">
              Upload your resume to instantly generate a customized, AI-driven
              technical interview.
            </p>

            <div className="mb-4">
              {/* TIGHTENED HEIGHT: Changed h-48 to h-36 */}
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-white hover:bg-slate-50 hover:border-indigo-400 transition-all shadow-sm">
                <div className="flex flex-col items-center justify-center pt-4 pb-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-3">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                  </div>
                  <p className="mb-1 text-sm text-slate-600">
                    <span className="font-bold text-indigo-600">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                    PDF formats only
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="h-8 flex items-center">
              {file && (
                <span className="py-1 px-3 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full inline-flex items-center gap-2 border border-indigo-200">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span className="truncate max-w-[200px]">{file.name}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Configuration & Action */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">
            Interview Configuration
          </h3>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Select Difficulty Level:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Easy", "Medium", "Hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`py-2 px-2 rounded-xl text-sm font-bold transition-all border-2 ${
                    difficulty === level
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-[1.02]"
                      : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="flex justify-between items-center text-sm font-bold text-slate-700 mb-3">
              <span>Number of Questions:</span>
              <span className="text-base text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-lg border border-indigo-200">
                {questionCount}
              </span>
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2 font-semibold uppercase tracking-wider">
              <span>Short (3)</span>
              <span>In-depth (10)</span>
            </div>
          </div>

          <div className="mt-auto">
            <div className="mb-3 flex items-center justify-center gap-2 text-sm text-amber-700 bg-amber-50 py-2.5 rounded-xl border border-amber-200 font-medium">
              <svg
                className="w-5 h-5 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Estimated Session Time:{" "}
              <span className="font-bold text-amber-900">
                ~{estimatedTime} minutes
              </span>
            </div>

            <button
              onClick={handleUpload}
              disabled={isUploading || !file}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-300 flex items-center justify-center gap-3 text-base"
            >
              {isUploading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Building Interview...
                </>
              ) : (
                "Generate AI Interview"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadResume;
