import express from "express"
import { isAuth } from "../middleware/auth.js"
import uploadFile from "../middleware/multer.js"
import { createCompany, createJob, deleteCompany, getActiveJobs, getAllCompanies, getCompanyDetails, getSingleJob, updateJob } from "../controller/job.js"

const router = express.Router()
router.post("/company/add", isAuth, uploadFile, createCompany)
router.delete("/company/:companyId", isAuth, deleteCompany)
router.post("/company/add-job", isAuth, createJob)
router.put("/company/update-job/:jobId", isAuth, updateJob)
router.get("/company/get-companies", isAuth, getAllCompanies)
router.get("/company/get-company/:companyId", isAuth, getCompanyDetails)
router.post("/company/get-active-jobs", isAuth, getActiveJobs)
router.get("/company/get-job/:jobId", getSingleJob)
export default router
