// import nodemailer from "nodemailer";

// let transporter: nodemailer.Transporter;

// export const initMailer = () => {
//   transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.GMAIL_USER,
//       pass: process.env.GMAIL_PASS,
//     },
//   });

//   console.log("Mailer initialized with GMAIL account:", process.env.GMAIL_USER);
// };

// export const sendVerificationEmail = async (toEmail: string, token: string) => {
//   if (!transporter) throw new Error("Mailer not initialized");

//   const url = `http://localhost:3000/users/verify/${token}`;

//   await transporter.sendMail({
//     from: `"Verify Account" <${process.env.GMAIL_USER}>`,
//     to: toEmail,
//     subject: "Verify your email",
//     html: `
//       <h3>Email Verification</h3>
//       <p>Click below to verify your email:</p>
//       <a href="${url}">Verify Email</a>
//     `,
//   });

//   console.log("Verification email sent to:", toEmail);
// };





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

export const sendVerificationEmail = async (
  email: string,
  token: string,
  type: "verify" | "passwordReset" = "verify"
) => {
  if (!transporter) throw new Error("Mailer not initialized");

  const url =
    type === "verify"
      ? `http://localhost:3000/users/verify/${token}`
      : `http://localhost:3000/users/reset.password/${token}`;

  await transporter.sendMail({
    from: `"MyApp" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: type === "verify" ? "Verify your email" : "Reset your password",
    html: `
      <h3>${type === "verify" ? "Email Verification" : "Password Reset"}</h3>
      <p>Click below to ${type === "verify" ? "verify your email" : "reset your password"}:</p>
      <a href="${url}">${type === "verify" ? "Verify Email" : "Reset Password"}</a>
    `,
  });

  console.log(`${type === "verify" ? "Verification" : "Password reset"} email sent to:`, email);
};
