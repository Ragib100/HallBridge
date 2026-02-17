'use client';

import { Textarea } from "../ui/textarea";
import Rating from "../ui/rating";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/components/ui/toast";

interface MaintenanceRatingProps {
    requestId: string;
    onSuccess?: () => void;
}

export default function MaintenanceRating({ requestId, onSuccess }: MaintenanceRatingProps) {

    const [rating, setRating] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);
    const { user } = useCurrentUser();
    const { toast } = useToast();

    const handleSubmitReview = async () => {
        try {
            if (!user) {
                return;
            }

            if (rating === 0) {
                toast.warning('Rating Required', 'Please provide a rating before submitting.');
                return;
            }

            setSubmitting(true);

            const response = await fetch(`/api/common/maintenance/rating?requestId=${requestId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rating, feedback }),
            });
            if (!response.ok) {
                toast.error('Submission Failed', 'There was an error submitting your review. Please try again later.');
                return;
            }
            
            // Success - trigger callback to refresh parent and close dialog
            if (onSuccess) {
                onSuccess();
            }
            
        }
        catch (error) {
            toast.error('Submission Failed', 'There was an error submitting your review. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium text-gray-700">Rate this service</label>
                <div className="mt-2">
                    <Rating value={rating} onChange={setRating} />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700">Additional comments (optional)</label>
                <Textarea
                    placeholder="Write your comments here..."
                    className="mt-2 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />
            </div>

            <div className="flex justify-end pt-2">
                <button
                    className="h-11 px-6 bg-[#2D6A4F] hover:bg-[#245a42] text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubmitReview}
                    disabled={submitting}
                >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </div>
        </div>
    );
}