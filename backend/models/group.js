import mongoose from "mongoose";
const groupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sessions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Session",
    default: [],
  },
  avatar: {
    type: String,
    required: true,
  },
  inviteCode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Group =
  mongoose.models.Group || mongoose.model("Group", groupSchema);
