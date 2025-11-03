import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  title: { type: String, required: true },
  description: { type: String },
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: {
    type: String,
    enum: ["scheduled", "active", "ended"],
    default: "scheduled",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);
