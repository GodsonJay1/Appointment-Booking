"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async (e: any) => {
    e.preventDefault();
    const body = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) return setError(data.message || "Invalid credentials");

    localStorage.setItem("token", data.token);
    router.push("/admin/dashboard");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Login</h2>
      <form onSubmit={login}>
        <input name="email" placeholder="Email" required /><br /><br />
        <input name="password" type="password" placeholder="Password" required /><br /><br />
        <button type="submit">Login</button>
      </form>
      <p style={{ color: "red" }}>{error}</p>
    </div>
  );
}
