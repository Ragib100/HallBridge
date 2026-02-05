"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

    if (!formData.studentId.trim()) {
      setError("Student ID is required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          studentId: formData.studentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Registration failed");
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("Unable to submit request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Success state - show confirmation message
  if (success) {
    return (
      <div className="w-full max-w-sm mx-auto">
        {/* Logo */}
        <div className="mb-8 flex justify-center md:justify-start">
          <Image
            src="/logos/vector/default-monochrome-black2.svg"
            alt="HallBridge"
            width={180}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        {/* Success Message */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Request Submitted!</h1>
          <p className="text-gray-600">
            Your hall seat request has been submitted successfully. An admin will review your request shortly.
          </p>
          <p className="text-gray-500 text-sm">
            Once approved, you will receive an email notification with login instructions. Your initial password will be your Student ID.
          </p>
          <Link
            href="/auth/login"
            className="inline-block mt-4 px-6 py-3 bg-[#2D6A4F] text-white rounded-lg hover:bg-[#245840] transition-colors font-medium"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

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
          Request Hall Seat<span className="ml-1">🏠</span>
        </h1>
        <p className="text-gray-500 mt-1">Submit your request to join the hall</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none transition-all"
            required
          />
        </div>

        {/* Student ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student ID
          </label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleInputChange}
            placeholder="Enter your student ID"
            className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none transition-all"
            required
          />
          <p className="mt-2 text-xs text-gray-500">This will be your initial password after approval</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#2D6A4F] text-white rounded-lg hover:bg-[#245840] transition-colors font-medium cursor-pointer"
        >
          {isLoading ? "Submitting..." : "Request Hall Seat"}
        </button>

        {error ? (
          <p className="text-sm text-red-600 text-center">{error}</p>
        ) : null}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your request will be reviewed by an administrator. Once approved, you&apos;ll receive an email at your edu mail address with login instructions.
          </p>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-[#2D6A4F] font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}