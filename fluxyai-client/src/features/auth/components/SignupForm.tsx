"use client";

import React, { useState } from "react";
import { useRegister } from "../hooks/useAuthApi";
import Link from "next/link";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { mutate: registerUser, isPending } = useRegister();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setSuccessMsg("");

    // Client-side validations
    if (username.trim().length < 3) {
      setValidationError("Username must be at least 3 characters long.");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setValidationError("Username must contain only letters, numbers, and underscores.");
      return;
    }
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    // Password pattern matching Joi regex:
    // Requires at least one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setValidationError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    registerUser(
      { username, email, password },
      {
        onSuccess: (res) => {
          setSuccessMsg(res.data?.message || "Registration successful! Please check your email to verify your account.");
          // Clear inputs
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        },
        onError: (err: any) => {
          setValidationError(err?.message || "Registration failed. Please check your inputs and try again.");
        },
      }
    );
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "60px auto",
        padding: "30px 24px",
        border: "1px solid #e4e4e7",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h2 style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: 600, color: "#18181b" }}>
        Create an Account
      </h2>
      <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#71717a" }}>
        Sign up to get started with FluxyAI
      </p>

      {validationError && (
        <div
          style={{
            padding: "10px 12px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fee2e2",
            borderRadius: "6px",
            color: "#b91c1c",
            fontSize: "14px",
            marginBottom: "20px",
            lineHeight: "1.4",
          }}
        >
          {validationError}
        </div>
      )}

      {successMsg && (
        <div
          style={{
            padding: "12px 14px",
            backgroundColor: "#f0fdf4",
            border: "1px solid #dcfce7",
            borderRadius: "6px",
            color: "#15803d",
            fontSize: "14px",
            marginBottom: "20px",
            lineHeight: "1.5",
          }}
        >
          {successMsg}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#3f3f46", marginBottom: "6px" }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="e.g. johndoe"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d4d4d8",
              borderRadius: "6px",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#3f3f46", marginBottom: "6px" }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d4d4d8",
              borderRadius: "6px",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#3f3f46", marginBottom: "6px" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Min. 8 characters"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d4d4d8",
              borderRadius: "6px",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#3f3f46", marginBottom: "6px" }}>
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Repeat password"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d4d4d8",
              borderRadius: "6px",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: 500,
            fontSize: "14px",
            cursor: isPending ? "not-allowed" : "pointer",
            opacity: isPending ? 0.7 : 1,
            transition: "background-color 0.2s",
          }}
        >
          {isPending ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px", color: "#71717a" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>
          Login
        </Link>
      </div>
    </div>
  );
}
