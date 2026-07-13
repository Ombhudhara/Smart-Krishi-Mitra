import express from "express";
import {
  getAllCrops,
  searchCrops,
  getCropsBySeason,
  getCropById,
} from "../controller/cropController.js";

const router = express.Router();

router.get("/", getAllCrops);
router.get("/search", searchCrops);
router.get("/season/:season", getCropsBySeason);
router.get("/:id", getCropById);

export default router;
