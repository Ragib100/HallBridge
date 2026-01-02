"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export type RatingProps = {
    value?: number
    max?: number
    size?: number
    readOnly?: boolean
    onChange?: (value: number) => void
}

export default function Rating({
    value = 0,
    max = 5,
    size = 20,
    readOnly = false,
    onChange,
}: RatingProps) {

    const [rating_status, setRatingStatus] = useState<boolean[]>(() => {
        const initial = Array(max).fill(false);
        for (let i = 0; i < value; i++) {
            initial[i] = true;
        }
        return initial;
    });

    return (
        <div className="flex gap-1">
            {Array.from({ length: max }).map((_, i) => {

                return (
                    <Star
                        key={i}
                        size={size}
                        fill={rating_status[i] ? "black" : "none"}
                        className={cn(
                            "transition-colors",
                            readOnly ? "cursor-default" : "cursor-pointer",
                            rating_status[i]
                                ? "text-black"
                                : "text-muted-foreground"
                        )}
                        onClick={() => {
                            if (!readOnly) {
                                const newRatingStatus = Array(max).fill(false);
                                for(let j = 0; j <= i; j++) {
                                    newRatingStatus[j] = true;
                                }
                                setRatingStatus(newRatingStatus);
                                // console.log(i+1, newRatingStatus);
                                if (onChange) {
                                    onChange(i + 1);
                                }
                            }
                        }}
                    />
                )
            })}
        </div>
    )
}