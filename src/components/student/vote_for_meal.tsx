"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import Rating from "../ui/rating";
import { useState } from "react";

interface mealinfo{
    mealTime: 'breakfast' | 'lunch' | 'dinner';
    menuItems: string[];
    isSubmitted: boolean;
}

export default function VoteForMeal( {mealinfo}: {mealinfo: mealinfo} ) {
    return (
        <Card className="rounded-lg">
            <CardHeader>
                <CardTitle className="font-medium text-muted-foreground">Menu Items:</CardTitle>
                <CardDescription>
                    {mealinfo.mealTime.charAt(0).toUpperCase() + mealinfo.mealTime.slice(1)}: {mealinfo.menuItems.join(', ')}
                </CardDescription>
                
                <CardTitle className="font-medium text-muted-foreground mt-4">Rate this meal</CardTitle>
                <Rating/>

                <CardTitle className="font-medium text-muted-foreground mt-4">Additional comments (optional)</CardTitle>
                <Textarea placeholder="Write your comments here..." className="mt-2"/>

                <CardFooter className="mt-4 flex justify-end">
                    <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer">Submit Review</Button>
                </CardFooter>
            </CardHeader>
        </Card>
    );
}