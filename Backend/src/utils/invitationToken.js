import dns from "dns"
import nodemailer from "nodemailer";

// Force Node to prefer IPv4 over IPv6
dns.setDefaultResultOrder("ipv4first");

export const sendInviteEmail = async (email, link) => {
  try {
    console.log("APP_EMAIL:", process.env.APP_EMAIL);
    console.log(
      "APP_PASSWORD:",
      process.env.APP_PASSWORD ? "Present" : "Missing"
    );

    const transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true only for port 465
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
        tls: {
      rejectUnauthorized: false
   }
    });

    console.log(transporter)

    // Check SMTP connection
    await transporter.verify();
    console.log("✅ SMTP Connected");

    const info = await transporter.sendMail({
      from: `"CRM Sales" <${process.env.APP_EMAIL}>`,
      to: email,
      subject: "Set your password",
      html: `
        <h2>Welcome!</h2>
        <p>Click below to set your password:</p>
        <a href="${link}">${link}</a>
      `,
    });

    console.log(info)

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email Error:", error);
    throw error;
  }
};