export const JWT_SECRET = process.env.JWT_SECRET as string;
export const EMAIL_JWT_SECRET = process.env.EMAIL_JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

if (!EMAIL_JWT_SECRET) {
  throw new Error("EMAIL_JWT_SECRET is not defined in .env");
}
