import axios from "axios";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import Errorhandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";
export const createCompany = TryCatch(async (req, res, next) => {
    const user = req?.user;
    if (!user) {
        throw new Errorhandler(401, "Authentication is required");
    }
    if (user?.role !== 'recruiter') {
        throw new Errorhandler(403, "Forbidden: Only recruiter can add the company");
    }
    const { name, description, website } = req.body;
    if (!name || !description || !website) {
        throw new Errorhandler(400, "All details are required!");
    }
    const existingCompany = await sql `SELECT company_id FROM companies WHERE name = ${name}`;
    if (existingCompany?.length > 0) {
        throw new Errorhandler(409, "A company with name already exists");
    }
    const file = req?.file;
    if (!file) {
        throw new Errorhandler(400, "Company logo file is required!");
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        throw new Errorhandler(500, "Failed to create file buffer");
    }
    const { data } = await axios.post(`${process.env.UPLOAD_SERVICE}/api/utils/upload`, {
        buffer: fileBuffer?.content
    });
    const [naewCompany] = await sql `INSERT INTO companies (name,description,website,logo,logo_public_id,recruiter_id) VALUES (${name},${description},${website},${data?.url},${data?.public_id},${req?.user?.user_id}) RETURNING * `;
    res.json({ message: "Company created successfully!", naewCompany });
});
