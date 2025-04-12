import { useEffect, useState, useRef } from "react";
import "./PomodoroTimer.css";
import alarmSound from "./mixkit-short-rooster-crowing-2470.mp3";

const DEFAULTS = {
  focus: 25 * 60,
  "short time": 5 * 60,
  "long time": 15 * 60,
};

const PomodoroTimer = () => {
  const choose = ["focus", "short time", "long time"];
  const add = [
    { label: "+25 min", value: 25 * 60 },
    { label: "+10 min", value: 10 * 60 },
    { label: "+5 min", value: 5 * 60 },
    { label: "+1 min", value: 1 * 60 },
  ];

  const [sessionType, setSessionType] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(DEFAULTS[sessionType]);
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    setTimeLeft(DEFAULTS[sessionType]);
  }, [sessionType]);

  useEffect(() => {
    let timer = null;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  // Play sound when timer ends
  useEffect(() => {
    if (timeLeft === 0) {
      audioRef.current?.play().catch((err) => {
        console.warn("Audio playback failed:", err);
      });
    }
  }, [timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(DEFAULTS[sessionType]);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <main>
      <h1>Pomodoro Timer</h1>
      <div>
        <div>
          {choose.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSessionType(item);
                setIsRunning(false);
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <p>
          Current Session: <strong>{sessionType}</strong>
        </p>
        <p>{formatTime(timeLeft)}</p>

        <div>
          {add.map((item) => (
            <button
              key={item.label}
              onClick={() => setTimeLeft((prev) => prev + item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button onClick={toggleTimer}>{isRunning ? "Pause" : "Start"}</button>
        <button onClick={resetTimer}>Reset</button>
      </div>

      <audio ref={audioRef}>
        <source src={alarmSound} type="audio/mpeg" />
      </audio>
    </main>
  );
};

export default PomodoroTimer;
