"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement actual password reset logic
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Logo for mobile */}
      <div className="md:hidden mb-8 flex justify-center">
        <Image
          src="/logos/vector/default-monochrome-black2.svg"
          alt="HallBridge"
          width={180}
          height={40}
          className="h-10 w-auto"
        />
      </div>

      {/* Desktop Logo */}
      <div className="hidden md:flex items-center gap-2 mb-6">
        <Image
          src="/logos/vector/default-monochrome-black2.svg"
          alt="HallBridge"
          width={180}
          height={40}
          className="h-10 w-auto"
        />
      </div>

      {!isSubmitted ? (
        <>
          {/* Header Text */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Forgot password?<span className="ml-1">🔐</span>
            </h1>
            <p className="text-gray-500 mt-1">
              No worries, we&apos;ll send you reset instructions.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none transition-all"
                required
              />
            </div>

            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#2D6A4F] text-white rounded-lg hover:bg-[#245840] transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Reset password"
              )}
            </button>

            {/* Back to Login */}
            <div className="flex items-center justify-center mt-6">
              <Link
                href="/auth/login"
                className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to login
              </Link>
            </div>
          </form>
        </>
      ) : (
        <>
          {/* Success State */}
          <div className="text-center">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[#2D6A4F]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Check your email
            </h1>
            <p className="text-gray-500 mb-6">
              We sent a password reset link to
              <br />
              <span className="font-medium text-gray-700">{email}</span>
            </p>

            {/* Open Email App Button */}
            <button
              type="button"
              className="w-full py-3 bg-[#2D6A4F] text-white rounded-lg hover:bg-[#245840] transition-colors font-medium mb-4"
              onClick={() => window.open("mailto:", "_blank")}
            >
              Open email app
            </button>

            {/* Resend Email */}
            <p className="text-gray-500 text-sm">
              Didn&apos;t receive the email?{" "}
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-[#2D6A4F] font-medium hover:underline"
              >
                Click to resend
              </button>
            </p>

            {/* Back to Login */}
            <div className="flex items-center justify-center mt-8">
              <Link
                href="/auth/login"
                className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to login
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
