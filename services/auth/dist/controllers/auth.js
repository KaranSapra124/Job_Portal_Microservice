import { TryCatch } from "../utils/TryCatch.js";
import Errorhandler from "../utils/errorHandler.js";
import { sql } from "../utils/db.js";
import bcrypt from 'bcrypt';
export const registerUser = TryCatch(async (req, res, next) => {
    const { name, email, password, phoneNumber, role, bio } = req.body;
    if (!name || !email || !password || !phoneNumber || !role || !bio) {
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
    }
    else if (role === 'jobseeker') {
        const file = req.file;
        const [user] = await sql `INSERT INTO users(name,email,password,phone_number,role) VALUES 
        (${name},${email},${hashPassword},${phoneNumber},${role}) RETURNING user_id , name , email , phone_number,role,created_at`;
    }
});
