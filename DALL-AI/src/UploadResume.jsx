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

  // ==========================================
  // Animated Toast Logic
  // ==========================================
  useEffect(() => {
    // Only trigger if the cancelled state is explicitly true
    if (location.state && location.state.cancelled) {
      setShowToast(true);

      setTimeout(() => setShrink(true), 50);

      const timer = setTimeout(() => {
        setShowToast(false);
        setShrink(false);
        // We moved the cleanup inside the timer! Now it waits 3 seconds before clearing the history.
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
    <div className="relative w-full max-w-md">
      {/* ==========================================
          NEW: Right-Side Toast with Progress Bar
      ========================================== */}
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

        {/* The 3-second Shrinking Bar */}
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

      {/* Main Upload Card */}
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl text-center border border-slate-100 relative z-10">
        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
          DALL-AI
        </h2>
        <p className="text-slate-500 mb-8 text-sm md:text-base">
          Upload your resume to generate your customized technical interview.
        </p>

        <div className="mb-6">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-3 text-indigo-400"
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
              <p className="mb-2 text-sm text-slate-600">
                <span className="font-semibold text-indigo-600">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-slate-400">PDF formats only</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </label>
          {file && (
            <div className="mt-3 py-2 px-4 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-lg inline-block border border-indigo-100">
              {file.name}
            </div>
          )}
        </div>

        {/* Difficulty Selector */}
        <div className="mb-6 text-left">
          <label className="block text-sm font-bold text-slate-700 mb-3">
            Select Difficulty:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["Easy", "Medium", "Hard"].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all border ${
                  difficulty === level
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count Selector */}
        <div className="mb-8 text-left">
          <label className="flex justify-between text-sm font-bold text-slate-700 mb-3">
            <span>Number of Questions:</span>
            <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
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

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500 bg-slate-50 py-2 rounded-lg border border-slate-100">
            <svg
              className="w-4 h-4 text-indigo-400"
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
            Estimated Time:{" "}
            <span className="font-bold text-slate-700">
              ~{estimatedTime} mins
            </span>
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={isUploading || !file}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
        >
          {isUploading
            ? "Reading Resume & Building Interview..."
            : "Generate Interview"}
        </button>
      </div>
    </div>
  );
}

export default UploadResume;
