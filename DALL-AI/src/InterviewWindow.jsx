import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import { motion } from "motion/react";

function InterviewWindow() {
  const navigate = useNavigate();
  const location = useLocation();

  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [qaHistory, setQaHistory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [replayCount, setReplayCount] = useState(0);

  const [timeLeft, setTimeLeft] = useState(0);
  const timeLimits = { Easy: 120, Medium: 180, Hard: 300 };

  const [isReady, setIsReady] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [malpracticeWarning, setMalpracticeWarning] = useState(false);
  const [strikes, setStrikes] = useState(0);

  // ==========================================
  // NEW: Real-Time Face Detection States
  // ==========================================
  // Change faceWarning to track the specific error message
  const [faceWarningType, setFaceWarningType] = useState(null); // null, 'missing', or 'multiple'
  const [faceLostCount, setFaceLostCount] = useState(0);
  const faceModelRef = useRef(null);
  const isFaceMissingRef = useRef(false); // Prevents counting the same incident 60x a second

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const currentAudioRef = useRef(null);
  const isCancelledRef = useRef(false);

  // LOAD TENSORFLOW MODEL ON MOUNT
  useEffect(() => {
    isCancelledRef.current = false;

    const loadAIModels = async () => {
      try {
        await tf.ready();
        faceModelRef.current = await blazeface.load();
        console.log("BlazeFace Model Loaded!");
      } catch (err) {
        console.error("Failed to load face detection model:", err);
      }
    };
    loadAIModels();

    return () => {
      isCancelledRef.current = true;
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.src = "";
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // INIT DATA
  useEffect(() => {
    if (
      location.state &&
      location.state.questions &&
      location.state.questions.length > 0
    ) {
      setQuestions(location.state.questions);
      setDifficulty(location.state.difficulty || "Medium");
      setTimeLeft(timeLimits[location.state.difficulty || "Medium"]);
    } else {
      alert("No interview session found. Please upload your resume first.");
      navigate("/");
    }
  }, [location, navigate]);

  // TIMER LOGIC
  useEffect(() => {
    if (!isReady || isSpeaking || timeLeft <= 0 || isSubmitting) return;
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [isReady, isSpeaking, timeLeft, isSubmitting]);

  useEffect(() => {
    if (timeLeft === 0 && isReady && isRecording) stopRecording();
  }, [timeLeft, isReady, isRecording]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // TEXT-TO-SPEECH
  const speakQuestion = async (text) => {
    if (!text || isCancelledRef.current) return;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/generate-speech",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        },
      );
      if (!response.ok) throw new Error("Failed to fetch audio");
      if (isCancelledRef.current) return;

      const blob = await response.blob();
      if (isCancelledRef.current) return;

      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => setIsSpeaking(false);

      if (!isCancelledRef.current) audio.play();
    } catch (error) {
      console.error("Audio playback error:", error);
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (isReady && questions.length > 0) {
      setReplayCount(0);
      setTimeLeft(timeLimits[difficulty]);
      const timer = setTimeout(
        () => speakQuestion(questions[currentIndex]),
        500,
      );
      return () => clearTimeout(timer);
    }
  }, [currentIndex, questions, isReady, difficulty]);

  const handleReplay = () => {
    if (replayCount < 1 && !isSpeaking) {
      setReplayCount((prev) => prev + 1);
      speakQuestion(questions[currentIndex]);
    }
  };

  // PROCTORING CHECKS (Tabs/Fullscreen)
  useEffect(() => {
    if (!isReady) return;
    const handleVisibilityChange = () => {
      if (document.hidden)
        triggerMalpractice("You switched tabs or minimized the window.");
    };
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !malpracticeWarning)
        triggerMalpractice("You exited fullscreen mode.");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isReady, strikes, malpracticeWarning]);

  const killCameraFeed = () => {
    if (streamRef.current)
      streamRef.current.getTracks().forEach((track) => track.stop());
  };

  const triggerMalpractice = (reason) => {
    if (strikes === 0) {
      setMalpracticeWarning(true);
      setStrikes(1);
    } else {
      isCancelledRef.current = true;
      if (currentAudioRef.current) currentAudioRef.current.pause();
      if (document.fullscreenElement) document.exitFullscreen();
      killCameraFeed();
      navigate("/malpractice");
    }
  };

  const handleResumeFromWarning = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setMalpracticeWarning(false);
    } catch (err) {
      alert("You must allow fullscreen to continue the interview.");
    }
  };

  // ==========================================
  // WEBCAM & REAL-TIME FACE TRACKING ENGINE
  // ==========================================
  useEffect(() => {
    let animationId;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };

    const detectFace = async () => {
      if (
        videoRef.current &&
        faceModelRef.current &&
        videoRef.current.readyState === 4 &&
        isReady
      ) {
        const faces = await faceModelRef.current.estimateFaces(
          videoRef.current,
          false,
        );

        if (faces.length === 0) {
          setFaceWarningType("missing");
          if (!isFaceMissingRef.current) {
            setFaceLostCount((prev) => prev + 1);
            isFaceMissingRef.current = true;
          }
        } else if (faces.length > 1) {
          setFaceWarningType("multiple");
          if (!isFaceMissingRef.current) {
            setFaceLostCount((prev) => prev + 1);
            isFaceMissingRef.current = true;
          }
        } else {
          // Exactly 1 face detected. All good!
          setFaceWarningType(null);
          isFaceMissingRef.current = false;
        }
      }
      animationId = requestAnimationFrame(detectFace);
    };

    if (isReady) {
      startCamera().then(() => {
        detectFace(); // Start scanning once camera is on
      });
    } else if (streamRef.current) {
      killCameraFeed();
      streamRef.current = null;
    }

    return () => {
      killCameraFeed();
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isReady]);

  const startEnvironment = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      stream.getTracks().forEach((track) => track.stop());
      await document.documentElement.requestFullscreen();
      setIsReady(true);
    } catch (error) {
      alert(
        "You must allow Camera and Microphone access to start the interview.",
      );
    }
  };

  const handleVoluntaryCancel = () => {
    isCancelledRef.current = true;
    if (currentAudioRef.current) currentAudioRef.current.pause();
    window.speechSynthesis.cancel();
    if (document.fullscreenElement) document.exitFullscreen();
    killCameraFeed();
    navigate("/", { state: { cancelled: true } });
  };

  // AUDIO RECORDING
  const startRecording = async () => {
    if (timeLeft === 0) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await sendAudioToBackend(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      alert("Please allow microphone access to record your answer.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () =>
    isRecording ? stopRecording() : startRecording();

  const sendAudioToBackend = async (audioBlob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "answer.webm");
      const response = await fetch("http://localhost:5000/api/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok)
        setCurrentAnswer((prev) => prev + (prev ? " " : "") + data.text);
      else alert(data.error || "Failed to transcribe audio.");
    } catch (error) {
      alert("Could not connect to the backend server.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!currentAnswer.trim() && timeLeft > 0) return;
    setIsSubmitting(true);
    if (currentAudioRef.current) currentAudioRef.current.pause();

    const updatedHistory = [
      ...qaHistory,
      {
        question: questions[currentIndex],
        answer: currentAnswer || "No answer provided within the time limit.",
      },
    ];
    setQaHistory(updatedHistory);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentAnswer("");
      setIsSubmitting(false);
    } else {
      try {
        // NEW: We are now sending faceLostCount to the AI Grader!
        const response = await fetch("http://localhost:5000/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interviewData: updatedHistory,
            faceLostCount: faceLostCount,
          }),
        });
        const evaluation = await response.json();
        if (response.ok) {
          if (document.fullscreenElement) document.exitFullscreen();
          // We are adding faceLostCount to the router state!
          navigate("/score", {
            state: {
              result: evaluation,
              difficulty: difficulty,
              faceLostCount: faceLostCount,
            },
          });
        } else {
          alert("Failed to score interview. Please try again.");
          setIsSubmitting(false);
        }
      } catch (error) {
        alert("Server error while evaluating.");
        setIsSubmitting(false);
      }
    }
  };

  // ==========================================
  // RENDER 1: Pre-Interview Check
  // ==========================================
  if (!isReady) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 max-w-md w-full text-center border border-slate-100"
      >
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Environment Check
        </h2>
        <p className="text-slate-500 mb-8 text-sm">
          This <span className="font-bold text-indigo-600">{difficulty}</span>{" "}
          level interview uses AI face-tracking to ensure fairness. Keep your
          face visible.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startEnvironment}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg"
        >
          Grant Access & Start
        </motion.button>
      </motion.div>
    );
  }

  // ==========================================
  // RENDER 2: Main Interview
  // ==========================================
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[90vh] relative"
    >
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-white font-bold tracking-widest text-sm uppercase">
            Proctoring Active
          </span>
        </div>

        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-sm tracking-widest border-2 transition-colors ${
            timeLeft === 0
              ? "bg-red-500 border-red-500 text-white animate-pulse"
              : timeLeft <= 30
                ? "bg-amber-100 border-amber-400 text-amber-700 animate-pulse"
                : "bg-slate-800 border-slate-700 text-slate-300"
          }`}
        >
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          {timeLeft === 0 ? "TIME UP" : formatTime(timeLeft)}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCancelModal(true)}
          className="text-slate-300 hover:text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/10"
        >
          Cancel Interview
        </motion.button>
      </div>

      <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        <div className="w-full md:w-1/2 bg-slate-50 border-r border-slate-200 p-8 flex flex-col relative overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              DALL-AI Interview
            </h2>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Q {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="flex-grow flex flex-col items-center justify-center relative my-auto">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-indigo-100 shadow-xl mb-6 relative">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                alt="AI Interviewer"
                className={`w-full h-full object-cover transition-transform duration-700 ${isSpeaking ? "scale-105" : "scale-100"}`}
              />
              {isSpeaking && (
                <div className="absolute bottom-4 right-8 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 max-w-md w-full relative mb-4">
              <p className="text-slate-800 text-lg font-medium leading-relaxed">
                "{questions[currentIndex]}"
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReplay}
              disabled={replayCount >= 1 || isSpeaking || timeLeft === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${replayCount >= 1 || timeLeft === 0 ? "bg-slate-200 text-slate-400 cursor-not-allowed" : isSpeaking ? "bg-indigo-100 text-indigo-400 cursor-not-allowed" : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 active:bg-indigo-300"}`}
            >
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              {replayCount >= 1 ? "Replay Used" : "Replay Question (1 left)"}
            </motion.button>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col bg-white overflow-y-auto">
          <div className="relative w-full h-64 bg-slate-900 rounded-2xl overflow-hidden shadow-inner mb-6 flex-shrink-0">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform scale-x-[-1] transition duration-300 ${faceWarningType ? "opacity-50 blur-sm" : ""}`}
            />

            {/* UPDATED: REAL-TIME FACE WARNING OVERLAY */}
            {faceWarningType && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/40">
                <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold animate-bounce flex items-center gap-2 shadow-2xl border-2 border-red-300">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                  </svg>
                  {faceWarningType === "missing"
                    ? "WARNING: Face not visible in camera!"
                    : "WARNING: Multiple faces detected!"}
                </div>
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${faceWarningType ? "bg-red-500" : "bg-green-500"}`}
                ></span>
                {faceWarningType ? "Tracking Lost" : "Tracking Active"}
              </span>
              <span className="bg-black/50 backdrop-blur-sm text-indigo-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                {difficulty}
              </span>
            </div>
          </div>

          <div className="flex-grow flex flex-col relative">
            <div className="relative flex-grow mb-4">
              <textarea
                className={`w-full h-full min-h-[120px] p-4 pr-16 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none outline-none ${isTranscribing || isSpeaking || timeLeft === 0 ? "opacity-50" : ""}`}
                placeholder={
                  timeLeft === 0
                    ? "Time is up. Please move to the next question."
                    : isTranscribing
                      ? "Transcribing your answer..."
                      : isSpeaking
                        ? "Listen to the question..."
                        : "Type your answer here or record audio..."
                }
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                disabled={isTranscribing || isSpeaking || timeLeft === 0}
              />

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleRecording}
                disabled={isTranscribing || isSpeaking || timeLeft === 0}
                className={`absolute bottom-4 right-4 p-3 rounded-full shadow-md flex items-center justify-center 
                  ${
                    isRecording
                      ? "bg-red-500 text-white animate-pulse hover:bg-red-600"
                      : isTranscribing || isSpeaking || timeLeft === 0
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-100"
                  }`}
              >
                {isTranscribing ? (
                  <svg
                    className="animate-spin w-5 h-5 text-indigo-600"
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
                ) : isRecording ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 6h12v12H6z"></path>
                  </svg>
                ) : (
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
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    ></path>
                  </svg>
                )}
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNextQuestion}
              disabled={
                isSubmitting ||
                isTranscribing ||
                (!currentAnswer.trim() && timeLeft > 0) ||
                isSpeaking
              }
              className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${timeLeft === 0 ? "bg-red-500 hover:bg-red-600 shadow-red-200 animate-pulse" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"}`}
            >
              {isSubmitting
                ? "Saving & Evaluating..."
                : currentIndex === questions.length - 1
                  ? "Submit Final Answer"
                  : "Next Question"}
            </motion.button>
          </div>
        </div>
      </div>

      {showCancelModal && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Are you sure?
            </h3>
            <p className="text-slate-500 mb-6 text-sm">
              All progress will be lost and no evaluation will be generated.
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
              >
                Go Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVoluntaryCancel}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-200"
              >
                Yes, Exit
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {malpracticeWarning && (
        <div className="absolute inset-0 bg-red-900/90 backdrop-blur-md flex items-center justify-center z-50 p-6 text-center">
          <div className="max-w-md">
            <svg
              className="w-20 h-20 text-red-400 mx-auto mb-6"
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
            <h2 className="text-3xl font-black text-white mb-4">WARNING</h2>
            <p className="text-red-100 text-lg mb-8 leading-relaxed">
              Suspicious activity detected. You must remain in Fullscreen mode
              and keep this tab active.{" "}
              <strong>
                One more violation will result in immediate termination.
              </strong>
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResumeFromWarning}
              className="px-8 py-3 bg-white text-red-900 font-bold rounded-xl hover:bg-red-50 shadow-xl"
            >
              I Understand, Resume Interview
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default InterviewWindow;
