"use client";

import { apiFetch } from "@/utils/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    if (!fullname || !email || !password || !confirm) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    // Generate username
    const parts = fullname.split(" ");
    let username = parts[0].toLowerCase();
    if (parts.length > 1) {
      username += parts[parts.length - 1][0].toLowerCase();
    }
    username += Math.floor(Math.random() * 1000);

    try {
      const data = await apiFetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name: fullname, email, password }),
      });


      if (data.success) {
        setSuccess(
          `Registration successful! Your username is ${username}. Redirecting to login...`
        );
        setTimeout(() => router.push("/login"), 4000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box signup-box">
        <h1>
          <i className="fas fa-lock" /> Smart Door Lock
        </h1>
        <h2>Create an Account</h2>
        <div className="login-form">
          <div className="form-group">
            <label>
              <i className="fas fa-id-card" /> Full Name
            </label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-envelope" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-key" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-lock" /> Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button onClick={handleSignup} className="btn btn-primary">
            Sign Up
          </button>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-footer">
            Already have an account? <a href="/login">Log In</a>
          </div>
        </div>
      </div>
    </div>
  );
}
