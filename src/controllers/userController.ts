import { Response } from "express";
import prisma from "../prismaClient/prismaClient";
import { AuthRequest } from "../interfaces/authRequest.interface";
import { UpdateUserData } from "../interfaces/updateUser.interface";

export const updateUser = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const {
    user_name, email, full_name, phone, profile_photo,
    city, country, date_of_birth, gender,
  } = req.body;

  const data: UpdateUserData = {};

  if (user_name) data.user_name = user_name;
  if (email) data.email = email;
  if (full_name) data.full_name = full_name;
  if (phone) data.phone = phone;
  if (profile_photo) data.profile_photo = profile_photo;
  if (city) data.city = city;
  if (country) data.country = country;
  if (gender) data.gender = gender;
  if (date_of_birth) data.date_of_birth = new Date(date_of_birth);

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
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await prisma.user.delete({
      where: { user_id: userId },
    });

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR", error);
    return res.status(500).json({ message: "Failed to delete user" });
  }
};
