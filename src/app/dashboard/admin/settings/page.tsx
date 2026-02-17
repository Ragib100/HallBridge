"use client";

import { useEffect, useState } from "react";

type TabType = "general" | "pricing" | "operations" | "notifications";

interface PricingItem {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  editable: boolean;
}

const pricingItems: PricingItem[] = [
  { id: "1", name: "Monthly Rent", description: "Room rent per month", price: 3000, unit: "/month", editable: true },
  { id: "2", name: "Laundry Service", description: "Weekly laundry charge", price: 400, unit: "/week", editable: true },
  { id: "3", name: "Maintenance Fee", description: "Monthly maintenance", price: 100, unit: "/month", editable: true },
  { id: "4", name: "WiFi Bill", description: "Monthly internet charges", price: 100, unit: "/month", editable: true },
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [changes, setChanges] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [hallName, setHallName] = useState("Shahid Zia Hall");
  const [hallAddress, setHallAddress] = useState("University of Engineering & Technology");
  const [adminEmail, setAdminEmail] = useState("admin@hallbridge.com");
  const [adminPhone, setAdminPhone] = useState("+880 1712-345678");
  const [emergencyContact, setEmergencyContact] = useState("");
  
  // Operations
  const [mealCutoffTime, setMealCutoffTime] = useState("22:00");
  const [breakfastTime, setBreakfastTime] = useState("7:30 - 9:30 AM");
  const [lunchTime, setLunchTime] = useState("12:30 - 2:30 PM");
  const [dinnerTime, setDinnerTime] = useState("7:30 - 9:30 PM");
  const [gatePassDuration, setGatePassDuration] = useState("3");
  const [gatePassUnit, setGatePassUnit] = useState("days");
  const [maxGatePassDays, setMaxGatePassDays] = useState("7");
  const [laundryPickupDay, setLaundryPickupDay] = useState("Tuesday");
  const [laundryDeliveryDays, setLaundryDeliveryDays] = useState("2");
  const [checkInTime, setCheckInTime] = useState("22:00");
  const [lateEntryFine, setLateEntryFine] = useState("50");
  const [maxLaundryItems, setMaxLaundryItems] = useState("20");
  const [billGenerationDate, setBillGenerationDate] = useState("1");
  const [paymentDueDays, setPaymentDueDays] = useState("15");
  const [lateFeePercent, setLateFeePercent] = useState("5");
  
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

  // Current Status Stats
  const [currentStats, setCurrentStats] = useState({
    totalRooms: 0,
    activeStudents: 0,
    staffMembers: 0,
    occupancyRate: 0,
    totalBeds: 0,
    occupiedBeds: 0,
  });

  // helpers
  const markChange = (key: string, value: any) => {
    setChanges((prev) => ({ ...prev, [key]: value }));
  };

  // load settings and stats from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        
        // Fetch settings
        const res = await fetch("/api/admin/settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();

        setHallName(data.hall_name ?? hallName);
        setHallAddress(data.institution_address ?? hallAddress);
        setAdminEmail(data.admin_email ?? adminEmail);
        setAdminPhone(data.admin_phone ?? adminPhone);
        setEmergencyContact(data.emergency_contact ?? emergencyContact);

        setMealCutoffTime(data.meal_cutoff_time ?? mealCutoffTime);
        setBreakfastTime(data.breakfast_time ?? breakfastTime);
        setLunchTime(data.lunch_time ?? lunchTime);
        setDinnerTime(data.dinner_time ?? dinnerTime);
        setGatePassDuration(data.gate_pass_duration ?? gatePassDuration);
        setGatePassUnit(data.gate_pass_unit ?? gatePassUnit);
        setMaxGatePassDays(data.max_gate_pass_days ?? maxGatePassDays);
        setLaundryPickupDay(data.laundry_pickup_day ?? laundryPickupDay);
        setLaundryDeliveryDays(data.laundry_delivery_days ?? laundryDeliveryDays);
        setCheckInTime(data.check_in_time ?? checkInTime);
        setLateEntryFine(data.late_entry_fine ?? lateEntryFine);
        setMaxLaundryItems(data.max_laundry_items ?? maxLaundryItems);
        setBillGenerationDate(data.bill_generation_date ?? billGenerationDate);
        setPaymentDueDays(data.payment_due_days ?? paymentDueDays);
        setLateFeePercent(data.late_fee_percent ?? data.late_fee_percentage ?? lateFeePercent);

        setEmailNotifications(data.email_notifications ?? emailNotifications);
        setSmsNotifications(data.sms_notifications ?? smsNotifications);
        setPaymentReminders(data.payment_reminders ?? paymentReminders);
        setMealReminders(data.meal_reminders ?? mealReminders);
        setMaintenanceAlerts(data.maintenance_alerts ?? maintenanceAlerts);

        setPrices((prev) => prev.map((p) => {
          if (p.id === "1") return { ...p, price: data.monthly_rent ?? p.price };
          if (p.id === "2") return { ...p, price: data.laundry_fee ?? data.laundry_service_weekly ?? p.price };
          if (p.id === "3") return { ...p, price: data.maintenance_fee ?? p.price };
          if (p.id === "4") return { ...p, price: data.wifi_fee ?? data.wifi_bill ?? p.price };
          return p;
        }));

        // Fetch current stats (rooms and users)
        try {
          const [roomsRes, statsRes] = await Promise.all([
            fetch("/api/admin/rooms?floor=1&limit=1"), // Just to get stats
            fetch("/api/admin/stats"),
          ]);
          
          if (roomsRes.ok) {
            const roomsData = await roomsRes.json();
            const stats = roomsData.stats || {};
            const totalBeds = stats.totalBeds || 0;
            const occupiedBeds = stats.occupiedBeds || 0;
            const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
            
            setCurrentStats(prev => ({
              ...prev,
              totalRooms: stats.totalRooms || 0,
              totalBeds,
              occupiedBeds,
              occupancyRate,
            }));
          }
          
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setCurrentStats(prev => ({
              ...prev,
              activeStudents: statsData.stats?.students?.total || 0,
              staffMembers: statsData.stats?.staff?.total || 0,
            }));
          }
        } catch (statsErr) {
          console.error("Failed to fetch stats:", statsErr);
        }

        setChanges({});
      } catch (err) {
        console.error(err);
        setError("Settings load failed");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handlePriceChange = (id: string, newPrice: number) => {
    const keyMap: Record<string, string> = {
      "1": "monthly_rent",
      "2": "laundry_fee",
      "3": "maintenance_fee",
      "4": "wifi_fee",
    };
    setPrices(prices.map(item => 
      item.id === id ? { ...item, price: newPrice } : item
    ));
    const key = keyMap[id];
    if (key) markChange(key, newPrice);
  };

  const handleSave = async () => {
    const updates = [
      { key: "hall_name", value: hallName },
      { key: "institution_address", value: hallAddress },
      { key: "admin_email", value: adminEmail },
      { key: "admin_phone", value: adminPhone },
      { key: "emergency_contact", value: emergencyContact },
      { key: "meal_cutoff_time", value: mealCutoffTime },
      { key: "breakfast_time", value: breakfastTime },
      { key: "lunch_time", value: lunchTime },
      { key: "dinner_time", value: dinnerTime },
      { key: "gate_pass_duration", value: gatePassDuration },
      { key: "gate_pass_unit", value: gatePassUnit },
      { key: "max_gate_pass_days", value: maxGatePassDays },
      { key: "laundry_pickup_day", value: laundryPickupDay },
      { key: "laundry_delivery_days", value: laundryDeliveryDays },
      { key: "check_in_time", value: checkInTime },
      { key: "late_entry_fine", value: lateEntryFine },
      { key: "max_laundry_items", value: maxLaundryItems },
      { key: "bill_generation_date", value: billGenerationDate },
      { key: "payment_due_days", value: paymentDueDays },
      { key: "late_fee_percent", value: lateFeePercent },
      { key: "email_notifications", value: emailNotifications },
      { key: "sms_notifications", value: smsNotifications },
      { key: "payment_reminders", value: paymentReminders },
      { key: "meal_reminders", value: mealReminders },
      { key: "maintenance_alerts", value: maintenanceAlerts },
      { key: "monthly_rent", value: prices.find(p => p.id === "1")?.price ?? 3000 },
      { key: "laundry_fee", value: prices.find(p => p.id === "2")?.price ?? 400 },
      { key: "maintenance_fee", value: prices.find(p => p.id === "3")?.price ?? 100 },
      { key: "wifi_fee", value: prices.find(p => p.id === "4")?.price ?? 100 },
    ].filter((item) => Object.prototype.hasOwnProperty.call(changes, item.key));

    // If no tracked changes, nothing to do
    if (updates.length === 0) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Save failed");

      setShowSuccess(true);
      setChanges({});
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      setError("Save failed");
      setTimeout(() => setError(null), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

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
        {error && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
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
                  onChange={(e) => { setHallName(e.target.value); markChange("hall_name", e.target.value); }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address / Institution</label>
                <input
                  type="text"
                  value={hallAddress}
                  onChange={(e) => { setHallAddress(e.target.value); markChange("institution_address", e.target.value); }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Capacity</label>
                <input
                  type="number"
                  value={currentStats.totalBeds}
                  disabled
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1">Auto-calculated from total room beds</p>
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
                  onChange={(e) => { setAdminEmail(e.target.value); markChange("admin_email", e.target.value); }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Phone</label>
                <input
                  type="tel"
                  value={adminPhone}
                  onChange={(e) => { setAdminPhone(e.target.value); markChange("admin_phone", e.target.value); }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => { setEmergencyContact(e.target.value); markChange("emergency_contact", e.target.value); }}
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
                <p className="text-2xl font-bold text-blue-700">{currentStats.totalRooms}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Active Students</p>
                <p className="text-2xl font-bold text-green-700">{currentStats.activeStudents}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600">Staff Members</p>
                <p className="text-2xl font-bold text-purple-700">{currentStats.staffMembers}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-orange-700">{currentStats.occupancyRate}%</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Beds</span>
                <span className="font-medium text-gray-700">{currentStats.totalBeds}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Occupied Beds</span>
                <span className="font-medium text-gray-700">{currentStats.occupiedBeds}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Available Beds</span>
                <span className="font-medium text-green-600">{currentStats.totalBeds - currentStats.occupiedBeds}</span>
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

          {/* Meal Pricing Info */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800">Meal Pricing</p>
              <p className="text-xs text-blue-700">Meal prices (breakfast, lunch, dinner, guest meal) are managed by the Financial Staff daily based on actual kitchen expenses. This ensures accurate billing based on real costs.</p>
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
                  onChange={(e) => { setMealCutoffTime(e.target.value); markChange("meal_cutoff_time", e.target.value); }}
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
                    <input
                      type="text"
                      value={breakfastTime}
                      onChange={(e) => { setBreakfastTime(e.target.value); markChange("breakfast_time", e.target.value); }}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none bg-white"
                    />
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Lunch</p>
                    <input
                      type="text"
                      value={lunchTime}
                      onChange={(e) => { setLunchTime(e.target.value); markChange("lunch_time", e.target.value); }}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none bg-white"
                    />
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Dinner</p>
                    <input
                      type="text"
                      value={dinnerTime}
                      onChange={(e) => { setDinnerTime(e.target.value); markChange("dinner_time", e.target.value); }}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none bg-white"
                    />
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
                    onChange={(e) => { setGatePassDuration(e.target.value); markChange("gate_pass_duration", e.target.value); }}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                  />
                  <select
                    value={gatePassUnit}
                    onChange={(e) => { setGatePassUnit(e.target.value); markChange("gate_pass_unit", e.target.value); }}
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
                  onChange={(e) => { setMaxGatePassDays(e.target.value); markChange("max_gate_pass_days", e.target.value); }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
                  <input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => { setCheckInTime(e.target.value); markChange("check_in_time", e.target.value); }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Late Entry Fine (৳)</label>
                  <input
                    type="number"
                    value={lateEntryFine}
                    onChange={(e) => { setLateEntryFine(e.target.value); markChange("late_entry_fine", e.target.value); }}
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
                  onChange={(e) => { setLaundryPickupDay(e.target.value); markChange("laundry_pickup_day", e.target.value); }}
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
                  onChange={(e) => { setLaundryDeliveryDays(e.target.value); markChange("laundry_delivery_days", e.target.value); }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Items Per Week
                </label>
                <input
                  type="number"
                  value={maxLaundryItems}
                  onChange={(e) => { setMaxLaundryItems(e.target.value); markChange("max_laundry_items", e.target.value); }}
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
                <select
                  value={billGenerationDate}
                  onChange={(e) => { setBillGenerationDate(e.target.value); markChange("bill_generation_date", e.target.value); }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none bg-white"
                >
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
                  value={paymentDueDays}
                  onChange={(e) => { setPaymentDueDays(e.target.value); markChange("payment_due_days", e.target.value); }}
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
                  value={lateFeePercent}
                  onChange={(e) => { setLateFeePercent(e.target.value); markChange("late_fee_percent", e.target.value); }}
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
                  onClick={() => { setEmailNotifications(!emailNotifications); markChange("email_notifications", !emailNotifications); }}
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
                  onClick={() => { setSmsNotifications(!smsNotifications); markChange("sms_notifications", !smsNotifications); }}
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
                  onClick={() => { setPaymentReminders(!paymentReminders); markChange("payment_reminders", !paymentReminders); }}
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
                  onClick={() => { setMealReminders(!mealReminders); markChange("meal_reminders", !mealReminders); }}
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
                  onClick={() => { setMaintenanceAlerts(!maintenanceAlerts); markChange("maintenance_alerts", !maintenanceAlerts); }}
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
        <button className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer">
          Reset Changes
        </button>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-[#2D6A4F] text-white rounded-lg font-medium hover:bg-[#1e4a37] transition-colors disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
