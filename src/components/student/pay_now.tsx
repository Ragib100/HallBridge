'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getIcon } from "../common/icons";

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
                <Button className="w-full bg-blue-500 hover:bg-blue-600 border border-blue-700 cursor-pointer">
                    Pay Now
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Complete Payment</DialogTitle>
                    <DialogDescription>
                        Choose your payment method and complete the transaction securely.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Amount</span>
                            <span className="text-2xl font-bold text-gray-900">{getIcon('taka')} {amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Due Date</span>
                            <span className="text-sm font-medium text-red-600">{dueDate}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <p className="font-bold">Payment Method</p>
                            <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                                <SelectTrigger>
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
                                    <p className="font-bold">Card Type</p>
                                    <Select>
                                        <SelectTrigger>
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
                                    <p className="font-bold">Card Number</p>
                                    <Input 
                                        id="cardNumber" 
                                        placeholder="1234 5678 9012 3456" 
                                        maxLength={19}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="font-bold">Expiry Date</p>
                                    <div className="flex gap-2">
                                        <Select>
                                            <SelectTrigger>
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
                                            <SelectTrigger>
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
                                    <p className="font-bold">CVV</p>
                                    <Input className="w-[20%]" id="cvv" type="password" placeholder="123" maxLength={3} />
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="font-bold">Cardholder Name</p>
                                    <Input id="cardName" placeholder="Name on card" />
                                </div>
                            </>
                        )}

                        {paymentMethod === "mobile" && (
                            <>
                                <div className="space-y-2">
                                    <p className="font-bold">Mobile Banking Provider</p>
                                    <Select value={mobileBankingProvider} onValueChange={(value) => setMobileBankingProvider(value as MobileBankingProvider)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select provider" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bkash">bKash</SelectItem>
                                            <SelectItem value="nagad">Nagad</SelectItem>
                                            <SelectItem value="rocket">Rocket</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg space-y-2 border border-blue-200">
                                    <p className="text-sm font-semibold text-gray-700">Send money to this account:</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-blue-700">{mobileAccountNumbers[mobileBankingProvider]}</span>
                                        <span className="text-xs uppercase font-bold text-gray-600">{mobileBankingProvider}</span>
                                    </div>
                                    <p className="text-xs text-gray-600">Amount: {getIcon('taka')} {amount.toFixed(2)}</p>
                                </div>

                                <div className="space-y-2">
                                    <p className="font-bold">Transaction ID</p>
                                    <Input 
                                        id="trxId" 
                                        placeholder="Enter transaction ID (e.g., ABC123XYZ456)" 
                                        maxLength={20}
                                    />
                                    <p className="text-xs text-gray-500">Enter the transaction ID you received after sending money</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button className="cursor-pointer bg-red-500 hover:bg-red-600 border border-red-700 text-white font-bold">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        className="bg-green-500 hover:bg-green-600 border border-green-700 cursor-pointer font-bold"
                    >
                        Pay {getIcon('taka')} {amount.toFixed(2)}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}