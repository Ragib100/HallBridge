'use client';

import { useState } from "react";
import { Dialog, DialogTrigger, DialogHeader, DialogTitle, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Eye, EyeSlash } from "@boxicons/react";

export default function ChangePassword() {

    const [open, setOpen] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const passwordsMatch = newPassword === confirmPassword;

    const handleChangePassword = async () => {
        setError("");
        setSuccess("");

        if (!passwordsMatch) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setSuccess("Password changed successfully!");

            // Reset fields
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // Close dialog after 2 seconds
            setTimeout(() => {
                setOpen(false);
                setSuccess("");
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer">
                    Change Password
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">

                    {/* Current Password */}
                    <div className="relative">
                        <Input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                            {showCurrentPassword ? <EyeSlash /> : <Eye />}
                        </button>
                    </div>

                    {/* New Password */}
                    <div className="relative">
                        <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <EyeSlash /> : <Eye />}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeSlash /> : <Eye />}
                        </button>
                    </div>

                    {/* Password Match Indicator */}
                    {confirmPassword && (
                        <p className={`text-sm ${passwordsMatch ? "text-green-500" : "text-red-500"}`}>
                            {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                        </p>
                    )}

                    {/* Error Message */}
                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    {/* Success Message */}
                    {success && (
                        <p className="text-sm text-green-500">{success}</p>
                    )}

                    {/* Submit Button */}
                    <Button
                        onClick={handleChangePassword}
                        disabled={
                            !currentPassword ||
                            !newPassword ||
                            !confirmPassword ||
                            !passwordsMatch ||
                            loading
                        }
                        className="w-full h-11 bg-[#2D6A4F] hover:bg-[#245a42] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Changing...
                            </span>
                        ) : "Change Password"}
                    </Button>

                </div>
            </DialogContent>
        </Dialog>
    );
}