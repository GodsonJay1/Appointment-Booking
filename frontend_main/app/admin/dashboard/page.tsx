"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/admin/login");

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAppointments(data));
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="mt-6 space-y-3">
        <a href="/admin/appointments" className="underline text-blue-600">
          View All Appointments
        </a>
      </div>
    </main>
  );
}
