export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Welcome to Appointment Booking</h1>

      <div className="mt-6">
        <a
          href="/book"
          className="bg-blue-600 text-white px-6 py-3 rounded-md"
        >
          Book Appointment
        </a>
      </div>

      <div className="mt-4">
        <a
          href="/admin/login"
          className="text-sm underline text-gray-600"
        >
          Admin Login
        </a>
      </div>
    </main>
  );
}

