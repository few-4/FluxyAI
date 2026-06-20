"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useLogin } from "@/features/auth/hooks/useAuthApi";
import { setUser } from "@/features/auth/slice/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate: loginUser, isPending } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    loginUser(
      { email, password },
      {
        onSuccess: (res) => {
          // res.data contains user object and accessToken
          const { accessToken, user } = res.data;

          // 1. Store accessToken in client-accessible cookie for the middleware
          Cookies.set("access", accessToken, { expires: 1 / 96 }); // Expires in 15 minutes (1/96th of a day)

          // 2. Dispatch user data to Redux Store
          dispatch(
            setUser({
              id: user.id,
              email: user.email,
              username: user.username,
            })
          );

          // 3. Smart redirect
          const redirect = searchParams.get("redirect");
          const safeRedirect =
            redirect && redirect.startsWith("/") ? redirect : "/chat";
          router.push(safeRedirect);
        },
        onError: (err: any) => {
          setErrorMsg(err?.message || "Invalid credentials. Please try again.");
        },
      }
    );
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Login to FluxyAI</h2>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
