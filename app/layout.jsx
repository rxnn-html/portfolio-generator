import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Portfolio Generator",
  description: "Create and manage your online portfolio in minutes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}