import express from "express";
import multer from "multer";
import PostController from "../controllers/post.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Configurare Multer direct aici
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/post", authMiddleware, upload.array('images', 12), PostController.post);
router.get("/posts/me", authMiddleware, PostController.getByUser);
router.get("/posts", authMiddleware, PostController.getByFilters);
router.get("/post/:id", authMiddleware, PostController.getPost);
router.post("/post/:id/comment", authMiddleware, PostController.postComment);
router.delete("/post/:postId/comment/:commentId", authMiddleware, PostController.deleteComment);

export default router;