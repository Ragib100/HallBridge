import type { Metadata } from "next";
import "@/styles/globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "HallBridge",
  description: "Hall Management System - Student Portal",
  icons: {
    icon: [
      { url: '/logos/header-icon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({ children } : { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
