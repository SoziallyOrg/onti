import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Onti Garage — intern systeem",
  description:
    "Intern onderhoudssysteem voor Onti Banden: voertuigen, onderhoudshistoriek en onderdelen.",
  // Don't index the internal app even if accidentally exposed.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl-BE" className={barlow.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
