import express from "express"
import { isAuth } from "../middleware/auth.js";
import { getUserProfile, myProfile, updateUserProfile } from "../controllers/user.js";

const router = express.Router()

router.get("/me", isAuth, myProfile)
router.get("/user-profile/:userId", isAuth, getUserProfile)
router.put("/update-user", isAuth, updateUserProfile)

export default router;