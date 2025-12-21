import { Request, Response } from "express";
import prisma from "../prismaClient/prismaClient";
import { getPagination } from "../utils/pagination ";
import { CompanyData } from "../interfaces/companyStatus.interface";

export const addCompany = async (req: Request, res: Response) => {
  const {company_name, industry, company_size, location, rating } = req.body;

  if (!company_name) {
    return res.status(400).json({ message: "Company name is required" });
  }

  const company = await prisma.company.create({
    data: { company_name, industry, company_size, location, rating },
  });

  res.status(201).json({ message: "Company added", company });
};

export const getAllCompanies = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const { take, skip } = getPagination(page, limit);

  try {
    const companies = await prisma.company.findMany({
      take,
      skip,
      orderBy: { createdAt: "desc" }, 
    });

    const total = await prisma.company.count();

    res.json({
      data: companies,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET ALL COMPANIES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch companies" });
  }
};

export const getCompanyById = async (req: Request, res: Response) => {
  const companyId = Number(req.params.id);

  if (isNaN(companyId)) {
    return res.status(400).json({ message: "Invalid company id" });
  }

  try {
    const company = await prisma.company.findUnique({
      where: { company_id: companyId },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found or not exist" });
    }

    return res.json({ data: company });
  } catch (error) {
    console.error("GET COMPANY BY ID ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch company" });
  }
};
  
export const updateCompany = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const existingCompany = await prisma.company.findUnique({
      where: { company_id: id },
    });

    if (!existingCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    const updatedCompany = await prisma.company.update({
      where: { company_id: id },
      data: {
        company_name: req.body.company_name,
        industry: req.body.industry,
        company_size: req.body.company_size,
        location: req.body.location,
        rating: req.body.rating,
      },
    });

    res.json({
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("UPDATE COMPANY ERROR:", error);
    res.status(500).json({ message: "Failed to update company" });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  await prisma.company.delete({ where: { company_id: id } });
  res.json({ message: "Company deleted" });
};
