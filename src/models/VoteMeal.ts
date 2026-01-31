import mongoose, { Schema, type InferSchemaType} from "mongoose";

const voteMealSchema = new Schema(
    {
        studentId: { type: mongoose.Types.ObjectId, required: true, ref: "User", index: true },
        rating: { type: Number, required: true, min: 0, max: 5 },
        comments: { type: String, default: "" },
    },
    { timestamps: true }
)

// Compound indexes for common query patterns
voteMealSchema.index({ studentId: 1, createdAt: -1 }); // Student's voting history
voteMealSchema.index({ createdAt: -1 }); // Recent votes
voteMealSchema.index({ rating: 1 }); // For aggregation by rating

export type VoteMealDocument = InferSchemaType<typeof voteMealSchema> & {
    _id: mongoose.Types.ObjectId;
}

const VoteMeal = mongoose.models.VoteMeal || mongoose.model("VoteMeal", voteMealSchema);

export default VoteMeal;