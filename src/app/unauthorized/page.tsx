// app/unauthorized/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "@boxicons/react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          <AlertTriangle className="text-yellow-500 w-16 h-16" />
          <h1 className="text-4xl font-bold text-gray-800">Access Denied</h1>
          <p className="text-gray-600">
            You do not have permission to view this page. 
            Please contact the administrator if you believe this is a mistake.
          </p>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Go Back
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
