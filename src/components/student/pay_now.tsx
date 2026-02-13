'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface PayNowProps {
    amount: number;
    dueDate: string;
}

type PaymentMethod = "card" | "mobile";
type MobileBankingProvider = "bkash" | "nagad" | "rocket";

const mobileAccountNumbers: Record<MobileBankingProvider, string> = {
    bkash: "01790-078409",
    nagad: "01790-078409",
    rocket: "01790-078409"
};

export default function PayNow({ amount , dueDate }: PayNowProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
    const [mobileBankingProvider, setMobileBankingProvider] = useState<MobileBankingProvider>("bkash");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Form state
    const [cardType, setCardType] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryMonth, setExpiryMonth] = useState("");
    const [expiryYear, setExpiryYear] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardholderName, setCardholderName] = useState("");
    const [transactionId, setTransactionId] = useState("");

    const handlePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validate form
            if (paymentMethod === "card") {
                if (!cardType || !cardNumber || !expiryMonth || !expiryYear || !cvv || !cardholderName) {
                    setError("Please fill in all card details");
                    return;
                }
                
                // Basic validation
                if (cardNumber.replace(/\s/g, '').length < 13) {
                    setError("Invalid card number");
                    return;
                }
                
                if (cvv.length < 3) {
                    setError("Invalid CVV");
                    return;
                }
            } else if (paymentMethod === "mobile") {
                if (!transactionId || transactionId.trim().length < 5) {
                    setError("Please enter a valid transaction ID");
                    return;
                }
            }

            // Get current month and year
            const currentDate = new Date();
            const billingMonth = currentDate.getMonth() + 1;
            const billingYear = currentDate.getFullYear();

            // Prepare payment data
            const paymentData = {
                amount: amount,
                type: "hall_fee",
                paymentMethod: paymentMethod === "card" ? "card" : mobileBankingProvider,
                billingMonth,
                billingYear,
                description: paymentMethod === "card" 
                    ? `Card payment - ${cardType} ending in ${cardNumber.slice(-4)}`
                    : `Mobile banking payment - ${mobileBankingProvider.toUpperCase()} - TrxID: ${transactionId}`,
                ...(paymentMethod === "mobile" && { transactionId })
            };

            // Make API call
            const response = await fetch("/api/student/billing", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || "Payment failed");
            }

            // Success - close dialog and refresh
            setOpen(false);
            alert(`Payment successful! Payment ID: ${data.payment.paymentId}`);
            router.refresh();
            
        } catch (err) {
            console.error("Payment error:", err);
            setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="w-full h-11 bg-[#2D6A4F] hover:bg-[#245a42] text-white font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Pay Now
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">Complete Payment</DialogTitle>
                    <DialogDescription>
                        Choose your payment method and complete the transaction securely.
                    </DialogDescription>
                </DialogHeader>
                
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}
                
                <div className="space-y-6 py-4">
                    <div className="bg-[#2D6A4F]/10 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Amount</span>
                            <span className="text-2xl font-bold text-gray-900">৳ {amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Due Date</span>
                            <span className="text-sm font-medium text-red-600">{dueDate}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <p className="font-medium text-gray-700">Payment Method</p>
                            <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                                <SelectTrigger className="focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]">
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="card">Card Payment</SelectItem>
                                    <SelectItem value="mobile">Mobile Banking</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {paymentMethod === "card" && (
                            <>
                                <div className="space-y-2">
                                    <p className="font-medium text-gray-700">Card Type</p>
                                    <Select value={cardType} onValueChange={setCardType}>
                                        <SelectTrigger className="focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]">
                                            <SelectValue placeholder="Select card type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="visa">VISA</SelectItem>
                                            <SelectItem value="mastercard">Master Card</SelectItem>
                                            <SelectItem value="amex">American Express</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <p className="font-medium text-gray-700">Card Number</p>
                                    <Input 
                                        id="cardNumber"
                                        value={cardNumber}
                                        onChange={(e) => {
                                            // Format card number with spaces
                                            const value = e.target.value.replace(/\s/g, '');
                                            const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                                            setCardNumber(formatted);
                                        }}
                                        placeholder="1234 5678 9012 3456" 
                                        maxLength={19}
                                        className="focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="font-medium text-gray-700">Expiry Date</p>
                                    <div className="flex gap-2">
                                        <Select value={expiryMonth} onValueChange={setExpiryMonth}>
                                            <SelectTrigger className="focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]">
                                                <SelectValue placeholder="Month" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 12 }, (_, i) => {
                                                    const month = (i + 1).toString().padStart(2, '0');
                                                    return <SelectItem key={month} value={month}>{month}</SelectItem>
                                                })}
                                            </SelectContent>
                                        </Select>
                                        <Select value={expiryYear} onValueChange={setExpiryYear}>
                                            <SelectTrigger className="focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]">
                                                <SelectValue placeholder="Year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 15 }, (_, i) => {
                                                    const year = new Date().getFullYear() + i;
                                                    return <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="font-medium text-gray-700">CVV</p>
                                    <Input 
                                        className="w-[20%] focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]" 
                                        id="cvv"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                        type="password" 
                                        placeholder="123" 
                                        maxLength={3} 
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="font-medium text-gray-700">Cardholder Name</p>
                                    <Input 
                                        id="cardName"
                                        value={cardholderName}
                                        onChange={(e) => setCardholderName(e.target.value)}
                                        placeholder="Name on card" 
                                        className="focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]" 
                                    />
                                </div>
                            </>
                        )}

                        {paymentMethod === "mobile" && (
                            <>
                                <div className="space-y-2">
                                    <p className="font-medium text-gray-700">Mobile Banking Provider</p>
                                    <Select value={mobileBankingProvider} onValueChange={(value) => setMobileBankingProvider(value as MobileBankingProvider)}>
                                        <SelectTrigger className="focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]">
                                            <SelectValue placeholder="Select provider" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bkash">bKash</SelectItem>
                                            <SelectItem value="nagad">Nagad</SelectItem>
                                            <SelectItem value="rocket">Rocket</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="bg-[#2D6A4F]/10 p-4 rounded-lg space-y-2 border border-[#2D6A4F]/20">
                                    <p className="text-sm font-semibold text-gray-700">Send money to this account:</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-[#2D6A4F]">{mobileAccountNumbers[mobileBankingProvider]}</span>
                                        <span className="text-xs uppercase font-bold text-gray-600">{mobileBankingProvider}</span>
                                    </div>
                                    <p className="text-xs text-gray-600">Amount: ৳ {amount.toFixed(2)}</p>
                                </div>

                                <div className="space-y-2">
                                    <p className="font-medium text-gray-700">Transaction ID</p>
                                    <Input 
                                        id="trxId"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        placeholder="Enter transaction ID (e.g., ABC123XYZ456)" 
                                        maxLength={20}
                                        className="focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
                                    />
                                    <p className="text-xs text-gray-500">Enter the transaction ID you received after sending money</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <button 
                            className="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium cursor-pointer"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </DialogClose>
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="h-10 px-4 bg-[#2D6A4F] hover:bg-[#245a42] text-white rounded-lg transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Processing..." : `Pay ৳ ${amount.toFixed(2)}`}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}