import axios from "axios";
import { AuthenticatedRequest } from "../middleware/auth.js";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import Errorhandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    res.json(user)
})

export const getUserProfile = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const { userId } = req.params;
    const users = await sql`
        SELECT u.user_id , u.name , u.email , u.phone_number , u.role , u.resume , u.bio , u.resume_public_id , u.profile_pic , u.profile_pic_public_id , u.subscription , 
        ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) AS skills 
        FROM users u LEFT JOIN user_skills us ON u.user_id = us.user_id LEFT JOIN skills s ON us.skill_id = s.skill_id WHERE u.user_id = ${userId} GROUP BY u.user_id;
        `;
    if (users?.length === 0) {
        throw new Errorhandler(404, "User not found!")
    }
    const user = users[0];
    user.skills = user.skills || [];

    res.json(user)
})

export const updateUserProfile = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req?.user;
    if (!user) {
        throw new Errorhandler(401, "Authentication required")
    }
    const { name, phoneNumber, bio } = req.body
    const newName = name || user.name;
    const newPhoneNumber = phoneNumber || user?.phone_number;
    const newBio = bio || user?.bio;

    const [updatedUser] = await sql`UPDATE users SET name=${newName},phone_number=${newPhoneNumber},bio=${newBio} WHERE user_id = ${user?.user_id} RETURNING user_id , name , email , phone_number , bio`;

    res.json({
        message: "Profile Updated Successfully!",
        updatedUser
    })
})

export const updateProfilePic = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req?.user;

    if (!user) {
        throw new Errorhandler(401, "Authentication required")
    }
    const file = req.file;

    if (!file) {
        console.log("Error is here")
        throw new Errorhandler(403, "No Image file provided")
    }
    const oldPublicId = user?.profile_pic_public_id;

    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer?.content) {
        throw new Errorhandler(500, "Failed to generate buffer")
    }

    const { data: uploadedRes } = await axios.post(`${process.env.UPLOAD_SERVICE}/api/utils/upload`, { buffer: fileBuffer.content, public_id: oldPublicId })
    //@ts-expect-error dynamic errors
    const [updatedUser] = await sql`UPDATE users SET profile_pic=${uploadedRes?.url},profile_pic_public_id=${uploadedRes?.public_id} WHERE user_id=${user?.user_id} RETURNING user_id,name,profile_pic
`
    res.json({ message: "Profile Pic Updated!", updatedUser })
})
export const updateResume = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req?.user;

    if (!user) {
        throw new Errorhandler(401, "Authentication required")
    }
    const file = req.file;

    if (!file) {

        throw new Errorhandler(403, "No pdf file provided")
    }
    const oldPublicId = user?.resume_public_id;

    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer?.content) {
        throw new Errorhandler(500, "Failed to generate buffer")
    }

    const { data: uploadedRes } = await axios.post(`${process.env.UPLOAD_SERVICE}/api/utils/upload`, { buffer: fileBuffer.content, public_id: oldPublicId })
    //@ts-expect-error dynamic errors
    const [updatedUser] = await sql`UPDATE users SET resume=${uploadedRes?.url},resume_public_id=${uploadedRes?.public_id} WHERE user_id=${user?.user_id} RETURNING user_id,name,resume
`
    res.json({ message: "Resume Updated!", updatedUser })
})
export const addUserSkill = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const userId = req?.user?.user_id;
})