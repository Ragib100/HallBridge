"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    userType: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual registration
    // For now, redirect to login
    router.push("/auth/login");
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
          Get started<span className="ml-1">🚀</span>
        </h1>
        <p className="text-gray-500 mt-1">Create your HallBridge account</p>
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
            placeholder="Name"
            className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none transition-all"
            required
          />
        </div>

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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none transition-all"
            required
          />
        </div>

        {/* User Type */}
        <div className="flex justify-center">
          <select
            name="userType"
            value={formData.userType}
            onChange={handleInputChange}
            className="px-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none text-gray-700 cursor-pointer"
            required
          >
            <option value="" disabled>Select User Type</option>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="w-full py-3 bg-[#2D6A4F] text-white rounded-lg hover:bg-[#245840] transition-colors font-medium"
        >
          Sign up
        </button>

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