import { TryCatch } from "../utils/TryCatch.js";
import Errorhandler from "../utils/errorHandler.js";
import { sql } from "../utils/db.js";
import bcrypt from 'bcrypt';
import getBuffer from "../utils/buffer.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import { emailTemp } from "../utils/emailTemplate.js";
import { publishToTopic } from "../producer.js";
import { redisClient } from "../index.js";
export const registerUser = TryCatch(async (req, res, next) => {
    const { name, email, password, phoneNumber, role, bio } = req.body;
    if (!name || !email || !password || !phoneNumber || !role) {
        throw new Errorhandler(400, 'Please fill all details');
    }
    const existingUsers = await sql `SELECT user_id FROM users WHERE email  = ${email}`;
    if (existingUsers.length > 0) {
        throw new Errorhandler(409, "User with this email already exists!");
    }
    const hashPassword = await bcrypt.hash(password, 5);
    let registeredUser;
    if (role === 'recruiter') {
        const [user] = await sql `INSERT INTO users(name,email,password,phone_number,role) VALUES 
        (${name},${email},${hashPassword},${phoneNumber},${role}) RETURNING user_id , name , email , phone_number,role,created_at`;
        registeredUser = user;
        const token = jwt.sign({ id: user?.user_id }, process.env.JWT_SECRET, {
            expiresIn: "15d"
        });
        res.json({
            message: "Recruiter created successfully!",
            user,
            token
        });
    }
    else if (role === 'jobseeker') {
        const file = req.file;
        if (!file) {
            throw new Errorhandler(400, "Resume file is required for job seekers");
        }
        const fileBuffer = getBuffer(file);
        if (!fileBuffer || !fileBuffer.content) {
            throw new Errorhandler(500, "Failed to generate buffer");
        }
        const { data } = await axios.post(`${process.env.UPLOAD_SERVICE}/api/utils/upload`, { buffer: fileBuffer.content });
        const [user] = await sql `INSERT INTO users(name,email,password,phone_number,role,bio,resume,resume_public_id) VALUES 
        (${name},${email},${hashPassword},${phoneNumber},${role},${bio},${data?.url},${data?.public_id}) RETURNING user_id , name , email , phone_number,role,bio,resume,created_at`;
        const token = jwt.sign({ id: user?.user_id }, process.env.JWT_SECRET, {
            expiresIn: "15d"
        });
        res.json({
            message: "User created successfully!",
            user,
            token
        });
    }
});
export const loginUser = TryCatch(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new Errorhandler(400, "Please fill all details");
    }
    const user = await sql `
    SELECT u.user_id,u.name,u.email,u.password,u.phone_number,u.role,u.bio,u.resume,u.profile_pic,u.subscription, ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) as skills FROM users u LEFT JOIN user_skills us ON u.user_id = us.user_id LEFT JOIN skills s ON us.skill_id = s.skill_id WHERE u.email = ${email} GROUP BY u.user_id;
    `;
    if (user.length === 0) {
        throw new Errorhandler(400, "Invalid Credentials");
    }
    const userObject = user[0];
    const matchPassword = await bcrypt.compare(password, userObject?.password);
    if (!matchPassword) {
        throw new Errorhandler(400, "Invalid Password");
    }
    userObject.skills = userObject.skills || [];
    delete userObject?.password;
    const token = jwt.sign({ id: userObject?.user_id }, process.env.JWT_SECRET, {
        expiresIn: "15d"
    });
    res.json({
        message: "User Logged In!",
        userObject,
        token
    });
});
export const forgotPassword = TryCatch(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        throw new Errorhandler(400, "Please provide email!");
    }
    const users = await sql `SELECT user_id , email FROM users WHERE email = ${email}`;
    if (users?.length === 0) {
        return res.json({
            message: "If that email exists , we have sent a reset link"
        });
    }
    const user = users[0];
    const resetToken = jwt.sign({
        email: user?.email,
        type: "reset",
    }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${process.env.Frontend_Url}/reset/${resetToken}`;
    await redisClient.set(`forgot:${email}`, resetToken, {
        EX: 900
    });
    const message = {
        to: email,
        subject: "Reset Your Password - HireHeaven",
        html: emailTemp(resetLink)
    };
    publishToTopic("send-mail", message);
    res.json({
        message: "If that email exists , reset link is sent!"
    });
});
export const resetPassword = TryCatch(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (error) {
        console.log(error);
        throw new Errorhandler(400, "Expired Token");
    }
    if (decoded.type !== "reset") {
        throw new Errorhandler(400, "Invalid token type");
    }
    const email = decoded.email;
    const storedToken = await redisClient.get(`forgot:${email}`);
    if (!storedToken || storedToken !== token) {
        throw new Errorhandler(400, 'Token has been expired!');
    }
    const users = await sql `SELECT user_id FROM users WHERE email = ${email}`;
    if (users.length === 0) {
        throw new Errorhandler(404, "User Not Found!");
    }
    const user = users[0];
    const hashedPassword = await bcrypt.hash(password, 10);
    await sql `UPDATE users SET password = ${hashedPassword} WHERE user_id = ${user?.user_id}`;
    await redisClient.del(`forgot:${email}`);
    res.json({ message: "Password changed successfully!" });
});
