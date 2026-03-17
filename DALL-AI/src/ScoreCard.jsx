import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function ScoreCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [animatedScore, setAnimatedScore] = useState(0);

  // Retrieve the evaluation data and difficulty passed from the InterviewWindow
  const { result, difficulty } = location.state || {};

  // Animate the score counting up when the page loads
  useEffect(() => {
    if (result && result.overallScore) {
      const target = result.overallScore;
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));

      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          setAnimatedScore(target);
          clearInterval(interval);
        } else {
          setAnimatedScore(current);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [result]);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          No Score Data Found
        </h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Calculate colors based on performance
  const scoreColor =
    result.overallScore >= 80
      ? "text-emerald-500"
      : result.overallScore >= 60
        ? "text-amber-500"
        : "text-rose-500";
  const difficultyColor =
    difficulty === "Hard"
      ? "bg-rose-100 text-rose-700 border-rose-200"
      : difficulty === "Medium"
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-emerald-100 text-emerald-700 border-emerald-200";

  return (
    <div className="w-full max-w-5xl bg-slate-50 min-h-[85vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
      {/* LEFT PANEL: The Score Ring & Summary */}
      <div className="w-full md:w-1/3 bg-white border-r border-slate-200 p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-50 to-white opacity-50"></div>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2 relative z-10">
          Interview Complete
        </h2>

        {/* Difficulty Badge */}
        <div
          className={`mt-2 mb-8 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${difficultyColor} relative z-10`}
        >
          {difficulty || "Standard"} Level
        </div>

        {/* Circular Progress Bar */}
        <div className="relative inline-flex items-center justify-center mb-8 relative z-10">
          <svg className="w-48 h-48 transform -rotate-90 drop-shadow-md">
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-100"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray="502"
              strokeDashoffset={502 - (502 * animatedScore) / 100}
              strokeLinecap="round"
              className={`${scoreColor} transition-all duration-300 ease-out`}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-slate-800 tracking-tighter">
              {animatedScore}
            </span>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
              / 100
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-auto py-4 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition duration-200 shadow-xl shadow-slate-200 relative z-10"
        >
          Start New Interview
        </button>
      </div>

      {/* RIGHT PANEL: First-Person AI Feedback */}
      <div className="w-full md:w-2/3 p-8 md:p-10 bg-slate-50 overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
            alt="DALL-AI"
            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-800">My Analysis</h1>
            <p className="text-sm text-slate-500 font-medium">
              Feedback from your DALL-AI Interviewer
            </p>
          </div>
        </div>

        {/* Top Grid: Strengths and Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths Card */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                What caught my eye
              </h3>
            </div>
            <ul className="space-y-3">
              {result.strengths.map((strength, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed"
                >
                  <span className="mt-1 text-emerald-500 flex-shrink-0">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses Card */}
          <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Where we need focus
              </h3>
            </div>
            <ul className="space-y-3">
              {result.weaknesses.map((weakness, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed"
                >
                  <span className="mt-1 text-rose-500 flex-shrink-0">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Direct Message Bubble for Advice */}
        <div className="relative">
          {/* Chat bubble tail */}
          <div className="absolute -top-3 left-6 w-6 h-6 bg-indigo-600 transform rotate-45"></div>

          <div className="bg-indigo-600 p-6 md:p-8 rounded-2xl rounded-tl-xl relative shadow-xl text-white">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-6 h-6 text-indigo-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                ></path>
              </svg>
              <h3 className="text-lg font-bold text-white tracking-wide">
                My advice to you:
              </h3>
            </div>

            <p className="text-indigo-50 leading-relaxed text-sm md:text-base font-medium">
              "{result.improvementTips}"
            </p>

            <div className="mt-6 pt-6 border-t border-indigo-500/50 flex justify-between items-center">
              <span className="text-indigo-200 text-xs font-bold tracking-widest uppercase">
                End of Report
              </span>
              <span className="text-indigo-200 text-sm font-medium italic">
                - DALL-AI
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoreCard;
