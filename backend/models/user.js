import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  groupIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Group",
    default: [],
  },
  sessionIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Session",
    default: [],
  },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
