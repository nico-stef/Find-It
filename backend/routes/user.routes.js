import express from "express";
import UserController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/checkIfAuth",
    authMiddleware,
    UserController.checkIfAuth);

export default router;