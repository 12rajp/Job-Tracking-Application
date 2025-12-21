import { Response } from "express";
import prisma from "../prismaClient/prismaClient";
import { AuthRequest } from "../interfaces/authRequest.interface";
import { getPagination } from "../utils/pagination ";
import { Prisma } from "@prisma/client";

export const getAllContactHRs = async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const { take, skip } = getPagination(page, limit);

  try {
    const contacts = await prisma.contact_HR.findMany({
      take,
      skip,
      orderBy: { hr_name: "asc" },
      include: { company: true },
    });

    const total = await prisma.contact_HR.count();

    return res.json({
      data: contacts,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET ALL CONTACTS ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch contacts" });
  }
};

export const addContactHR = async (req: AuthRequest, res: Response) => {
  const { company_id, hr_name, email, phone, position, linked_in } = req.body;

  if (!company_id || !hr_name || !email) {
    return res.status(400).json({
      message: "company_id, hr_name, email are required"
    });
  }

  try {
    const contact = await prisma.contact_HR.create({
      data: { company_id, hr_name, email, phone, position, linked_in },
    });

    return res.status(201).json({
      message: "Contact added successfully",
      contact
    });

  } catch (error) {
    // ✅ Proper Prisma error handling (NO any)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({
          message: "HR with this email already exists"
        });
      }
    }

    console.error("ADD CONTACT ERROR:", error);
    return res.status(500).json({ message: "Failed to add contact" });
  }
};





export const getContactHRById = async (req: AuthRequest, res: Response) => {
  const contactId = Number(req.params.id);

  try {
    const contact = await prisma.contact_HR.findUnique({
      where: { contact_id: contactId },
      include: { company: true },
    });

    if (!contact) return res.status(404).json({ message: "Contact not found" });

    return res.json({ contact });
  } catch (error) {
    console.error("GET CONTACT ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch contact" });
  }
};

export const updateContactHR = async (req: AuthRequest, res: Response) => {
  const contactId = Number(req.params.id);
  const { hr_name, email, phone, position, linked_in } = req.body;

  try {
    const contact = await prisma.contact_HR.findUnique({ where: { contact_id: contactId } });
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    const updatedContact = await prisma.contact_HR.update({
      where: { contact_id: contactId },
      data: { hr_name, email, phone, position, linked_in },
    });

    return res.json({ message: "Contact updated successfully", contact: updatedContact });
  } catch (error) {
    console.error("UPDATE CONTACT ERROR:", error);
    return res.status(500).json({ message: "Failed to update contact" });
  }
};

export const deleteContactHR = async (req: AuthRequest, res: Response) => {
  const contactId = Number(req.params.id);

  try {
    await prisma.contact_HR.delete({ where: { contact_id: contactId } });
    return res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("DELETE CONTACT ERROR:", error);
    return res.status(500).json({ message: "Failed to delete contact" });
  }
};
