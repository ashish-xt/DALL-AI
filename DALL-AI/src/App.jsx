import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Notice we removed the "/pages/" part!
import UploadResume from "./UploadResume";
import InterviewWindow from "./InterviewWindow";
import ScoreCard from "./ScoreCard";
import Malpractice from "./Malpractice";
import "./style.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
        <Routes>
          <Route path="/" element={<UploadResume />} />
          <Route path="/interview" element={<InterviewWindow />} />
          <Route path="/score" element={<ScoreCard />} />
          <Route path="/malpractice" element={<Malpractice />} /> {/* NEW */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
