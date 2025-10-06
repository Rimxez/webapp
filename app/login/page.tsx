"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      const res = await fetch("http://<PI_IP>:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔑 keep session cookie from Flask
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Login failed");
      } else {
        setError("");
        // redirect to dashboard
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to reach server");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>
          <i className="fas fa-lock" /> Smart Door Lock
        </h1>

        <div className="login-form">
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user" /> Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-key" /> Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="login-options">
            <Link href="#" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button onClick={handleLogin} className="btn btn-primary">
            Login
          </button>

          {error && (
            <div id="login-error" className="error-message">
              {error}
            </div>
          )}

          <div className="form-footer">
            Don’t have an account? <Link href="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
