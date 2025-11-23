import { Request, Response } from "express";
import { TryCatch } from "../utils/TryCatch.js";
import Errorhandler from "../utils/errorHandler.js";
import { sql } from "../utils/db.js";
import bcrypt from 'bcrypt'
import getBuffer from "../utils/buffer.js";
import axios from "axios";

export const registerUser = TryCatch(async (req, res, next) => {
    const { name, email, password, phoneNumber, role, bio } = req.body;
    if (!name || !email || !password || !phoneNumber || !role || !bio) {
        throw new Errorhandler(400, 'Please fill all details');
    }
    const existingUsers = await sql`SELECT user_id FROM users WHERE email  = ${email}`;

    if (existingUsers.length > 0) {
        throw new Errorhandler(409, "User with this email already exists!")
    }

    const hashPassword = await bcrypt.hash(password, 5);

    let registeredUser;

    if (role === 'recruiter') {
        const [user] = await sql`INSERT INTO users(name,email,password,phone_number,role) VALUES 
        (${name},${email},${hashPassword},${phoneNumber},${role}) RETURNING user_id , name , email , phone_number,role,created_at`;

        registeredUser = user;
    } else if (role === 'jobseeker') {
        const file = req.file
        if (!file) {
            throw new Errorhandler(400, "Resume file is required for job seekers")
        }
        const fileBuffer = getBuffer(file);
        if (!fileBuffer || !fileBuffer.content) {
            throw new Errorhandler(500, "Failed to generate buffer")
        }
        const { data } = await axios.post(`${process.env.UPLOAD_SERVICE}/api/utils/upload`, { buffer: fileBuffer.content })

        const [user] = await sql`INSERT INTO users(name,email,password,phone_number,role,bio,resume,resume_public_id) VALUES 
        (${name},${email},${hashPassword},${phoneNumber},${role},${bio},${data?.url},${data?.public_id}) RETURNING user_id , name , email , phone_number,role,bio,resume,created_at`;

        res.json({
            message: "User created successfully!",
            user
        })
    }


})