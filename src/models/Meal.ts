import mongoose, { Schema, type InferSchemaType} from "mongoose";

const mealSchema = new Schema(
    {
        studentId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
        date: { type: Date, required: true },
        breakfast: { type: Boolean, default: false },
        lunch: { type: Boolean, default: false },
        dinner: { type: Boolean, default: false },
        isLocked: { type: Boolean, default: false },
        lockedAt: { type: Date } 
    },
    { timestamps: true }
)

export type MealDocument = InferSchemaType<typeof mealSchema> & {
    _id: mongoose.Types.ObjectId;
}

const Meal = mongoose.models.Meal || mongoose.model("Meal", mealSchema);

export default Meal;