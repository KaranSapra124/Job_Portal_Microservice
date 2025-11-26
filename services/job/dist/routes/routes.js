import express from "express";
import { isAuth } from "../middleware/auth.js";
import uploadFile from "../middleware/multer.js";
import { createCompany, createJob, deleteCompany } from "../controller/job.js";
const router = express.Router();
router.post("/company/add", isAuth, uploadFile, createCompany);
router.delete("/company/:companyId", isAuth, deleteCompany);
router.post("/company/add-job", isAuth, createJob);
export default router;
