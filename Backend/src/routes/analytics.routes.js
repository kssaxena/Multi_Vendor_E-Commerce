import express from "express";
import { getVisitorStats } from "../controllers/analytics.controllers.js";

const router = express.Router();

router.get("/visitors", getVisitorStats);

export default router;
