export const metadata = {
  title: "Appointment System",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
