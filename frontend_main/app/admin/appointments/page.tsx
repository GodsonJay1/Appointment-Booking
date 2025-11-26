async function fetchAppointments() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function AdminAppointmentsPage() {
  const appointments = await fetchAppointments();

  return (
    <main className="p-8">
      <h2 className="text-2xl font-bold mb-4">Appointments List</h2>

      <ul className="space-y-4">
        {appointments.map((a: any) => (
          <li key={a.id} className="border p-4 rounded">
            <p><b>Name:</b> {a.name}</p>
            <p><b>Email:</b> {a.email}</p>
            <p><b>Date:</b> {new Date(a.appointmentDateTime).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
