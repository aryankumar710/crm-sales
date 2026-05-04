import nodemailer from "nodemailer";

export const sendInviteEmail = async (email, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.APP_EMAIL,
    to: email,
    subject: "Set your password",
    html: `
      <h2>Welcome!</h2>
      <p>Click below to set your password:</p>
      <a href="${link}">${link}</a>
    `,
  });
};