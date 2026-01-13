import { Gender } from "@prisma/client";

export interface UpdateUserData {
  user_name?: string;
  email?: string;
  full_name?: string;
  phone?: string;
  profile_photo?: string;
  city?: string;
  country?: string;
  date_of_birth?: Date;
  gender?: Gender | { set: Gender } | null;
}
