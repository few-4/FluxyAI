import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

// Bhavishya: keep the auth endpoint/schema document updated for every route below.
// Rahul registration API start here:
// Add this route after authController.register and authService.register are ready.
// router.post("/register", authController.register);
// Dinesh start here: add POST /login before refresh-token; login should save the refreshToken cookie.
router.post("/refresh-token", authController.refreshToken);
// Kaif: POST /refresh-token is implemented above.
// Bhavishya start here: add POST /logout after refresh-token; logout should clear DB token and cookie.

export default router;
