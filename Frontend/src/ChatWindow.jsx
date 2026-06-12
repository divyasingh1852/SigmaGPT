import React, { useContext, useState } from "react";
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import Voice from "./Voice";
import { MyContext } from "./MyContext.jsx";
import { ScaleLoader } from "react-spinners";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import server from "./environment.js";


function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);

  const speakText = (text) => {
    if (!text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const getReply = async (customPrompt = prompt) => {
    if (typeof customPrompt !== "string") {
      customPrompt = prompt;
    }

    if (!customPrompt?.trim()) return;

    if (!localStorage.getItem("token")) {
      setShowLogin(true);
      setShowRegister(false);
      return;
    }

    setLoading(true);
    setNewChat(false);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        message: customPrompt,
        threadId: currThreadId,
      }),
    };

    try {
      // const response = await fetch("http://localhost:8080/api/chat", options);
      const response = await fetch(`${server.prod}/api/chat`, options);
      const res = await response.json();

      console.log(res);
      setReply(res.reply);

      if (voiceMode) {
        speakText(res.reply);
      }

      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: customPrompt },
        { role: "assistant", content: res.reply },
      ]);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
    setPrompt("");
    setVoiceMode(false);
  };

  const handleSend = async (text, isVoice = false) => {
    if (!text.trim()) return;

    setVoiceMode(isVoice);
    setPrompt(text);
    await getReply(text);
  };

  const handleProfileClick = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          SigmaGPT <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="dropDown">
          <div
            className="dropDownItem"
            onClick={() => {
              setShowLogin(true);
              setShowRegister(false);
            }}
          >
            <i className="fa-solid fa-right-to-bracket"></i> Login
          </div>
          <div
            className="dropDownItem"
            onClick={() => {
              setShowRegister(true);
              setShowLogin(false);
            }}
          >
            <i className="fa-solid fa-user-plus"></i> Register
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i> Settings
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
          </div>
          <div className="dropDownItem" onClick={handleLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
          </div>
        </div>
      )}

      {/* LOGIN */}
      {showLogin && (
        <div className="modal">
          <Login onClose={() => setShowLogin(false)} />
        </div>
      )}

      {/* REGISTER */}
      {showRegister && (
        <div className="modal">
          <Register onClose={() => setShowRegister(false)} />
        </div>
      )}

      {/* CHAT */}
      <Chat />

      {/* LOADER */}
      <ScaleLoader color="#fff" loading={loading} />

      {/* INPUT */}
      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? handleSend(prompt) : "")}
          />

          {/* SPEAKER */}
          <button
            id="speaker"
            type="button"
            className={speaking ? "speaking" : ""}
            onClick={() => speakText(reply)}
          >
            <i className="fa-solid fa-volume-high"></i>
          </button>

          {/* MIC */}
          <Voice onSendPrompt={(text) => handleSend(text, true)} />

          {/* SEND */}
          <div id="submit" onClick={() => handleSend(prompt)}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        {/* SPEAKING STATUS */}
        {speaking && <p className="info"> Speaking...</p>}

        <p className="info">
          SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;



