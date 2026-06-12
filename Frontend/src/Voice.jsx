import React, { useState, useRef, useEffect } from "react";
import "./Voice.css";

function Voice({ onSendPrompt }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Ask for mic permission once when component mounts
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
          alert("Speech Recognition not supported");
          return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          console.log("Mic started");
          setListening(true);
        };

        recognition.onresult = (event) => {
          const transcript =
            event.results[event.results.length - 1][0].transcript;

          console.log("You said:", transcript);

          if (event.results[event.results.length - 1].isFinal) {
            if (onSendPrompt) {
              onSendPrompt(transcript);
            }
          }
        };

        recognition.onerror = (event) => {
          console.log("Recognition error:", event.error);
          setListening(false);
        };

        recognition.onend = () => {
          console.log("Mic ended");
          setListening(false);
        };

        recognitionRef.current = recognition;
      })
      .catch(() => {
        alert("Microphone permission denied");
      });
  }, [onSendPrompt]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <button
      id="mic"
      type="button"
      className={listening ? "listening" : "notListening"}
      onClick={toggleListening}
    >
      <i
        className={`fa-solid ${
          listening ? "fa-microphone" : "fa-microphone"
        }`}
      ></i>
    </button>
  );
}

export default Voice;

