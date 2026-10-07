import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Portfolio Generator",
  description: "Create and manage your online portfolio in minutes.",
};

// Runs BEFORE the page is painted, so there is no white flash in dark mode.
// Rule: use the saved choice; if there is none, follow the device setting.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the script above edits <html> before React loads
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8 print:max-w-none print:p-0">
          {children}
        </main>
        <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400 print:hidden">
          Portfolio Generator · Built with Next.js, Tailwind CSS &amp; Supabase
        </footer>
      </body>
    </html>
  );
}