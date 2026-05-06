import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";


const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  variable: "--font-syne",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://360NexusAI.in"),
  title: {
    default: "360NexusAI – WhatsApp AI Automation for Indian Businesses",
    template: "%s | 360NexusAI",
  },
  description:
    "AI-powered WhatsApp marketing automation. Bulk broadcasts, intelligent chatbots, integrated payments, and CRM sync — no coding required.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body className={`${dmSans.className} ${syne.variable}`}>
        {children}
      </body>
    </html>
  );
}