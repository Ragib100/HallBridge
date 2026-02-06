import mongoose, { Schema, type InferSchemaType} from "mongoose";

const mealSchema = new Schema(
    {
        studentId: { type: mongoose.Types.ObjectId, required: true, ref: "User", index: true },
        date: { type: Date, required: true, index: true },
        breakfast: { type: Boolean, default: false },
        lunch: { type: Boolean, default: false },
        dinner: { type: Boolean, default: false },
        breakfast_rating: { type: String, default: null },
        lunch_rating: { type: String, default: null },
        dinner_rating: { type: String, default: null },
    },
    { timestamps: true }
)

// Compound indexes for common query patterns
mealSchema.index({ studentId: 1, date: 1 }, { unique: true }); // Unique meal per student per day
mealSchema.index({ date: 1, breakfast: 1 }); // For counting breakfast
mealSchema.index({ date: 1, lunch: 1 }); // For counting lunch
mealSchema.index({ date: 1, dinner: 1 }); // For counting dinner

export type MealDocument = InferSchemaType<typeof mealSchema> & {
    _id: mongoose.Types.ObjectId;
}

const Meal = mongoose.models.Meal || mongoose.model("Meal", mealSchema);

export default Meal;