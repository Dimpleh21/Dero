import express from "express";
import userRouter from "./user.js";
import groupRouter from "./group.js";
const router = express.Router();
// router.use("/session", sessionRouter);
router.use("/user", userRouter);
router.use("/group", groupRouter);

export default router;
