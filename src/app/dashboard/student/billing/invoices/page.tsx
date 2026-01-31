'use client';

import { useState, useEffect } from "react";
import StudentInvoice from "@/components/student/invoice";
import { generateInvoicePDF } from "@/lib/generate-invoice-pdf";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Bill {
    seatrent: number;
    messbill: number;
    othercharges: number;
}

interface Invoice {
    invoice_id: string;
    month: string;
    billinfo: Bill;
    amount: number;
    media?: "Bkash" | "Nagad" | "Rocket" | "Card";
    isPaid?: boolean;
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
                
                // Create current month invoice from API data
                if (data.currentBill) {
                    const currentInvoice: Invoice = {
                        invoice_id: data.currentBill.invoice_id,
                        month: data.currentBill.month,
                        billinfo: {
                            seatrent: data.currentBill.billinfo.seatrent,
                            messbill: data.currentBill.billinfo.messbill,
                            othercharges: data.currentBill.billinfo.othercharges + (data.currentBill.billinfo.laundry || 0),
                        },
                        amount: data.currentBill.amount,
                        isPaid: data.currentBill.isPaid,
                    };
                    setInvoices([currentInvoice]);
                }

                // Store payment history
                if (data.paymentHistory) {
                    setPaymentHistory(data.paymentHistory);
                }
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
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Invoices
                </h1>
                <p className="text-gray-500 mt-1">View and download your billing invoices</p>
            </div>

            {/* Invoices List */}
            {invoices.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
                    {invoices.map((invoice) => (
                        <div key={invoice.invoice_id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#2D6A4F]/10 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{invoice.month}</p>
                                        <p className="text-sm text-gray-500">{invoice.invoice_id}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <div className="flex-1 md:flex-none md:text-right mr-4">
                                        <p className="text-lg font-semibold text-gray-800">৳{invoice.amount}</p>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${invoice.isPaid 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-yellow-100 text-yellow-700'}`}>
                                            {invoice.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <StudentInvoice invoiceinfo={invoice} />
                                        <button
                                            className="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                                            onClick={() => handleDownloadInvoice(invoice)}
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download
                                        </button>
                                    </div>
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
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Payment History
                        </h2>
                    </div>
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
            )}
        </div>
    );
}