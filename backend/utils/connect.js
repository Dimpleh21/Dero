import mongoose from "mongoose";
export async function connectDB() {}
try {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  console.log("MongoDB connected successfully");
} catch (error) {
  console.error("MongoDB connection failed:", error);
}
