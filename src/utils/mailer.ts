import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter;

export const initMailer = async () => {
  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  console.log("Email User:", testAccount.user);
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const url = `http://localhost:3000/users/verify/${token}`;

  const info = await transporter.sendMail({
    from: '"Verify Account" <no-reply@test.com>',
    to: email,
    subject: "Verify your email",
    html: `
      <h3>Email Verification</h3>
      <p>Click below to verify your email:</p>
      <a href="${url}">Verify Email</a>
    `,
  });

  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
};
