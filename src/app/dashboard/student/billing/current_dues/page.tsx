'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PayNow from "@/components/student/pay_now";
import { generateInvoicePDF } from "@/lib/generate-invoice-pdf";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getBDDate } from "@/lib/dates";
import {AlertTriangle } from "@boxicons/react"

interface Bill {
    seatrent: number;
    messbill: number;
    laundry: number;
    othercharges: number;
}

interface MealBreakdown {
    breakfast: { count: number; price: number; total: number };
    lunch: { count: number; price: number; total: number };
    dinner: { count: number; price: number; total: number };
    guestMeals: { count: number; price: number; total: number };
}

interface BillData {
    invoice_id: string;
    month: string;
    billinfo: Bill;
    amount: number;
    dueDate: string;
    isPaid: boolean;
    mealBreakdown?: MealBreakdown;
}

export default function CurrentDuesPage() {
    const [billdata, setBilldata] = useState<BillData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showMealDetails, setShowMealDetails] = useState(false);
    const { user } = useCurrentUser();

    // Calculate days until due
    const getDaysUntilDue = () => {
        if (!billdata) return 0;
        const dueDate = new Date(billdata.dueDate);
        const today = getBDDate();
        const diffTime = dueDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const daysUntilDue = getDaysUntilDue();
    const isOverdue = daysUntilDue < 0;
    const isNearDue = daysUntilDue >= 0 && daysUntilDue <= 5;

    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                const response = await fetch('/api/student/billing');
                if (!response.ok) {
                    throw new Error('Failed to fetch billing data');
                }
                const data = await response.json();
                setBilldata(data.currentBill);
            } catch (err) {
                console.error('Error fetching billing:', err);
                setError('Failed to load billing information');
            } finally {
                setLoading(false);
            }
        };

        fetchBillingData();
    }, []);

    const handleDownloadInvoice = () => {
        if (!billdata) return;
        generateInvoicePDF(
            {
                invoice_id: billdata.invoice_id,
                month: billdata.month,
                billinfo: {
                    seatrent: billdata.billinfo.seatrent,
                    messbill: billdata.billinfo.messbill,
                    othercharges: billdata.billinfo.othercharges + billdata.billinfo.laundry,
                },
                amount: billdata.amount,
            },
            billdata.dueDate,
            {
                name: user?.fullName || "Student",
                studentId: user?.studentId || "N/A",
                hallName: "Shahid Zia Hall",
                roomNo: user?.roomAllocation?.roomNumber || "N/A"
            }
        );
    };

    const billItems = [
        { key: 'seatrent', label: 'Seat Rent', icon: '🏠', color: 'bg-[#2D6A4F]/10 text-[#2D6A4F]', description: 'Monthly room rent' },
        { key: 'messbill', label: 'Mess Bill', icon: '🍽️', color: 'bg-blue-50 text-blue-600', description: 'Meals consumed this month', hasDetails: true },
        { key: 'laundry', label: 'Laundry', icon: '🧺', color: 'bg-orange-50 text-orange-600', description: 'Laundry service charges' },
        { key: 'othercharges', label: 'Other Charges', icon: '📋', color: 'bg-purple-50 text-purple-600', description: 'Maintenance, WiFi, etc.' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner className="w-6 h-6 text-[#2D6A4F]" />
            </div>
        );
    }

    if (error || !billdata) {
        return (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <p className="text-gray-600 font-medium">{error || 'No billing data available'}</p>
                <p className="text-gray-500 text-sm mt-1">Please check back later or contact administration</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Overdue/Near Due Warning */}
            {!billdata.isPaid && (isOverdue || isNearDue) && (
                <div className={`rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 ${
                    isOverdue ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isOverdue ? 'bg-red-100' : 'bg-yellow-100'
                        }`}
                        >
                        <AlertTriangle
                            className={`w-6 h-6 ${
                            isOverdue ? 'text-red-600' : 'text-yellow-600'
                            }`}
                        />
                    </div>
                    <div className="flex-1">
                        <p className={`font-bold ${isOverdue ? 'text-red-700' : 'text-yellow-700'}`}>
                            {isOverdue ? 'Payment Overdue!' : 'Payment Due Soon!'}
                        </p>
                        <p className={`text-sm ${isOverdue ? 'text-red-600' : 'text-yellow-600'}`}>
                            {isOverdue 
                                ? `Your payment is ${Math.abs(daysUntilDue)} days overdue. Late fees may apply.`
                                : `Only ${daysUntilDue} days left to pay. Avoid late fees by paying now.`
                            }
                        </p>
                    </div>
                    <div className="w-full md:w-[20%]">
                        <PayNow amount={billdata.amount} dueDate={billdata.dueDate} />
                    </div>
                </div>
            )}

            {/* Paid Status */}
            {billdata.isPaid && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-bold text-green-700">Payment Complete!</p>
                        <p className="text-sm text-green-600">Your dues for {billdata.month} have been paid. Thank you!</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <svg className="w-6 h-6 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            Current Dues Overview
                        </h1>
                        <p className="text-gray-500 mt-1">Invoice: {billdata.invoice_id} • {billdata.month}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Due Date</p>
                            <p className={`font-bold ${isOverdue ? 'text-red-600' : isNearDue ? 'text-yellow-600' : 'text-gray-700'}`}>
                                {billdata.dueDate}
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            billdata.isPaid 
                                ? 'bg-green-100 text-green-700' 
                                : isOverdue
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            {billdata.isPaid ? '✓ Paid' : isOverdue ? 'Overdue' : 'Pending'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bill Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {billItems.map((item) => (
                    <div 
                        key={item.key} 
                        className={`bg-white rounded-xl p-5 shadow-sm transition-all ${
                            item.hasDetails ? 'cursor-pointer hover:shadow-md' : ''
                        }`}
                        onClick={() => item.hasDetails && setShowMealDetails(!showMealDetails)}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center text-xl`}>
                                {item.icon}
                            </div>
                            {item.hasDetails && (
                                <svg className={`w-5 h-5 text-gray-400 transition-transform ${showMealDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                        </div>
                        <p className="text-2xl font-bold text-gray-800 mb-1">
                            ৳{billdata.billinfo[item.key as keyof Bill].toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">{item.label}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                    </div>
                ))}
            </div>

            {/* Meal Breakdown Details */}
            {showMealDetails && billdata.mealBreakdown && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 space-y-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-xl">🍽️</span> Meal Breakdown Details
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg p-4">
                            <p className="text-sm text-gray-500">Breakfast</p>
                            <p className="text-lg font-bold text-gray-800">{billdata.mealBreakdown.breakfast.count} meals</p>
                            <p className="text-sm text-gray-600">৳{billdata.mealBreakdown.breakfast.price} × {billdata.mealBreakdown.breakfast.count} = ৳{billdata.mealBreakdown.breakfast.total}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <p className="text-sm text-gray-500">Lunch</p>
                            <p className="text-lg font-bold text-gray-800">{billdata.mealBreakdown.lunch.count} meals</p>
                            <p className="text-sm text-gray-600">৳{billdata.mealBreakdown.lunch.price} × {billdata.mealBreakdown.lunch.count} = ৳{billdata.mealBreakdown.lunch.total}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <p className="text-sm text-gray-500">Dinner</p>
                            <p className="text-lg font-bold text-gray-800">{billdata.mealBreakdown.dinner.count} meals</p>
                            <p className="text-sm text-gray-600">৳{billdata.mealBreakdown.dinner.price} × {billdata.mealBreakdown.dinner.count} = ৳{billdata.mealBreakdown.dinner.total}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <p className="text-sm text-gray-500">Guest Meals</p>
                            <p className="text-lg font-bold text-gray-800">{billdata.mealBreakdown.guestMeals.count} meals</p>
                            <p className="text-sm text-gray-600">৳{billdata.mealBreakdown.guestMeals.price} × {billdata.mealBreakdown.guestMeals.count} = ৳{billdata.mealBreakdown.guestMeals.total}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Breakdown */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Payment Breakdown</h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {billItems.map((item) => (
                        <div key={item.key} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{item.icon}</span>
                                <div>
                                    <span className="font-medium text-gray-700">{item.label}</span>
                                    <p className="text-xs text-gray-400">{item.description}</p>
                                </div>
                            </div>
                            <span className="font-semibold text-gray-800">৳{billdata.billinfo[item.key as keyof Bill].toLocaleString()}</span>
                        </div>
                    ))}
                </div>
                <div className="px-6 py-4 bg-[#2D6A4F]/5 flex justify-between items-center border-t-2 border-[#2D6A4F]/20">
                    <span className="font-bold text-lg text-gray-800">Total Amount</span>
                    <span className="font-bold text-2xl text-[#2D6A4F]">৳{billdata.amount.toLocaleString()}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!billdata.isPaid && (
                    <PayNow amount={billdata.amount} dueDate={billdata.dueDate} />
                )}
                <Button 
                    className={`w-full h-12 ${billdata.isPaid ? 'col-span-full' : ''} bg-gray-600 hover:bg-gray-700 text-white font-medium cursor-pointer flex items-center justify-center gap-2`} 
                    onClick={handleDownloadInvoice}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Invoice
                </Button>
            </div>

            {/* Payment Methods Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Accepted Payment Methods</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { name: 'bKash', color: 'bg-pink-50 text-pink-600', icon: '📱' },
                        { name: 'Nagad', color: 'bg-orange-50 text-orange-600', icon: '💳' },
                        { name: 'Rocket', color: 'bg-purple-50 text-purple-600', icon: '🚀' },
                        { name: 'Bank Transfer', color: 'bg-blue-50 text-blue-600', icon: '🏦' },
                    ].map((method) => (
                        <div key={method.name} className={`${method.color} rounded-lg p-4 text-center`}>
                            <span className="text-2xl">{method.icon}</span>
                            <p className="font-medium mt-1">{method.name}</p>
                        </div>
                    ))}
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">
                    Having trouble with payment? Contact the financial office for assistance.
                </p>
            </div>
        </div>
    );
}