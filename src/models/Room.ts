import mongoose, { Schema, type InferSchemaType } from "mongoose";

export type RoomStatus = "occupied" | "vacant" | "partial" | "maintenance";

const bedSchema = new Schema(
  {
    bedNumber: { type: Number, required: true }, // 1, 2, 3, 4
    studentId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    isOccupied: { type: Boolean, default: false },
  },
  { _id: false }
);

const roomSchema = new Schema(
  {
    floor: { type: Number, required: true, min: 1, max: 8 },
    roomNumber: { type: String, required: true }, // e.g., "101", "802"
    displayNumber: { type: String, required: true }, // Full display like "101" or "F1-R01"
    capacity: { type: Number, required: true, default: 4 },
    beds: [bedSchema],
    status: {
      type: String,
      enum: ["occupied", "vacant", "partial", "maintenance"],
      default: "vacant",
    },
    amenities: {
      type: [String],
      default: [],
      enum: ["AC", "Fan", "Attached Bath", "Common Bath", "Balcony", "WiFi"],
    },
    hallId: { type: String, default: null }, // Optional hall identifier
  },
  { timestamps: true }
);

// Compound unique index for floor + roomNumber
roomSchema.index({ floor: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ status: 1 });
roomSchema.index({ floor: 1, status: 1 });

// Virtual to calculate available beds
roomSchema.virtual("availableBeds").get(function () {
  return this.beds.filter((bed) => !bed.isOccupied).length;
});

// Virtual to calculate occupied beds
roomSchema.virtual("occupiedBeds").get(function () {
  return this.beds.filter((bed) => bed.isOccupied).length;
});

// Method to update room status based on bed occupancy
roomSchema.methods.updateStatus = function () {
  const occupied = this.beds.filter((bed: { isOccupied: boolean }) => bed.isOccupied).length;
  const total = this.beds.length;

  if (this.status === "maintenance") {
    return; // Don't change if under maintenance
  }

  if (occupied === 0) {
    this.status = "vacant";
  } else if (occupied === total) {
    this.status = "occupied";
  } else {
    this.status = "partial";
  }
};

// Static method to get room statistics
roomSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalRooms: { $sum: 1 },
        occupied: { $sum: { $cond: [{ $eq: ["$status", "occupied"] }, 1, 0] } },
        partial: { $sum: { $cond: [{ $eq: ["$status", "partial"] }, 1, 0] } },
        vacant: { $sum: { $cond: [{ $eq: ["$status", "vacant"] }, 1, 0] } },
        maintenance: { $sum: { $cond: [{ $eq: ["$status", "maintenance"] }, 1, 0] } },
        totalBeds: { $sum: { $size: "$beds" } },
        occupiedBeds: {
          $sum: {
            $size: {
              $filter: {
                input: "$beds",
                cond: { $eq: ["$$this.isOccupied", true] },
              },
            },
          },
        },
      },
    },
  ]);

  return stats[0] || {
    totalRooms: 0,
    occupied: 0,
    partial: 0,
    vacant: 0,
    maintenance: 0,
    totalBeds: 0,
    occupiedBeds: 0,
  };
};

export type RoomDocument = InferSchemaType<typeof roomSchema> & {
  _id: mongoose.Types.ObjectId;
  availableBeds: number;
  occupiedBeds: number;
  updateStatus: () => void;
};

const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);

export default Room;
