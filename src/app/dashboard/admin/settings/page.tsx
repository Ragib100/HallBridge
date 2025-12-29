"use client";

import { useState } from "react";

interface PricingItem {
  name: string;
  price: number;
}

const pricingItems: PricingItem[] = [
  { name: "Rent", price: 3000 },
  { name: "Laundry", price: 400 },
  { name: "Maintenance", price: 100 },
  { name: "Breakfast", price: 50 },
  { name: "Lunch", price: 70 },
  { name: "Dinner", price: 80 },
];

export default function SettingsPage() {
  const [mealCutoffTime, setMealCutoffTime] = useState("08:00");
  const [gatePassDuration, setGatePassDuration] = useState("3");
  const [gatePassUnit, setGatePassUnit] = useState("Days");
  const [laundryPickupDay, setLaundryPickupDay] = useState("Tuesday");
  const [laundryDeliveryDays, setLaundryDeliveryDays] = useState("2");
  const [emergencyEmail, setEmergencyEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [prices, setPrices] = useState(pricingItems);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);

  const handlePriceChange = (name: string, newPrice: number) => {
    setPrices(prices.map(item => 
      item.name === name ? { ...item, price: newPrice } : item
    ));
  };

  return (
    <div className="space-y-6">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Operational Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Operational Settings</h2>
            
            <div className="space-y-5">
              {/* Meal Selection Cutoff */}
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
              </div>

              {/* Gate Pass Duration */}
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
                    <option value="Hours">Hours</option>
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                  </select>
                </div>
              </div>

              {/* Laundry Pickup Day */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Laundry Pickup Day
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
                  <option value="Sunday">Sunday</option>
                </select>
              </div>

              {/* Laundry Delivery Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Laundry Delivery (Days After Pickup)
                </label>
                <input
                  type="number"
                  value={laundryDeliveryDays}
                  onChange={(e) => setLaundryDeliveryDays(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Communication */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Communication</h2>
            
            <div className="space-y-5">
              {/* Emergency Contact Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Email
                </label>
                <input
                  type="email"
                  value={emergencyEmail}
                  onChange={(e) => setEmergencyEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>

              {/* Support Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support Phone
                </label>
                <input
                  type="tel"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Enable Push Notifications</span>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    notificationsEnabled ? "bg-[#2D6A4F]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow ${
                      notificationsEnabled ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pricing Configuration */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Pricing Configuration</h2>
            
            <div className="space-y-4">
              {prices.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <div className="flex items-center gap-2">
                    {editingPrice === item.name ? (
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handlePriceChange(item.name, parseInt(e.target.value) || 0)}
                        onBlur={() => setEditingPrice(null)}
                        autoFocus
                        className="w-24 p-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-800">৳{item.price}</span>
                    )}
                    <button
                      onClick={() => setEditingPrice(editingPrice === item.name ? null : item.name)}
                      className="text-[#2D6A4F] hover:text-[#1e4a37] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Management */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-6">System Management</h2>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Backup Data</p>
                    <p className="text-xs text-gray-500">Last backup: Nov 28, 2025</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Restore Data</p>
                    <p className="text-xs text-gray-500">Restore from a previous backup</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">View Logs</p>
                    <p className="text-xs text-gray-500">System activity and error logs</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-red-600">Clear All Data</p>
                    <p className="text-xs text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-8 py-3 bg-[#2D6A4F] text-white rounded-lg font-medium hover:bg-[#1e4a37] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
