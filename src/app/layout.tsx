import type { Metadata } from "next";
import { Inter, Sora, Kaushan_Script, Yellowtail } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { AuroraBackground } from "@/components/AuroraBackground";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const kaushanScript = Kaushan_Script({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: "400",
});

const yellowtail = Yellowtail({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Shifter – Shift Any File, Anytime, Anywhere",
  description: "Universal File Converter Platform. Convert documents, images, audio, video, archives and ebooks securely with high speed.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${kaushanScript.variable} ${yellowtail.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-light-bg text-slate-200 selection:bg-primary/30 selection:text-primary-hover">
        <div className="fixed-nature-bg" />
        <AuroraBackground />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
