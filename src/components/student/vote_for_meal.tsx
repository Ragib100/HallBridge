"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import Rating from "../ui/rating";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface mealinfo{
    mealTime: 'breakfast' | 'lunch' | 'dinner';
    menuItems: string[];
    isSubmitted: boolean;
}

export default function VoteForMeal( {mealinfo}: {mealinfo: mealinfo} ) {
    
    const [rating, setRating] = useState<number>(0);
    const [comments, setComments] = useState<string>("");
    const { user } = useCurrentUser();

    const handleSubmitReview = async () => {
        try {
            if(!user) {
                console.error("No user logged in.");
                return;
            }
            const url = `/api/student/meals/vote-for-meals?studentId=${user.id}`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    day: new Date().toISOString().split('T')[0],
                    meal: mealinfo.menuItems,
                    rating,
                    comments,
                    mealType: mealinfo.mealTime
                })
            });
        }
        catch (error) {
            console.error("Error submitting meal review:", error);
        }
    };

    return (
        <Card className="rounded-lg">
            <CardHeader>
                <CardTitle className="font-medium text-muted-foreground">Menu Items:</CardTitle>
                <CardDescription>
                    {mealinfo.mealTime.charAt(0).toUpperCase() + mealinfo.mealTime.slice(1)}: {mealinfo.menuItems.join(', ')}
                </CardDescription>
                
                <CardTitle className="font-medium text-muted-foreground mt-4">Rate this meal</CardTitle>
                <Rating value={rating} onChange={setRating} />

                <CardTitle className="font-medium text-muted-foreground mt-4">Additional comments (optional)</CardTitle>
                <Textarea placeholder="Write your comments here..." className="mt-2" value={comments} onChange={(e) => setComments(e.target.value)} />

                <CardFooter className="mt-4 flex justify-end">
                    <Button
                        className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
                        onClick={handleSubmitReview}
                    >
                        Submit Review
                    </Button>
                </CardFooter>
            </CardHeader>
        </Card>
    );
}