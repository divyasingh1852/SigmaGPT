import React, { useState } from "react";
import "./AuthForm.css";

function Register({ onClose }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Registered successfully! Please login.");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage(data.error || "Registration failed");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Register</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>
    </div>
  );
}

export default Register;


