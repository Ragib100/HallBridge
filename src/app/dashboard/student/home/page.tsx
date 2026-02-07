"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bed, Door, StepsUp, CurrencyNotes } from "@boxicons/react";

interface UserInfo {
  fullName: string;
  studentId?: string;
  roomAllocation?: {
    floor: number;
    roomNumber: string;
    bedNumber: number;
    hallId?: string;
  };
}

interface MealStatus {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

interface MaintenanceRequest {
  _id: string;
  category: string;
  status: string;
  createdAt: string;
}

export default function HomePage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [tomorrowMeals, setTomorrowMeals] = useState<MealStatus>({
    breakfast: false,
    lunch: false,
    dinner: false,
  });
  const [recentRequests, setRecentRequests] = useState<MaintenanceRequest[]>([]);
  const [currentBill, setCurrentBill] = useState<number>(0);

  // Fetch user info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch("/api/auth/me");

        if (!userRes.ok) {
          throw new Error("Failed to fetch user info");
        }
        const userData = await userRes.json();

        if (!userData.user) {
          throw new Error("User not found");
        }

        setUserInfo({
          fullName: userData.user.fullName,
          studentId: userData.user.studentId,
          roomAllocation: userData.user.roomAllocation,
        });

        // console.log("User data:", userData.user);

        const [mealsRes, maintenanceRes, billingRes] = await Promise.all([
          fetch("/api/student/meals/meal-selection/tomorrow-meal").catch(() => null),
          fetch("/api/common/maintenance?limit=3").catch(() => null),
          fetch("/api/student/billing").catch(() => null),
        ]);

        if (mealsRes?.ok) {
          const mealsData = await mealsRes.json();
          // console.log("Tomorrow's meals data:", mealsData);
          setTomorrowMeals(mealsData.meal || tomorrowMeals);
        }

        if (maintenanceRes?.ok) {
          const maintenanceData = await maintenanceRes.json();
          setRecentRequests(maintenanceData.requests?.slice(0, 3) || []);
        }

        if (billingRes?.ok) {
          const billingData = await billingRes.json();
          setCurrentBill(billingData.currentBill?.amount || 0);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const firstName = userInfo?.fullName?.split(" ")[0] || "Student";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-[#2D6A4F] to-[#40916C] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Welcome back, {loading ? "..." : firstName}! 👋
            </h1>
            <p className="text-white/80">
              Here&apos;s your hall overview for today
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm text-white/80">Student ID</p>
            <p className="font-mono font-bold">{userInfo?.studentId || "—"}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Room Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#2D6A4F]/10 rounded-lg flex items-center justify-center">
              <Door fill="#2D6A4F" />
            </div>
            <span className="text-sm text-gray-500">My Room</span>
          </div>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded w-20"></div>
          ) : userInfo?.roomAllocation ? (
            <p className="text-2xl font-bold text-gray-800">
              {userInfo.roomAllocation.roomNumber}
            </p>
          ) : (
            <p className="text-sm text-gray-400">Not assigned</p>
          )}
        </div>

        {/* Floor */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <StepsUp className="fill-slate-600" />
            </div>
            <span className="text-sm text-gray-500">Floor</span>
          </div>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded w-12"></div>
          ) : userInfo?.roomAllocation ? (
            <p className="text-2xl font-bold text-gray-800">
              {userInfo.roomAllocation.floor}
              <span className="text-sm font-normal text-gray-500 ml-1">
                {userInfo.roomAllocation.floor === 1 ? "st" : userInfo.roomAllocation.floor === 2 ? "nd" : userInfo.roomAllocation.floor === 3 ? "rd" : "th"}
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-400">—</p>
          )}
        </div>

        {/* Bed */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Bed fill="#0065fc" />
            </div>
            <span className="text-sm text-gray-500">Bed No.</span>
          </div>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded w-12"></div>
          ) : userInfo?.roomAllocation ? (
            <p className="text-2xl font-bold text-gray-800">
              #{userInfo.roomAllocation.bedNumber}
            </p>
          ) : (
            <p className="text-sm text-gray-400">—</p>
          )}
        </div>

        {/* Current Due */}
        <div
          className={`rounded-xl p-4 shadow-sm border
            ${currentBill >= 10000
              ? "bg-red-50 border-red-300"
              : "bg-white border-transparent"
            }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center
                ${currentBill >= 10000 ? "bg-red-100" : "bg-red-50"}
              `}
            >
              <CurrencyNotes fill="#ff0000" />
            </div>

            <span
              className={`text-sm font-medium
                ${currentBill >= 10000 ? "text-red-700" : "text-gray-500"}
              `}
            >
              Current Due
            </span>
          </div>

          <p
            className={`text-2xl font-bold
              ${currentBill >= 10000 ? "text-red-800" : "text-gray-800"}
            `}
          >
            ৳{currentBill}
          </p>

          {currentBill >= 10000 && (
            <p className="mt-2 text-sm text-red-700 font-medium">
              ⚠️ Your due is very high. Please clear the payment as soon as possible.
            </p>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tomorrow's Meals */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Tomorrow&apos;s Meals</h2>
            <Link
              href="/dashboard/student/meals/meal_selection"
              className="text-sm text-[#2D6A4F] hover:underline font-medium"
            >
              Manage Meals →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Breakfast */}
            <div className={`p-4 rounded-xl border-2 ${tomorrowMeals.breakfast ? "border-[#2D6A4F] bg-[#2D6A4F]/5" : "border-gray-200 bg-gray-50"}`}>
              <div className="text-center">
                <div className="text-3xl mb-2">🍳</div>
                <p className="font-medium text-gray-800">Breakfast</p>
                <p className={`text-sm mt-1 ${tomorrowMeals.breakfast ? "text-[#2D6A4F]" : "text-gray-400"}`}>
                  {tomorrowMeals.breakfast ? "On" : "Off"}
                </p>
              </div>
            </div>
            {/* Lunch */}
            <div className={`p-4 rounded-xl border-2 ${tomorrowMeals.lunch ? "border-[#2D6A4F] bg-[#2D6A4F]/5" : "border-gray-200 bg-gray-50"}`}>
              <div className="text-center">
                <div className="text-3xl mb-2">🍛</div>
                <p className="font-medium text-gray-800">Lunch</p>
                <p className={`text-sm mt-1 ${tomorrowMeals.lunch ? "text-[#2D6A4F]" : "text-gray-400"}`}>
                  {tomorrowMeals.lunch ? "On" : "Off"}
                </p>
              </div>
            </div>
            {/* Dinner */}
            <div className={`p-4 rounded-xl border-2 ${tomorrowMeals.dinner ? "border-[#2D6A4F] bg-[#2D6A4F]/5" : "border-gray-200 bg-gray-50"}`}>
              <div className="text-center">
                <div className="text-3xl mb-2">🍽️</div>
                <p className="font-medium text-gray-800">Dinner</p>
                <p className={`text-sm mt-1 ${tomorrowMeals.dinner ? "text-[#2D6A4F]" : "text-gray-400"}`}>
                  {tomorrowMeals.dinner ? "On" : "Off"}
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Meal changes must be made before 10:00 PM
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/student/gate-pass"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#2D6A4F] hover:bg-[#2D6A4F]/5 transition-colors"
            >
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">Request Gate Pass</p>
                <p className="text-xs text-gray-500">Apply for leave</p>
              </div>
            </Link>

            <Link
              href="/dashboard/student/maintenance/new_request"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#2D6A4F] hover:bg-[#2D6A4F]/5 transition-colors"
            >
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">Report Issue</p>
                <p className="text-xs text-gray-500">Maintenance request</p>
              </div>
            </Link>

            <Link
              href="/dashboard/student/laundry"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#2D6A4F] hover:bg-[#2D6A4F]/5 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">Schedule Laundry</p>
                <p className="text-xs text-gray-500">Book pickup</p>
              </div>
            </Link>

            <Link
              href="/dashboard/student/billing/current_dues"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#2D6A4F] hover:bg-[#2D6A4F]/5 transition-colors"
            >
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">Pay Bills</p>
                <p className="text-xs text-gray-500">View & pay dues</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hall Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Current Status</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">Inside Hall</p>
              <p className="text-sm text-gray-500">No active gate pass</p>
            </div>
          </div>
          {userInfo?.roomAllocation?.hallId && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Hall ID</p>
              <p className="font-medium text-[#2D6A4F]">{userInfo.roomAllocation.hallId}</p>
            </div>
          )}
        </div>

        {/* Recent Maintenance Requests */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Requests</h2>
            <Link
              href="/dashboard/student/maintenance/my_requests"
              className="text-sm text-[#2D6A4F] hover:underline font-medium"
            >
              View All →
            </Link>
          </div>
          {recentRequests.length > 0 ? (
            <div className="space-y-3">
              {recentRequests.map((request, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800 capitalize">{request.category}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${request.status === "completed" ? "bg-green-100 text-green-700" :
                    request.status === "in-progress" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                    {request.status === "in-progress" ? "In Progress" :
                      request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm">No recent requests</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}