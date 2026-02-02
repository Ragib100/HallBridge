import mongoose, { Schema, type InferSchemaType} from "mongoose";

const mealSchema = new Schema(
    {
        studentId: { type: String, required: true, index: true },
        date: { type: Date, required: true, index: true },
        breakfast: { type: Boolean, default: false },
        lunch: { type: Boolean, default: false },
        dinner: { type: Boolean, default: false },
        isLocked: { type: Boolean, default: false },
        lockedAt: { type: Date },
        breakfast_rating: { type: String, default: null },
        lunch_rating: { type: String, default: null },
        dinner_rating: { type: String, default: null },
    },
    { timestamps: true }
)

export type MealDocument = InferSchemaType<typeof mealSchema> & {
    _id: mongoose.Types.ObjectId;
}

const Meal = mongoose.models.Meal || mongoose.model("Meal", mealSchema);

export default Meal;