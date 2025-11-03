import express from "express";
import { Group } from "../models/group.js";
import { authMiddleware } from "./../middleware.js";

const groupRouter = express.Router();

groupRouter.post("/create", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      members,
      sessions,
      avatar,
      inviteCode,
      tags,
      privacy,
    } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const newGroup = new Group({
      name,
      description,
      members: members || [],
      createdBy: req.userId,
      sessions: sessions || [],
      avatar: avatar || "",
      inviteCode: inviteCode || "",
      tags: tags || [],
      privacy: privacy || "private",
    });

    await newGroup.save();

    return res.status(201).json({
      message: "Group created successfully",
      group: {
        id: newGroup._id,
        name: newGroup.name,
        description: newGroup.description,
        members: newGroup.members,
        createdBy: newGroup.createdBy,
        sessions: newGroup.sessions,
        avatar: newGroup.avatar,
        inviteCode: newGroup.inviteCode,
        tags: newGroup.tags,
        privacy: newGroup.privacy,
        createdAt: newGroup.createdAt,
        updatedAt: newGroup.updatedAt,
      },
    });
  } catch (error) {
    console.error("Group creation failed:", error);
    return res.status(500).json({ message: "Group creation failed" });
  }
});

groupRouter.post("/:groupId/addmembers", authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userIds } = req.body;

    if (!groupId || !userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Remove duplicates before pushing
    const newMembersSet = new Set([
      ...group.members.map((id) => id.toString()),
      ...userIds,
    ]);
    group.members = Array.from(newMembersSet);

    await group.save();

    return res.status(200).json({ message: "Members added successfully" });
  } catch (error) {
    console.error("Failed to add members:", error);
    return res.status(500).json({ message: "Failed to add members" });
  }
});

groupRouter.get("/:groupId/members", authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    return res.status(200).json({ members: group.members });
  } catch (error) {
    console.error("Failed to retrieve group members:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve group members" });
  }
});

groupRouter.get("/:userId/groups", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const groups = await Group.find({ members: userId });
    return res.status(200).json({ groups });
  } catch (error) {
    console.error("Failed to retrieve user groups:", error);
    return res.status(500).json({ message: "Failed to retrieve user groups" });
  }
});

export default groupRouter;
