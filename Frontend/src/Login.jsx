import React, { useState } from "react";
import "./AuthForm.css";

function Login({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setMessage("Login successful!");
        if (onLoginSuccess) onLoginSuccess(data.token);

        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;

