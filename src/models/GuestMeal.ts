import mongoose, { Schema, type InferSchemaType} from "mongoose";

const mealSchema = new Schema(
    {
        studentId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
        name: { type: String, required: true },
        id: { type: String, required: true },
        department: { type: String, required: true },
        phone: { type: String, required: true },
        breakfast: { type: Boolean, default: false },
        lunch: { type: Boolean, default: false },
        dinner: { type: Boolean, default: false },
    },
    { timestamps: true }
)

export type GuestMealDocument = InferSchemaType<typeof mealSchema> & {
    _id: mongoose.Types.ObjectId;
}

const GuestMeal = mongoose.models.GuestMeal || mongoose.model("GuestMeal", mealSchema);

export default GuestMeal;