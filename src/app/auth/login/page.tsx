"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "@boxicons/react";
import { Eye, EyeSlash } from "@boxicons/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const oauthError = searchParams.get("error");

    if (!oauthError) return;

    if (oauthError === "google_account_not_found") {
      setError("No account found for this Google email. Please sign up first.");
      return;
    }

    if (oauthError === "google_oauth_failed") {
      setError("Google sign-in failed. Please try again.");
      return;
    }

    if (oauthError === "google_missing_email") {
      setError("Unable to read your Google email. Please try again.");
      return;
    }

    if (oauthError === "google_account_pending") {
      setError("Your account is pending approval. Please wait for admin approval.");
      return;
    }

    // Microsoft OAuth errors
    if (oauthError === "microsoft_account_not_found") {
      setError("No account found for this Microsoft email. Please sign up first.");
      return;
    }

    if (oauthError === "microsoft_oauth_failed") {
      setError("Microsoft sign-in failed. Please try again.");
      return;
    }

    if (oauthError === "microsoft_account_pending") {
      setError("Your account is pending approval. Please wait for admin approval.");
      return;
    }

    setError("Sign-in failed. Please try again.");
  }, [searchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Login failed");
        return;
      }

      const userType = data?.user?.userType;
      const mustChangePassword = data?.user?.mustChangePassword;

      // Redirect to change password page if required
      if (mustChangePassword) {
        router.push("/auth/change-password");
        return;
      }

      if (userType === "student") {
        router.push("/dashboard/student/home");
      } else if (userType === "staff") {
        router.push("/dashboard/staff");
      } else {
        router.push("/dashboard/admin");
      }
    } catch (err) {
      setError("Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

      {/* Welcome Text */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back<span className="ml-1">👋</span>
        </h1>
        <p className="text-gray-500 mt-1">sign into your HallBridge account</p>
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
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none transition-all"
            required
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-[#2D6A4F] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none transition-all pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeSlash /> : <Eye />}
            </button>
          </div>
        </div>

        {/* Edu Email Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle fill="#0da200" />
            <div className="text-sm text-green-800">
              <p className="font-medium">Use your registered email address to sign in</p>
            </div>
          </div>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#2D6A4F] text-white rounded-lg hover:bg-[#245840] transition-colors font-medium cursor-pointer"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        {successMessage ? (
          <p className="text-sm text-green-600 text-center bg-green-50 p-3 rounded-lg">{successMessage}</p>
        ) : null}

        {error ? (
          <p className="text-sm text-red-600 text-center">{error}</p>
        ) : null}

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google Button */}
        <button
          type="button"
          onClick={() => {
            window.location.href = "/api/auth/google";
          }}
          className="w-full py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Microsoft Button */}
        <button
          type="button"
          onClick={() => {
            window.location.href = "/api/auth/microsoft";
          }}
          className="w-full py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-3 cursor-pointer"
        >
          {/* Microsoft Logo */}
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <rect x="1" y="1" width="10" height="10" fill="#F25022" />
            <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
            <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
            <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
          </svg>

          Continue with Microsoft
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-[#2D6A4F] font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-sm mx-auto p-4 text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}