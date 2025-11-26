import axios from "axios";
import { AuthenticatedRequest } from "../middleware/auth.js";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import Errorhandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";

export const createCompany = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req?.user;
    if (!user) {
        throw new Errorhandler(401, "Authentication is required")
    }
    if (user?.role !== 'recruiter') {
        throw new Errorhandler(403, "Forbidden: Only recruiter can add the company")
    }
    const { name, description, website } = req.body

    if (!name || !description || !website) {
        throw new Errorhandler(400, "All details are required!")
    }

    const existingCompany = await sql`SELECT company_id FROM companies WHERE name = ${name}`;
    if (existingCompany?.length > 0) {
        throw new Errorhandler(409, "A company with name already exists")
    }

    const file = req?.file;

    if (!file) {
        throw new Errorhandler(400, "Company logo file is required!")
    }
    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
        throw new Errorhandler(500, "Failed to create file buffer")
    }

    const { data } = await axios.post(`${process.env.UPLOAD_SERVICE}/api/utils/upload`, {
        buffer: fileBuffer?.content
    });
    const [naewCompany] = await sql`INSERT INTO companies (name,description,website,logo,logo_public_id,recruiter_id) VALUES (${name},${description},${website},${data?.url},${data?.public_id},${req?.user?.user_id}) RETURNING * `

    res.json({ message: "Company created successfully!", naewCompany })

})

export const deleteCompany = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    const { companyId } = req.params;
    const [company] = await sql`SELECT logo_public_id FROM companies WHERE company_id=${companyId} AND recruiter_id = ${user?.user_id}`;


    if (!company) {
        throw new Errorhandler(404, "Company not found or you are not authorized to delete it!")
    }
    await sql`DELETE FROM companies WHERE company_id = ${companyId}`;
    res.json({
        message: "Company and all associated jobs have been deleted"
    })
})

export const createJob = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req?.user;
    if (!user) {
        throw new Errorhandler(401, "Authentication is required")
    }
    if (user?.role !== 'recruiter') {
        throw new Errorhandler(403, "Forbidden: Only recruiter can add the company")
    }
    const { title, description, salary, location, role, job_type, work_location, company_id, openings } = req.body;

    if (!title || !description || !salary || !location || !role || !job_type || !work_location || !company_id) {
        throw new Errorhandler(400, "All fields are required!")
    }

    const [company] = await sql`SELECT company_id FROM companies WHERE company_id = ${company_id} AND recruiter_id = ${user?.user_id}`;
    if (!company) {
        throw new Errorhandler(404, "Company not found!")
    }
    const [newJob] = await sql`INSERT INTO jobs (title,description,salary,location,role,job_type,work_location,company_id,posted_by_recruiter_id,openings) VALUES
     (${title},${description},${salary},${location},${role},${job_type},${work_location},${company_id},${user?.user_id},${openings}) RETURNING *`
    res.json({ message: "Job posted successfully!", newJob });
})

export const updateJob = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req?.user;
    const { jobId } = req?.params
    if (!user) {
        throw new Errorhandler(401, "Authentication is required")
    }
    if (user?.role !== 'recruiter') {
        throw new Errorhandler(403, "Forbidden: Only recruiter can add the company")
    }
    const { title, description, salary, location, role, job_type, work_location, company_id, openings, is_active } = req.body;

    if (!title || !description || !salary || !location || !role || !job_type || !work_location || !company_id || !is_active) {
        throw new Errorhandler(400, "All fields are required!")
    }

    const [existingJob] = await sql`SELECT posted_by_recruiter_id FROM jobs WHERE job_id = ${jobId}`;
    if (!existingJob) {
        throw new Errorhandler(404, "Job not found!")
    }
    if (existingJob.posted_by_recruiter_id !== user?.user_id) {
        throw new Errorhandler(403, "Forbidden: You are not allowed!")
    }
    const [updatedJob] = await sql`UPDATE jobs SET title = ${title},description=${description},salary=${salary},role=${role},location=${location},work_location=${work_location},job_type=${job_type},openings=${openings},company_id=${company_id},posted_by_recruiter_id=${user?.user_id},is_active=${is_active} WHERE job_id=${jobId} RETURNING *`
    res.json({ message: "Job updated successfully!", updatedJob });
})

export const getAllCompanies = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req?.user;
    if (!user) {
        throw new Errorhandler(401, "Authentication is required")
    }
    if (user?.role !== 'recruiter') {
        throw new Errorhandler(403, "Forbidden: Only recruiter can add the company")
    }
    const [companies] = await sql`SELECT * FROM companies WHERE recruiter_id = ${user?.user_id}`;
    res.json({ message: "Companies fetched successfully!", companies })
})

export const getCompanyDetails = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const { companyId } = req?.params;
    const user = req?.user

    if (!companyId) {
        throw new Errorhandler(400, "Company Id Is Required!")
    }
    console.log(companyId)
    const [companyDetail] = await sql`SELECT c.*, COALESCE (
    (
    SELECT json_agg(j.*) FROM jobs j WHERE j.company_id = c.company_id
    ),
    '[]'::json
) AS jobs
 FROM companies c WHERE c.company_id = ${companyId} GROUP BY c.company_id
    `;
    if (!companyDetail) {
        throw new Errorhandler(404, "Company provided not found!")
    }

    res.json({ message: "Company Details Fetched!", companyDetail })

})
