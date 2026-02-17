"use client";

import { Textarea } from "../ui/textarea";
import Rating from "../ui/rating";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getBDTime } from '@/lib/dates';
import { useToast } from "@/components/ui/toast";

interface mealinfo {
    mealTime: 'breakfast' | 'lunch' | 'dinner';
    menuItems: string[];
    isSubmitted: boolean;
}

interface VoteForMealProps {
    mealinfo: mealinfo;
    onSubmit: (mealTime: 'breakfast' | 'lunch' | 'dinner') => void;
}

const mealIcons: Record<string, string> = {
    breakfast: '🍳',
    lunch: '🍛',
    dinner: '🍽️'
};

export default function VoteForMeal({ mealinfo, onSubmit }: VoteForMealProps) {

    const [rating, setRating] = useState<number>(0);
    const [comments, setComments] = useState<string>("");
    const { user } = useCurrentUser();
    const { toast } = useToast();
    const votingTime = [
        { mealTime: 'breakfast', start: '09:30:00' },
        { mealTime: 'lunch', start: '15:30:00' },
        { mealTime: 'dinner', start: '21:30:00' }
    ];
    const currentTime = getBDTime();


    const handleSubmitReview = async () => {
        try {
            if (!user) {
                return;
            }
            
            if(mealinfo.mealTime==='breakfast' && currentTime < votingTime[0].start) {
                toast.info('Not Yet Open', 'Voting for breakfast will open at 9:30 AM');
                return;
            }
            if(mealinfo.mealTime==='lunch' && currentTime < votingTime[1].start) {
                toast.info('Not Yet Open', 'Voting for lunch will open at 3:30 PM');
                return;
            }
            if(mealinfo.mealTime==='dinner' && currentTime < votingTime[2].start) {
                toast.info('Not Yet Open', 'Voting for dinner will open at 9:30 PM');
                return;
            }

            const url = `/api/student/meals/vote-for-meals`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mealTime: mealinfo.mealTime,
                    rating,
                    comments
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error submitting meal review:", errorData?.message || "Unknown error");
                toast.error('Submission Failed', errorData?.message || 'Failed to submit your review. Please try again.');
                return;
            }

            toast.success('Review Submitted', 'Your meal review has been submitted successfully');
            onSubmit(mealinfo.mealTime);
        }
        catch (error) {
            console.error("Error submitting meal review:", error);
            toast.error('Submission Failed', 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{mealIcons[mealinfo.mealTime]}</span>
                <h3 className="text-lg font-semibold text-gray-800">
                    {mealinfo.mealTime.charAt(0).toUpperCase() + mealinfo.mealTime.slice(1)}
                </h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-700">Menu Items</label>
                    <p className="mt-1 text-gray-600">{mealinfo.menuItems.join(', ')}</p>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">Rate this meal</label>
                    <div className="mt-2">
                        <Rating value={rating} onChange={setRating} />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">Additional comments (optional)</label>
                    <Textarea
                        placeholder="Write your comments here..."
                        className="mt-2 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        className="h-11 px-6 bg-[#2D6A4F] hover:bg-[#245a42] text-white font-medium rounded-lg transition-colors cursor-pointer"
                        onClick={handleSubmitReview}
                    >
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    );
}