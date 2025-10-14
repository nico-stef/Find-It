import express from "express";
import UserController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import multer from "multer";

const router = express.Router();

// Configurare Multer direct aici
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/checkIfAuth", authMiddleware, UserController.checkIfAuth);
router.get("/profile", authMiddleware, UserController.getUserInfo);
router.get("/user", authMiddleware, UserController.getOtherUserInfo);
router.patch("/profile", authMiddleware, upload.single('image'), UserController.updateUserInfo);
router.delete("/profile", authMiddleware, UserController.deleteUser);
router.get("/me", authMiddleware, UserController.getUserId);

export default router;