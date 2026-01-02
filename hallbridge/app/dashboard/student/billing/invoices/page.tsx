'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/components/common/icons";
import StudentInvoice from "@/components/student/invoice";
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

export default function InvoicesPage() {

    const [invoices, setInvoices] = useState<Invoice[]>([
        { month: 'December 2025', invoice_id: 'INV-2025-12', billinfo: { seatrent: 200, messbill: 150, othercharges: 100 }, amount: 450 },
        { month: 'November 2025', invoice_id: 'INV-2025-11', billinfo: { seatrent: 200, messbill: 150, othercharges: 70 }, amount: 420, media: 'Card' },
        { month: 'October 2025', invoice_id: 'INV-2025-10', billinfo: { seatrent: 200, messbill: 10, othercharges: 0 }, amount: 210, media: 'Card' },
        { month: 'September 2025', invoice_id: 'INV-2025-09', billinfo: { seatrent: 200, messbill: 100, othercharges: 20 }, amount: 320, media: 'Card' },
        { month: 'August 2025', invoice_id: 'INV-2025-08', billinfo: { seatrent: 200, messbill: 150, othercharges: 50 }, amount: 400, media: 'Card' },
        { month: 'July 2025', invoice_id: 'INV-2025-07', billinfo: { seatrent: 200, messbill: 150, othercharges: 30 }, amount: 380, media: 'Card' },
    ]);

    const handleDownloadInvoice = (invoice: Invoice) => {
        // Calculate due date based on invoice month
        const monthYear = invoice.month.split(' ');
        const month = monthYear[0];
        const year = monthYear[1];
        const lastDay = new Date(parseInt(year), new Date(`${month} 1`).getMonth() + 1, 0).getDate();
        const dueDate = `${month.slice(0, 3)} ${lastDay}, ${year}`;
        
        generateInvoicePDF(
            invoice,
            dueDate,
            {
                name: "Student Name", // Replace with actual student data
                studentId: "2021-123456",
                hallName: "Hall Name",
                roomNo: "101"
            }
        );
    };

    return (
        <div className="px-2 md:px-4 py-6 max-w-full overflow-x-hidden">
            <div className="mb-8">
                <span className="text-lg font-bold">{getIcon('invoices')} Invoices</span>
            </div>

            <div className="px-2 md:px-4">
                {invoices.map(({ month, invoice_id, amount }, idx) => (
                    <div key={invoice_id} className="py-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                            <p>{getIcon('invoices')} {month}</p>
                            <div className="flex gap-2 md:gap-3 flex-wrap">
                                
                                <StudentInvoice invoiceinfo={invoices[idx]} />

                                <Button
                                    className="cursor-pointer"
                                    style={{ backgroundColor: "gray" }}
                                    onClick={() => handleDownloadInvoice(invoices[idx])}
                                >
                                    {getIcon('download')} Download
                                </Button>
                            </div>
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                            Amount: ${idx === 0 ? `${amount} (Pending)` : `${amount} (Paid)`}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}