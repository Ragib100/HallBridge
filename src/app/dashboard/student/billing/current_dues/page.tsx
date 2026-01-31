'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PayNow from "@/components/student/pay_now";
import { generateInvoicePDF } from "@/lib/generate-invoice-pdf";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Bill {
    seatrent: number;
    messbill: number;
    laundry: number;
    othercharges: number;
}

interface BillData {
    invoice_id: string;
    month: string;
    billinfo: Bill;
    amount: number;
    dueDate: string;
    isPaid: boolean;
}

export default function CurrentDuesPage() {
    const [billdata, setBilldata] = useState<BillData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useCurrentUser();

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
        console.log(user);
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
        { key: 'seatrent', label: 'Seat Rent', icon: '🏠', color: 'bg-[#2D6A4F]/10 text-[#2D6A4F]' },
        { key: 'messbill', label: 'Mess Bill', icon: '🍽️', color: 'bg-blue-50 text-blue-600' },
        { key: 'laundry', label: 'Laundry', icon: '🧺', color: 'bg-orange-50 text-orange-600' },
        { key: 'othercharges', label: 'Other Charges', icon: '📋', color: 'bg-purple-50 text-purple-600' },
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
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <p className="text-red-600">{error || 'No billing data available'}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <svg className="w-6 h-6 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            Current Dues Overview
                        </h1>
                        <p className="text-gray-500 mt-1">Invoice: {billdata.invoice_id} • {billdata.month}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p className="font-bold text-red-600">{billdata.dueDate}</p>
                    </div>
                </div>
            </div>

            {/* Bill Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {billItems.map((item) => (
                    <div key={item.key} className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-2xl`}>
                                {item.icon}
                            </div>
                            <span className="text-gray-600 font-medium text-sm">{item.label}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">
                            ৳{billdata.billinfo[item.key as keyof Bill]}
                        </p>
                    </div>
                ))}
            </div>

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
                                <span className="font-medium text-gray-700">{item.label}</span>
                            </div>
                            <span className="font-semibold text-gray-800">৳{billdata.billinfo[item.key as keyof Bill]}</span>
                        </div>
                    ))}
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-between items-center border-t-2 border-gray-200">
                    <span className="font-bold text-lg text-gray-800">Total Amount</span>
                    <span className="font-bold text-2xl text-[#2D6A4F]">৳{billdata.amount}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PayNow amount={billdata.amount} dueDate={billdata.dueDate} />
                <Button 
                    className="w-full h-12 bg-gray-600 hover:bg-gray-700 text-white font-medium cursor-pointer flex items-center justify-center gap-2" 
                    onClick={handleDownloadInvoice}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Invoice
                </Button>
            </div>
        </div>
    );
}