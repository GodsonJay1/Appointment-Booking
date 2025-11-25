"use client";
import { useState } from "react";

export default function AppointmentForm() {
  const [message, setMessage] = useState("");

  const submitForm = async (e: any) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      appointmentDateTime: e.target.datetime.value,
      notes: e.target.notes.value,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) setMessage(`Appointment created: ID ${data.id}`);
    else setMessage(data.message || "Error");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Book an Appointment</h2>
      <form onSubmit={submitForm}>
        <input name="name" placeholder="Name" required /><br /><br />
        <input name="email" placeholder="Email" type="email" required /><br /><br />
        <input name="datetime" type="datetime-local" required /><br /><br />
        <textarea name="notes" placeholder="Notes"></textarea><br /><br />
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
