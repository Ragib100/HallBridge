'use client';

import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "@/components/ui/dialog";

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
}

export default function StudentInvoice({ invoiceinfo }: { invoiceinfo: Invoice }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className="h-12 px-4 bg-[#2D6A4F] hover:bg-[#245a42] text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium cursor-pointer justify-center"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                        Invoice Details
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        {invoiceinfo.month}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                    
                    <div className="bg-[#2D6A4F]/10 border border-[#2D6A4F]/20 rounded-lg p-4">
                        <p className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-wide mb-1">
                            Invoice ID
                        </p>
                        <p className="text-lg font-mono font-bold text-gray-800">
                            {invoiceinfo.invoice_id}
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Bill Breakdown
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {Object.entries(invoiceinfo.billinfo).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center px-4 py-3">
                                    <span className="text-gray-700 font-medium">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="text-gray-900 font-semibold">৳{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={` ${invoiceinfo.media ? "bg-green-50 border-green-300 " : "bg-yellow-50 border-yellow-300 "} rounded-lg p-5 border-2`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className={`text-xs font-semibold ${invoiceinfo.media ? "text-green-700" : "text-yellow-700"} uppercase tracking-wide mb-1`}>
                                    Total Amount
                                </p>
                                <p className={`text-3xl font-bold ${invoiceinfo.media ? "text-green-900" : "text-yellow-900"}`}>
                                    ৳{invoiceinfo.amount}
                                </p>
                            </div>
                            {invoiceinfo.media && (
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                                        Payment Method
                                    </p>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#2D6A4F] text-white">
                                        {invoiceinfo.media}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-6">
                    <DialogClose asChild>
                        <button className="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium cursor-pointer">
                            Close
                        </button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}