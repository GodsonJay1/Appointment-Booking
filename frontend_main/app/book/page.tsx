"use client";
import { useState } from "react";

export default function BookAppointmentPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    appointmentDateTime: "",
    notes: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          appointmentDateTime: new Date(form.appointmentDateTime),
        }),
      }
    );

    if (res.ok) {
      alert("Appointment Booked!");
    } else {
      alert("Failed to Book Appointment");
    }
  };

  return (
    <main className="p-8">
      <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Your Name"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="datetime-local"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, appointmentDateTime: e.target.value })
          }
        />

        <textarea
          placeholder="Notes"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Submit
        </button>
      </form>
    </main>
  );
}
