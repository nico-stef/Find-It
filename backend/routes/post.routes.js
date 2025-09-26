import express from "express";
import multer from "multer";
import PostController from "../controllers/post.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Configurare Multer direct aici
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/post", authMiddleware, upload.array('images', 12), PostController.post);

export default router;