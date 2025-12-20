import { Response } from "express";
import prisma from "../prismaClient/prismaClient";
import { AuthRequest } from "../interfaces/authRequest.interface";
import { UpdateUserData } from "../interfaces/updateUser.interface";
import { Gender } from "@prisma/client"; 
import bcrypt from "bcrypt";
import { getPagination } from "../utils/pagination ";

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const { take, skip } = getPagination(page, limit);

  try {
    const users = await prisma.user.findMany({
      take,
      skip,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.user.count();

    return res.json({
      data: users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.id);
  if (!userId) return res.status(400).json({ message: "Invalid user id" });

  try {
    const user = await prisma.user.findUnique({ where: { user_id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ user });
  } catch (error) {
    console.error("GET USER BY ID ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.id);

  if (!userId) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (req.userId !== userId) {
    return res.status(403).json({ message: "You not allowed to update this user" });
  }

  const {
    user_name,
    email,
    full_name,
    phone,
    profile_photo,
    city,
    country,
    date_of_birth,
    gender,
  } = req.body;

  const data: UpdateUserData = {};

  if (user_name) data.user_name = user_name;
  if (email) data.email = email;
  if (full_name) data.full_name = full_name;
  if (phone) data.phone = phone;
  if (profile_photo) data.profile_photo = profile_photo;
  if (city) data.city = city;
  if (country) data.country = country;
  if (date_of_birth) data.date_of_birth = new Date(date_of_birth);

  if (gender) {
    if (gender === "MALE" || gender === "FEMALE" || gender === "OTHER") {
      data.gender = { set: gender as Gender };
    } else {
      return res.status(400).json({ message: "Invalid gender value" });
    }
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "Empty body is not allowed" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data,
    });

    return res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE ERROR", error);
    return res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.id); 

  if (!userId) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (req.userId !== userId) {
    return res.status(403).json({ message: "You not allowed to delete this user" });
  }

  try {
    await prisma.user.delete({ where: { user_id: userId } });
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR", error);
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  const { oldPassword, password } = req.body;
  const userId = req.userId;

  if (!oldPassword) return res.status(400).json({ message: "Old password is required" });

  try {
    const user = await prisma.user.findUnique({ where: { user_id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isCorrect) return res.status(400).json({ message: "Old password is incorrect" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { user_id: user.user_id },
      data: { password: hashedPassword },
    });

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("UPDATE PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
