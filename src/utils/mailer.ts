import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter;

export const initMailer = () => {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  console.log("Mailer initialized with GMAIL account:", process.env.GMAIL_USER);
};

export const sendEmailWithToken = async (
  email: string,
  token: string,
  type: "verify" | "passwordReset" = "verify"
) => {
  if (!transporter) throw new Error("Mailer not initialized");

  const baseUrl = process.env.BASE_URL;

  const path = type === "verify" ? `/users/verify/${token}` : `/users/reset.password/${token}`;
  const url = `${baseUrl}${path}`;

  const subject = type === "verify" ? "Verify your email" : "Reset your password";
  const actionText = type === "verify" ? "Verify Email" : "Reset Password";

  await transporter.sendMail({
    from: `"MyApp" <${process.env.GMAIL_USER}>`,
    to: email,
    subject,
    html: `
      <h3>${subject}</h3>
      <p>Click below to ${type === "verify" ? "verify your email" : "reset your password"}:</p>
      <a href="${url}">${actionText}</a>
    `,
  });

  console.log(`${subject} email sent to:`, email);
};
