import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Event Wall | Watch Multiple YouTube Videos at Once",
  description:
    "Event Wall is a simple multiview utility for watching up to 4 YouTube videos in one clean view.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Event Wall",
    description:
      "Watch up to 4 YouTube videos at once in one clean multiview layout.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
