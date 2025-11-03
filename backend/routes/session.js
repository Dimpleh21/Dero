import express from "express";
import { Session } from "../models/session.js";
import { authMiddleware } from "../middlewares/auth.js";

const sessionRouter = express.Router();
let sessionId = "";

function createSessionId() {
  sessionId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}
sessionRouter.post("/create", authMiddleware, async (req, res) => {
  try {
    createSessionId();
    const newSession = new Session({
      groupId,
      title,
      description,
      scheduledAt,
      durationMinutes,
      createdBy: req.userId,
      participants: [req.userId],
      status: "scheduled",
    });

    await newSession.save();

    res.status(201).json({
      message: "Session created",
      session: newSession,
      sessionId: sessionId,
    });
  } catch (error) {
    console.error("Session creation failed:", error);
    res.status(500).json({ message: "Session creation failed" });
  }
});

sessionRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const sessions = await Session.find({ participants: userId }).populate(
      "groupId",
      "name"
    );
    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Failed to retrieve sessions:", error);
    res.status(500).json({ message: "Failed to retrieve sessions" });
  }
});

sessionRouter.get("/:sessionId", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId)
      .populate("groupId", "name description")
      .populate("participants", "name email");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ session });
  } catch (error) {
    console.error("Failed to retrieve session:", error);
    res.status(500).json({ message: "Failed to retrieve session" });
  }
});
sessionRouter.put("/:sessionId", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const updateData = req.body;

    const session = await Session.findByIdAndUpdate(sessionId, updateData, {
      new: true,
    });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ message: "Session updated", session });
  } catch (error) {
    console.error("Failed to update session:", error);
    res.status(500).json({ message: "Failed to update session" });
  }
});
sessionRouter.delete("/:sessionId", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findByIdAndDelete(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ message: "Session deleted" });
  } catch (error) {
    console.error("Failed to delete session:", error);
    res.status(500).json({ message: "Failed to delete session" });
  }
});

export default sessionRouter;
