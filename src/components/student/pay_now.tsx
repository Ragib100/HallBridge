'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
    const [mobileBankingProvider, setMobileBankingProvider] = useState<MobileBankingProvider>("bkash");

    return (
        <Dialog>
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
                                    <Select>
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
                                        placeholder="1234 5678 9012 3456" 
                                        maxLength={19}
                                        className="focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="font-medium text-gray-700">Expiry Date</p>
                                    <div className="flex gap-2">
                                        <Select>
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
                                        <Select>
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
                                    <Input className="w-[20%] focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]" id="cvv" type="password" placeholder="123" maxLength={3} />
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="font-medium text-gray-700">Cardholder Name</p>
                                    <Input id="cardName" placeholder="Name on card" className="focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]" />
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
                        <button className="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium cursor-pointer">
                            Cancel
                        </button>
                    </DialogClose>
                    <button
                        className="h-10 px-4 bg-[#2D6A4F] hover:bg-[#245a42] text-white rounded-lg transition-colors font-medium cursor-pointer"
                    >
                        Pay ৳ {amount.toFixed(2)}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}