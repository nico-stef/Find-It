import express from "express";
import locationController from '../controllers/location.controller.js';
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/locationsAutocomplete",
    authMiddleware,
    locationController);

export default router;