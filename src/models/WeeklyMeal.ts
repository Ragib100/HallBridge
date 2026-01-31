import mongoose, { Schema, type InferSchemaType } from "mongoose";

const DAYS_OF_WEEK = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

const weeklyMealSchema = new Schema(
    {
        day: { 
            type: String, 
            required: true,
            enum: DAYS_OF_WEEK,
            unique: true, // Only one entry per day
            index: true,
        },
        breakfast: { type: String, required: true },
        lunch: { type: String, required: true },
        dinner: { type: String, required: true },
    },
    { timestamps: true }
)

export type WeeklyMealDocument = InferSchemaType<typeof weeklyMealSchema> & {
    _id: mongoose.Types.ObjectId;
}

const WeeklyMeal = mongoose.models.WeeklyMeal || mongoose.model("WeeklyMeal", weeklyMealSchema);

export default WeeklyMeal;