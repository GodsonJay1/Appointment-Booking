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
    <div style={{ padding: 20 }}>
      <h2>Appointments Dashboard</h2>

      <table cellPadding="6">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Date/Time</th>
            <th>Notes</th>
            <th>Google Event ID</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a: any) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.email}</td>
              <td>{new Date(a.appointmentDateTime).toLocaleString()}</td>
              <td>{a.notes}</td>
              <td>{a.googleEventId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
