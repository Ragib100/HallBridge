"use client";

import { useState } from "react";

type TabType = "general" | "pricing" | "operations" | "notifications";

interface PricingItem {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
}

const pricingItems: PricingItem[] = [
  { id: "1", name: "Monthly Rent", description: "Room rent per month", price: 3000, unit: "/month" },
  { id: "2", name: "Laundry Service", description: "Weekly laundry charge", price: 400, unit: "/week" },
  { id: "3", name: "Maintenance Fee", description: "Monthly maintenance", price: 100, unit: "/month" },
  { id: "4", name: "Breakfast", description: "Per meal charge", price: 50, unit: "/meal" },
  { id: "5", name: "Lunch", description: "Per meal charge", price: 70, unit: "/meal" },
  { id: "6", name: "Dinner", description: "Per meal charge", price: 80, unit: "/meal" },
  { id: "7", name: "Guest Meal", description: "Additional guest meal", price: 120, unit: "/meal" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [hallName, setHallName] = useState("Shahid Zia Hall");
  const [hallAddress, setHallAddress] = useState("University of Engineering & Technology");
  const [adminEmail, setAdminEmail] = useState("admin@hallbridge.com");
  const [adminPhone, setAdminPhone] = useState("+880 1712-345678");
  
  // Operations
  const [mealCutoffTime, setMealCutoffTime] = useState("22:00");
  const [gatePassDuration, setGatePassDuration] = useState("3");
  const [gatePassUnit, setGatePassUnit] = useState("days");
  const [maxGatePassDays, setMaxGatePassDays] = useState("7");
  const [laundryPickupDay, setLaundryPickupDay] = useState("Tuesday");
  const [laundryDeliveryDays, setLaundryDeliveryDays] = useState("2");
  const [checkInTime, setCheckInTime] = useState("22:00");
  const [lateEntryFine, setLateEntryFine] = useState("50");
  
  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [mealReminders, setMealReminders] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);
  
  // Pricing
  const [prices, setPrices] = useState(pricingItems);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePriceChange = (id: string, newPrice: number) => {
    setPrices(prices.map(item => 
      item.id === id ? { ...item, price: newPrice } : item
    ));
  };

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const tabs = [
    { id: "general" as TabType, label: "General", icon: "info" },
    { id: "pricing" as TabType, label: "Pricing", icon: "currency" },
    { id: "operations" as TabType, label: "Operations", icon: "cog" },
    { id: "notifications" as TabType, label: "Notifications", icon: "bell" },
  ];

  function TabIcon({ icon, className }: { icon: string; className?: string }) {
    switch (icon) {
      case "info":
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "currency":
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "cog":
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case "bell":
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      default:
        return null;
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
          <p className="text-gray-500 text-sm">Manage hall configurations and preferences</p>
        </div>
        {showSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[#2D6A4F] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <TabIcon icon={tab.icon} className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hall Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Hall Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hall Name</label>
                <input
                  type="text"
                  value={hallName}
                  onChange={(e) => setHallName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address / Institution</label>
                <input
                  type="text"
                  value={hallAddress}
                  onChange={(e) => setHallAddress(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Capacity</label>
                <input
                  type="number"
                  value="480"
                  disabled
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1">Based on room configurations</p>
              </div>
            </div>
          </div>

          {/* Admin Contact */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Admin Contact</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Phone</label>
                <input
                  type="tel"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                <input
                  type="tel"
                  placeholder="Enter emergency contact number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Academic Session */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Academic Session</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Session</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none bg-white">
                  <option value="2025-2026">2025-2026</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2026-2027">2026-2027</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Start</label>
                  <input
                    type="date"
                    defaultValue="2025-08-01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session End</label>
                  <input
                    type="date"
                    defaultValue="2026-06-30"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Current Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Total Rooms</p>
                <p className="text-2xl font-bold text-blue-700">120</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Active Students</p>
                <p className="text-2xl font-bold text-green-700">450</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600">Staff Members</p>
                <p className="text-2xl font-bold text-purple-700">12</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-orange-700">93%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === "pricing" && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Pricing Configuration</h2>
              <p className="text-sm text-gray-500">Set prices for various hall services</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prices.map((item) => (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#2D6A4F] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <button
                    onClick={() => setEditingPrice(editingPrice === item.id ? null : item.id)}
                    className="text-[#2D6A4F] hover:bg-[#2D6A4F]/10 p-2 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {editingPrice === item.id ? (
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handlePriceChange(item.id, parseInt(e.target.value) || 0)}
                      onBlur={() => setEditingPrice(null)}
                      onKeyDown={(e) => e.key === "Enter" && setEditingPrice(null)}
                      autoFocus
                      className="w-28 p-2 border border-[#2D6A4F] rounded-lg text-lg font-bold focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-800">৳{item.price}</span>
                  )}
                  <span className="text-sm text-gray-500">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-800">Price Change Notice</p>
              <p className="text-xs text-yellow-700">Changes will apply to new billing cycles only. Existing bills will remain unchanged.</p>
            </div>
          </div>
        </div>
      )}

      {/* Operations Tab */}
      {activeTab === "operations" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Meal Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Meal Settings</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Selection Cutoff Time
                </label>
                <input
                  type="time"
                  value={mealCutoffTime}
                  onChange={(e) => setMealCutoffTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">Students must select meals before this time</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Timing
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Breakfast</p>
                    <p className="font-medium text-gray-800">7:30 - 9:30 AM</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Lunch</p>
                    <p className="font-medium text-gray-800">12:30 - 2:30 PM</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Dinner</p>
                    <p className="font-medium text-gray-800">7:30 - 9:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gate Pass Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Gate Pass Settings</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Gate Pass Duration
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={gatePassDuration}
                    onChange={(e) => setGatePassDuration(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                  />
                  <select
                    value={gatePassUnit}
                    onChange={(e) => setGatePassUnit(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none bg-white"
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Gate Pass Days
                </label>
                <input
                  type="number"
                  value={maxGatePassDays}
                  onChange={(e) => setMaxGatePassDays(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
                  <input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Late Entry Fine (৳)</label>
                  <input
                    type="number"
                    value={lateEntryFine}
                    onChange={(e) => setLateEntryFine(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Laundry Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Laundry Settings</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Day
                </label>
                <select
                  value={laundryPickupDay}
                  onChange={(e) => setLaundryPickupDay(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none bg-white"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery (Days After Pickup)
                </label>
                <input
                  type="number"
                  value={laundryDeliveryDays}
                  onChange={(e) => setLaundryDeliveryDays(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Items Per Week
                </label>
                <input
                  type="number"
                  defaultValue="20"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Billing Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Billing Settings</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bill Generation Date
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none bg-white">
                  <option value="1">1st of every month</option>
                  <option value="15">15th of every month</option>
                  <option value="last">Last day of month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Due Days
                </label>
                <input
                  type="number"
                  defaultValue="15"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">Days after bill generation</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Late Payment Fine (%)
                </label>
                <input
                  type="number"
                  defaultValue="5"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Channels */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Notification Channels</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Email Notifications</p>
                    <p className="text-xs text-gray-500">Send notifications via email</p>
                  </div>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    emailNotifications ? "bg-[#2D6A4F]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow ${
                      emailNotifications ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">SMS Notifications</p>
                    <p className="text-xs text-gray-500">Send notifications via SMS</p>
                  </div>
                </div>
                <button
                  onClick={() => setSmsNotifications(!smsNotifications)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    smsNotifications ? "bg-[#2D6A4F]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow ${
                      smsNotifications ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Notification Types */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Notification Types</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Payment Reminders</p>
                  <p className="text-xs text-gray-500">Notify students about pending payments</p>
                </div>
                <button
                  onClick={() => setPaymentReminders(!paymentReminders)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    paymentReminders ? "bg-[#2D6A4F]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow ${
                      paymentReminders ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Meal Reminders</p>
                  <p className="text-xs text-gray-500">Remind students to select meals</p>
                </div>
                <button
                  onClick={() => setMealReminders(!mealReminders)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    mealReminders ? "bg-[#2D6A4F]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow ${
                      mealReminders ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Maintenance Alerts</p>
                  <p className="text-xs text-gray-500">Notify about maintenance updates</p>
                </div>
                <button
                  onClick={() => setMaintenanceAlerts(!maintenanceAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    maintenanceAlerts ? "bg-[#2D6A4F]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow ${
                      maintenanceAlerts ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Reset Changes
        </button>
        <button 
          onClick={handleSave}
          className="px-8 py-3 bg-[#2D6A4F] text-white rounded-lg font-medium hover:bg-[#1e4a37] transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
