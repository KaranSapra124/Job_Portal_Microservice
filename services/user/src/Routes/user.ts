import express from "express"
import { isAuth } from "../middleware/auth.js";
import { getUserProfile, myProfile, updateProfilePic, updateResume, updateUserProfile } from "../controllers/user.js";
import uploadFile from "../middleware/multer.js";

const router = express.Router()

router.get("/me", isAuth, myProfile)
router.get("/user-profile/:userId", isAuth, getUserProfile)
router.put("/update-user", isAuth, updateUserProfile)
router.put("/update-profile-pic", isAuth, uploadFile, updateProfilePic)
router.put("/update-user-resume", isAuth, uploadFile, updateResume)

export default router;