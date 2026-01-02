'use client';

import { useState } from "react";
import { getIcon } from "@/components/common/icons";
import { Button } from "@/components/ui/button";
import PayNow from "@/components/student/pay_now";
import { generateInvoicePDF } from "@/lib/generate-invoice-pdf";

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
}

export default function CurrentDuesPage() {

    const [billdata, setBillData] = useState<Invoice>({
        month: 'December 2025', invoice_id: 'INV-2025-12', billinfo: { seatrent: 200, messbill: 150, othercharges: 100 }, amount: 450
    });

    const colors: string[] = ['#649dfa', '#64faf5', '#6af7a3', '#e2f576'];

    const handleDownloadInvoice = () => {
        generateInvoicePDF(
            billdata,
            "Dec 31, 2025",
            {
                name: "Student Name",
                studentId: "2021-123456",
                hallName: "Hall Name",
                roomNo: "101"
            }
        );
    };

    return (
        <div className="fgap-8 py-6">
            <div className="flex flex-col px-4 py-4">
                <p className="text-lg font-bold">{getIcon('bills')} Current Dues Overview</p>
                <p className="">Due Date: Dec 31, 2025</p>
            </div>

            <div className="flex gap-4 px-4">
                {Object.entries(billdata.billinfo).map(([key, value], index) => (
                    <div key={key} className="rounded-lg py-6 items-center justify-center flex flex-col w-full" style={{background: colors[index]}}>
                        <p className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <div className="text-3xl">{getIcon('taka')} {value}</div>
                    </div>
                ))}
            </div>

            <div className="px-4 py-8 my-4">
                <h3 className="text-lg font-bold mb-4">Payment Breakdown</h3>
                {Object.entries(billdata.billinfo).map(([key, value]) => (
                    <div key={key} className="px-4 border-t py-2">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="flex items-center">{getIcon('taka')} {value}</p>
                        </div>
                    </div>
                ))}

                <div className="px-4 border-t-2 border-black py-3 mt-2">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-lg">Total Amount</p>
                        <p className="flex items-center font-bold text-lg">{getIcon('taka')} {billdata.amount}</p>
                    </div>
                </div>
            </div>

            <div className="flex w-full justify-between">
                <div className="w-[49%]">
                    <PayNow amount={billdata.amount} dueDate="Dec 31, 2025" />
                </div>
                <Button 
                    className="w-[49%] h-10 cursor-pointer" 
                    style={{backgroundColor:"gray"}}
                    onClick={handleDownloadInvoice}
                >
                    {getIcon('download')} Download Invoice
                </Button>
            </div>
        </div>
    );
}