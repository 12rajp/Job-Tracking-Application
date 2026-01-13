import express from "express";
import {addCompany,getAllCompanies,updateCompany,deleteCompany,getCompanyById,} from "../controllers/companyController";

const router = express.Router();

router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);
router.post("/", addCompany);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

export default router;
