'use client';

import { useState, useEffect } from "react";
import StudentInvoice from "@/components/student/invoice";
import PayNow from "@/components/student/pay_now";
import { generateInvoicePDF } from "@/lib/generate-invoice-pdf";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Bill {
    seatrent: number;
    messbill: number;
    laundry: number;
    fine: number;
    othercharges: number;
}

interface Invoice {
    invoice_id: string;
    month: string;
    billinfo: Bill;
    amount: number;
    media?: "Bkash" | "Nagad" | "Rocket" | "Card";
    isPaid?: boolean;
    dueDate?: string;
}

interface PaymentHistory {
    id: string;
    paymentId: string;
    type: string;
    amount: number;
    status: string;
    billingMonth: number;
    billingYear: number;
    paidDate: string | null;
    createdAt: string;
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useCurrentUser();

    const getMonthName = (month: number, year: number) => {
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                           "July", "August", "September", "October", "November", "December"];
        return `${monthNames[month - 1]} ${year}`;
    };

    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                const response = await fetch('/api/student/billing');
                if (!response.ok) {
                    throw new Error('Failed to fetch billing data');
                }
                const data = await response.json();
                
                // Group payments by billing period
                const paymentsByPeriod = new Map<string, any[]>();
                data.payments.forEach((payment: any) => {
                    const key = `${payment.billingYear}-${String(payment.billingMonth).padStart(2, '0')}`;
                    if (!paymentsByPeriod.has(key)) {
                        paymentsByPeriod.set(key, []);
                    }
                    paymentsByPeriod.get(key)?.push(payment);
                });
                
                // Create invoices from grouped payments
                const invoicesList: Invoice[] = [];
                Array.from(paymentsByPeriod.entries())
                    .sort(([a], [b]) => b.localeCompare(a)) // Sort by period desc
                    .forEach(([_, payments]) => {
                        const firstPayment = payments[0];
                        
                        // Calculate breakdown from individual payments by type
                        const breakdown = {
                            seatrent: 0,
                            messbill: 0,
                            laundry: 0,
                            fine: 0,
                            othercharges: 0,
                        };
                        
                        let totalAmount = 0;
                        const isPaid = payments.every((p: any) => p.status === 'completed');
                        
                        payments.forEach((payment: any) => {
                            totalAmount += payment.finalAmount || payment.amount;
                            
                            switch (payment.type) {
                                case 'hall_fee':
                                    breakdown.seatrent += payment.amount;
                                    break;
                                case 'mess_fee':
                                    breakdown.messbill += payment.amount;
                                    break;
                                case 'laundry_fee':
                                    breakdown.laundry += payment.amount;
                                    break;
                                case 'fine':
                                    breakdown.fine += payment.amount;
                                    break;
                                case 'other':
                                    breakdown.othercharges += payment.amount;
                                    break;
                            }

                            if(payment.lateFee) {
                                breakdown.fine += payment.lateFee;
                            }
                        });
                        
                        // Calculate due date (last day of the billing month)
                        const monthName = getMonthName(firstPayment.billingMonth, firstPayment.billingYear);
                        const [month, year] = monthName.split(' ');
                        const lastDay = new Date(parseInt(year), new Date(`${month} 1`).getMonth() + 1, 0).getDate();
                        const dueDate = `${month.slice(0, 3)} ${lastDay}, ${year}`;
                        
                        invoicesList.push({
                            invoice_id: firstPayment.paymentId,
                            month: monthName,
                            billinfo: breakdown,
                            amount: totalAmount,
                            isPaid,
                            dueDate,
                        });
                    });
                
                setInvoices(invoicesList);
                
                // Create payment history from all payments
                const history: PaymentHistory[] = data.payments.map((payment: any) => ({
                    id: payment._id,
                    paymentId: payment.paymentId,
                    type: payment.type,
                    amount: payment.finalAmount || payment.amount,
                    status: payment.status,
                    billingMonth: payment.billingMonth,
                    billingYear: payment.billingYear,
                    paidDate: payment.paidDate,
                    createdAt: payment.createdAt,
                }));
                
                setPaymentHistory(history);
            } catch (err) {
                console.error('Error fetching invoices:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBillingData();
    }, []);

    const handleDownloadInvoice = (invoice: Invoice) => {
        const monthYear = invoice.month.split(' ');
        const month = monthYear[0];
        const year = monthYear[1];
        const lastDay = new Date(parseInt(year), new Date(`${month} 1`).getMonth() + 1, 0).getDate();
        const dueDate = `${month.slice(0, 3)} ${lastDay}, ${year}`;
        
        generateInvoicePDF(
            invoice,
            dueDate,
            {
                name: user?.fullName || "Student",
                studentId: user?.studentId || "N/A",
                hallName: "Shahid Zia Hall",
                roomNo: user?.roomAllocation?.roomNumber || "N/A"
            }
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner className="w-6 h-6 text-[#2D6A4F]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                <h1 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Invoices
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">View and download your billing invoices</p>
            </div>

            {/* Invoices List */}
            {invoices.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
                    {invoices.map((invoice) => (
                        <div key={invoice.invoice_id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col gap-4">
                                {/* Top Section: Invoice Info */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2D6A4F]/10 rounded-lg flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium sm:font-semibold text-gray-800 text-sm sm:text-base">{invoice.month}</p>
                                            <p className="text-xs sm:text-sm text-gray-500 font-mono">{invoice.invoice_id}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        <p className="text-base sm:text-lg font-semibold text-gray-800">৳{invoice.amount.toLocaleString()}</p>
                                        <span className={`inline-block mt-1 text-xs font-medium px-2 py-1 rounded-full ${invoice.isPaid 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-yellow-100 text-yellow-700'}`}>
                                            {invoice.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Bottom Section: Action Buttons */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {invoice.isPaid ? <StudentInvoice invoiceinfo={invoice} /> : <PayNow amount={invoice.amount} dueDate={invoice.dueDate || ''} onPaymentSuccess={() => window.location.reload()} />}
                                    <button
                                        className="h-10 sm:h-12 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium cursor-pointer"
                                        onClick={() => handleDownloadInvoice(invoice)}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        <span className="hidden sm:inline">Download</span>
                                        <span className="sm:hidden">Download Invoice</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500">No invoices available</p>
                </div>
            )}

            {/* Payment History */}
            {paymentHistory.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-gray-100">
                        <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Payment History
                        </h2>
                    </div>
                    
                    {/* Mobile Card View */}
                    <div className="lg:hidden divide-y divide-gray-100">
                        {paymentHistory.map((payment) => (
                            <div key={payment.id} className="p-4 hover:bg-gray-50">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Payment ID</p>
                                            <p className="font-mono text-sm text-gray-800">{payment.paymentId}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 mb-1">Amount</p>
                                            <p className="font-bold text-gray-800">৳{payment.amount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Period</p>
                                            <p className="text-sm text-gray-800">
                                                {getMonthName(payment.billingMonth, payment.billingYear)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Type</p>
                                            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                                {payment.type.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Status</p>
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                                payment.status === 'completed' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : payment.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {payment.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Paid Date</p>
                                            <p className="text-sm text-gray-800">
                                                {payment.paidDate 
                                                    ? new Date(payment.paidDate).toLocaleDateString('en-US', { 
                                                        month: 'short', day: 'numeric', year: 'numeric' 
                                                      })
                                                    : '-'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Payment ID</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Period</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Type</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Paid Date</th>
                                    <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paymentHistory.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-mono text-gray-600">{payment.paymentId}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {getMonthName(payment.billingMonth, payment.billingYear)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                                {payment.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                payment.status === 'completed' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : payment.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {payment.paidDate 
                                                ? new Date(payment.paidDate).toLocaleDateString('en-US', { 
                                                    month: 'short', day: 'numeric', year: 'numeric' 
                                                  })
                                                : '-'
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-800">৳{payment.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}