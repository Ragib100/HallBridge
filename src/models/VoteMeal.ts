import mongoose, { Schema, type InferSchemaType} from "mongoose";

const voteMealSchema = new Schema(
    {
        studentId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
        day: { type: String, required: true },
        meal: { type: String, required: true },
        rating: { type: Number, required: true, min: 0, max: 5 },
        comments: { type: String, default: "" },
        date: { type: Date, required: true },
        mealType: { type: String, required: true, enum: ['breakfast', 'lunch', 'dinner'] },
    },
    { timestamps: true }
)

export type VoteMealDocument = InferSchemaType<typeof voteMealSchema> & {
    _id: mongoose.Types.ObjectId;
}

const VoteMeal = mongoose.models.VoteMeal || mongoose.model("VoteMeal", voteMealSchema);

export default VoteMeal;