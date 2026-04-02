import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import HeroPage from "./HeroPage";
import UploadResume from "./UploadResume";
import InterviewWindow from "./InterviewWindow";
import ScoreCard from "./ScoreCard";
import Malpractice from "./Malpractice";
import "./style.css";

function AppContent() {
  const location = useLocation();
  const isHero = location.pathname === "/";

  return (
    <div className={isHero ? "w-full min-h-screen font-sans text-slate-800" : "min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800"}>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/setup" element={<UploadResume />} />
        <Route path="/interview" element={<InterviewWindow />} />
        <Route path="/score" element={<ScoreCard />} />
        <Route path="/malpractice" element={<Malpractice />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
