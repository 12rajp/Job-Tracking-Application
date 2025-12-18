// import express, { Response } from "express";
// import prisma from "../prismaClient/prismaClient";
// import { AuthRequest } from "../interfaces/authRequest.interface";
// import { authMiddleware } from "../middleware/auth";

// const router = express.Router();

// router.put(
//   "/update",
//   authMiddleware,
//   async (req: AuthRequest, res: Response) => {
//     const userId = req.userId;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const {
//       user_name, email, full_name, phone, profile_photo, city, country, date_of_birth, gender,} = req.body;

//     const data: {
//       user_name?: string;
//       email?: string;
//       full_name?: string;
//       phone?: string;
//       profile_photo?: string;
//       city?: string;
//       country?: string;
//       date_of_birth?: Date;
//       gender?: string;
//     } = {};

//     if (user_name) data.user_name = user_name;
//     if (email) data.email = email;
//     if (full_name) data.full_name = full_name;
//     if (phone) data.phone = phone;
//     if (profile_photo) data.profile_photo = profile_photo;
//     if (city) data.city = city;
//     if (country) data.country = country;
//     if (gender) data.gender = gender;

//     if (date_of_birth) {
//       data.date_of_birth = new Date(date_of_birth);
//     }

//     try {
//       const updatedUser = await prisma.user.update({
//         where: { user_id: userId },
//         data,
//       });

//       return res.json({
//         message: "User updated successfully",
//         user: updatedUser,
//       });
//     } catch (error) {
//       console.error("UPDATE ERROR ", error);
//       return res.status(500).json({
//         message: "Failed to update user",
//       });
//     }
//   }
// );

// router.delete(
//   "/delete",
//   authMiddleware,
//   async (req: AuthRequest, res: Response) => {
//     const userId = req.userId;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     try {
//       await prisma.user.delete({
//         where: { user_id: userId },
//       });

//       return res.json({
//         message: "User deleted successfully",
//       });
//     } catch {
//       return res.status(500).json({
//         message: "Failed to delete user",
//       });
//     }
//   }
// );
//  export default router;




import express, { Response } from "express";
import prisma from "../prismaClient/prismaClient";
import { AuthRequest } from "../interfaces/authRequest.interface";
import { UpdateUserData } from "../interfaces/updateUser.interface";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.put(
  "/update",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
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
      console.error("UPDATE ERROR ", error);
      return res.status(500).json({
        message: "Failed to update user",
      });
    }
  }
);

router.delete(
  "/delete",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      await prisma.user.delete({
        where: { user_id: userId },
      });

      return res.json({
        message: "User deleted successfully",
      });
    } catch {
      return res.status(500).json({
        message: "Failed to delete user",
      });
    }
  }
);

export default router;
