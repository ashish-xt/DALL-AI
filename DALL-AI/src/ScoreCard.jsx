import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function ScoreCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [animatedScore, setAnimatedScore] = useState(0);

  const { result, difficulty, faceLostCount = 0 } = location.state || {};

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          No Score Data Found
        </h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-lg"
        >
          Return Home
        </button>
      </div>
    );
  }

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
    // Replaced the strict height with a min-h-screen and a nice padding buffer
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        {/* ==========================================
            LEFT COLUMN: Sticky Score Profile
        ========================================== */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 sticky top-10">
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
            {/* Soft background glow */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-indigo-50 to-transparent"></div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2 relative z-10 mt-2">
              Evaluation Complete
            </h2>

            <div
              className={`mt-1 mb-10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border shadow-sm ${difficultyColor} relative z-10`}
            >
              {difficulty || "Standard"} Difficulty
            </div>

            {/* Circular Progress Bar */}
            <div className="relative inline-flex items-center justify-center mb-10 relative z-10">
              {/* Outer decorative ring */}
              <div className="absolute inset-0 rounded-full border border-slate-100 scale-110"></div>

              <svg className="w-56 h-56 transform -rotate-90 drop-shadow-sm">
                <circle
                  cx="112"
                  cy="112"
                  r="96"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="112"
                  cy="112"
                  r="96"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="603"
                  strokeDashoffset={603 - (603 * animatedScore) / 100}
                  strokeLinecap="round"
                  className={`${scoreColor} transition-all duration-700 ease-out`}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-7xl font-black text-slate-800 tracking-tighter">
                  {animatedScore}
                </span>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                  / 100
                </span>
              </div>
            </div>

            {/* Proctoring Security Badge */}
            <div
              className={`w-full p-5 rounded-2xl border text-left relative z-10 transition-colors shadow-sm ${
                faceLostCount > 0
                  ? "bg-rose-50 border-rose-200"
                  : "bg-emerald-50 border-emerald-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {faceLostCount > 0 ? (
                  <svg
                    className="w-5 h-5 text-rose-600"
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
                ) : (
                  <svg
                    className="w-5 h-5 text-emerald-600"
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
                )}
                <span
                  className={`font-bold text-sm tracking-wide ${faceLostCount > 0 ? "text-rose-800" : "text-emerald-800"}`}
                >
                  Proctoring Report
                </span>
              </div>
              <p
                className={`text-xs font-semibold leading-relaxed ${faceLostCount > 0 ? "text-rose-600" : "text-emerald-600"}`}
              >
                {faceLostCount === 0
                  ? "Flawless focus. Eye contact maintained perfectly throughout the session."
                  : `Warning: Eye contact was broken or face was hidden ${faceLostCount} time${faceLostCount === 1 ? "" : "s"}.`}
              </p>
            </div>
          </div>

          {/* Action Button outside the card for emphasis */}
          <button
            onClick={() => navigate("/")}
            className="w-full py-5 px-6 bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold rounded-2xl transition duration-200 shadow-xl shadow-slate-300/50 flex items-center justify-center gap-2"
          >
            Start New Interview
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
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </button>
        </div>

        {/* ==========================================
            RIGHT COLUMN: Feedback Details 
        ========================================== */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8 pb-10">
          {/* Top Section: Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths Container */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-bl-full -z-0"></div>

              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600 shadow-inner">
                  <svg
                    className="w-6 h-6"
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
                <div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                    Key Strengths
                  </h3>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                    What caught my eye
                  </p>
                </div>
              </div>

              <ul className="space-y-5 flex-grow relative z-10">
                {result.strengths.map((strength, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 transition hover:border-emerald-200"
                  >
                    <span className="mt-1 w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      {strength}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses Container */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/50 rounded-bl-full -z-0"></div>

              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="p-3 bg-rose-100 rounded-2xl text-rose-600 shadow-inner">
                  <svg
                    className="w-6 h-6"
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
                <div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                    Growth Areas
                  </h3>
                  <p className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                    Where we need focus
                  </p>
                </div>
              </div>

              <ul className="space-y-5 flex-grow relative z-10">
                {result.weaknesses.map((weakness, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 transition hover:border-rose-200"
                  >
                    <span className="mt-1 w-2 h-2 rounded-full bg-rose-400 flex-shrink-0 shadow-[0_0_8px_rgba(251,113,133,0.8)]"></span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      {weakness}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section: AI Mentor Feedback Banner */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden mt-4">
            {/* Background ambient light */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
              {/* Profile image overlapping the text slightly */}
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-50 translate-y-2"></div>
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                  alt="DALL-AI"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-slate-800 relative z-10"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-slate-900 z-20"></div>
              </div>

              <div className="flex-grow pt-2">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6 border-b border-slate-700/50 pb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide mb-1">
                      My Detailed Analysis
                    </h1>
                    <p className="text-slate-400 font-medium">
                      Direct feedback from your DALL-AI Interviewer
                    </p>
                  </div>
                  <svg
                    className="w-10 h-10 text-indigo-500/30"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"></path>
                  </svg>
                </div>

                <p className="text-slate-200 leading-loose text-base md:text-lg font-medium whitespace-pre-line">
                  {result.improvementTips}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoreCard;
