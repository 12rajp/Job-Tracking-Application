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

export const sendVerificationEmail = async (toEmail: string, token: string) => {
  if (!transporter) throw new Error("Mailer not initialized");

  const url = `http://localhost:3000/users/verify/${token}`;

  await transporter.sendMail({
    from: `"Verify Account" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Verify your email",
    html: `
      <h3>Email Verification</h3>
      <p>Click below to verify your email:</p>
      <a href="${url}">Verify Email</a>
    `,
  });

  console.log("Verification email sent to:", toEmail);
};
