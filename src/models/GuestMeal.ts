import mongoose, { Schema, type InferSchemaType} from "mongoose";

const mealSchema = new Schema(
    {
        studentId: { type: mongoose.Types.ObjectId, required: true, ref: "User", index: true },
        name: { type: String, required: true },
        id: { type: String, required: true },
        department: { type: String, required: true },
        phone: { type: String, required: true },
        date: { type: Date, required: true, index: true },
        breakfast: { type: Boolean, default: false },
        lunch: { type: Boolean, default: false },
        dinner: { type: Boolean, default: false },
    },
    { timestamps: true }
)

// Compound indexes for common query patterns
mealSchema.index({ studentId: 1, date: 1 }); // Student's guest meals by date
mealSchema.index({ date: 1, breakfast: 1 }); // Count guests by meal type
mealSchema.index({ date: 1, lunch: 1 });
mealSchema.index({ date: 1, dinner: 1 });

export type GuestMealDocument = InferSchemaType<typeof mealSchema> & {
    _id: mongoose.Types.ObjectId;
}

const GuestMeal = mongoose.models.GuestMeal || mongoose.model("GuestMeal", mealSchema);

export default GuestMeal;