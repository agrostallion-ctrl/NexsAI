'use client'

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.access_token;

      if (token) {
        localStorage.setItem("auth_token", token);
        router.push("/chat");
      } else {
        throw new Error("No token received");
      }
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={containerStyle}>
      <form onSubmit={handleLogin} style={formStyle}>
        <h2>Login</h2>

        {error && <p style={errorStyle}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </main>
  );
}

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

const formStyle = {
  width: "300px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
};

const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "10px",
  background: "#0070f3",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const errorStyle = {
  color: "red",
};