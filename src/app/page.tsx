"use client";

import Link from "next/link";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Home() {
  const { user } = useCurrentUser();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <Image
            src="/logos/vector/default-monochrome-white2.svg"
            alt="HallBridge"
            width={180}
            height={40}
            className="h-10 w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="px-6 py-2 text-white border border-white rounded-md hover:bg-white/10 transition-colors font-medium"
          >
            {user ? "Dashboard" : "Log In"}
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-2 bg-[#2D6A4F] text-white rounded-md hover:bg-[#245840] transition-colors font-medium"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Full Page Hero with Background Image */}
      <section className="relative min-h-screen flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/lading image.png"
            alt="Hall Building"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-1 flex-1 flex items-center px-8 md:px-16 pt-20 pb-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Effortless Hall
              <br />
              Management
            </h1>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Manage and organize your halls with ease.
              <br />
              Streamline booking, scheduling, and coordination
              <br />
              with HallBridge.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/auth/register"
                className="px-8 py-3 bg-[#2D6A4F] text-white rounded-md hover:bg-[#245840] transition-colors font-medium"
              >
                Get Started
              </Link>
              <button className="flex items-center gap-2 text-white hover:text-white/80 transition-colors font-medium">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Floating Feature Cards */}
        <div className="relative z-1 px-8 pt-8 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Smart Mess & Dining System */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1 transform duration-300">
                <div className="w-16 h-16 mb-4 mx-auto">
                  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="28" fill="#E8F4F0" />
                    <circle cx="32" cy="36" r="16" stroke="#5B9A8B" strokeWidth="2" fill="none" />
                    <ellipse cx="32" cy="36" rx="12" ry="4" fill="#5B9A8B" opacity="0.3" />
                    <line x1="32" y1="20" x2="32" y2="10" stroke="#5B9A8B" strokeWidth="2" />
                    <circle cx="32" cy="8" r="2" fill="#5B9A8B" />
                    <path d="M20 40 L16 52 L20 52 L22 44" stroke="#5B9A8B" strokeWidth="2" fill="none" />
                    <path d="M44 40 L48 52 L44 52 L42 44" stroke="#5B9A8B" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <h3 className="text-center font-bold text-gray-800 mb-2">
                  Smart Mess &<br />Dining System
                </h3>
                <p className="text-center text-gray-500 text-sm">
                  Efficient meal booking
                  <br />
                  and dining management
                </p>
              </div>

              {/* Security & Movement Tracking */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1 transform duration-300">
                <div className="w-16 h-16 mb-4 mx-auto">
                  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="28" fill="#E8F4F0" />
                    <path
                      d="M32 12 L48 20 L48 32 C48 44 32 52 32 52 C32 52 16 44 16 32 L16 20 L32 12Z"
                      stroke="#5B9A8B"
                      strokeWidth="2"
                      fill="#5B9A8B"
                      fillOpacity="0.2"
                    />
                    <path
                      d="M24 32 L30 38 L40 26"
                      stroke="#5B9A8B"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-center font-bold text-gray-800 mb-2">
                  Security & Movement
                  <br />
                  Tracking
                </h3>
                <p className="text-center text-gray-500 text-sm">
                  Monitor security, access
                  <br />
                  and student movement
                </p>
              </div>

              {/* Accommodation & Room Management */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1 transform duration-300">
                <div className="w-16 h-16 mb-4 mx-auto">
                  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="28" fill="#E8F4F0" />
                    <path
                      d="M20 44 L20 28 L32 20 L44 28 L44 44 L20 44Z"
                      stroke="#5B9A8B"
                      strokeWidth="2"
                      fill="#5B9A8B"
                      fillOpacity="0.2"
                    />
                    <rect x="28" y="34" width="8" height="10" fill="#5B9A8B" />
                    <circle cx="44" cy="20" r="6" fill="#F4A460" />
                    <path d="M44 16 L44 20 L47 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-center font-bold text-gray-800 mb-2">
                  Accommodation &
                  <br />
                  & Room Management
                </h3>
                <p className="text-center text-gray-500 text-sm">
                  Oversee room allocations
                  <br />
                  and maintenances.
                </p>
              </div>

              {/* Laundry & Emergency */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1 transform duration-300">
                <div className="w-16 h-16 mb-4 mx-auto">
                  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="28" fill="#E8F4F0" />
                    <rect x="18" y="18" width="20" height="28" rx="2" stroke="#5B9A8B" strokeWidth="2" fill="#5B9A8B" fillOpacity="0.2" />
                    <circle cx="28" cy="36" r="6" stroke="#5B9A8B" strokeWidth="2" fill="none" />
                    <rect x="22" y="22" width="12" height="4" fill="#5B9A8B" opacity="0.5" />
                    <path d="M44 20 L44 28 L52 24 L44 20Z" fill="#E74C3C" />
                    <rect x="42" y="28" width="4" height="16" fill="#E74C3C" opacity="0.8" />
                  </svg>
                </div>
                <h3 className="text-center font-bold text-gray-800 mb-2">
                  Laundry &
                  <br />
                  Emergency
                </h3>
                <p className="text-center text-gray-500 text-sm">
                  Handle laundry services
                  <br />
                  and emergency alerts
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}