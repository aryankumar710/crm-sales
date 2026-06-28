// import dns from "dns";
// import nodemailer from "nodemailer";

// // Force Node to prefer IPv4 over IPv6
// dns.setDefaultResultOrder("ipv4first");

// export const sendInviteEmail = async (email, link) => {
//   try {
//     console.log("APP_EMAIL:", process.env.APP_EMAIL);
//     console.log(
//       "APP_PASSWORD:",
//       process.env.APP_PASSWORD ? "Present" : "Missing"
//     );

//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false, // true only for port 465
//       auth: {
//         user: process.env.APP_EMAIL,
//         pass: process.env.APP_PASSWORD,
//       },
//     });

//     // Check SMTP connection
//     await transporter.verify();
//     console.log("✅ SMTP Connected");

//     const info = await transporter.sendMail({
//       from: `"CRM Sales" <${process.env.APP_EMAIL}>`,
//       to: email,
//       subject: "Set your password",
//       html: `
//         <h2>Welcome!</h2>
//         <p>Click below to set your password:</p>
//         <a href="${link}">${link}</a>
//       `,
//     });

//     console.log("✅ Email sent:", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("❌ Email Error:", error);
//     throw error;
//   }
// };

// import {Resend} from "resend"

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendInviteEmail = async (email, link) => {
//   try {
//     const { data, error } = await resend.emails.send({
//       from: 'onboarding@resend.dev',
//       to: email,
//       subject: "Set your password",
//       html: `
//         <h2>Welcome!</h2>
//         <p>Click below to set your password:</p>

//         <a href="${link}">
//           Set Password
//         </a>

//         <br><br>

//         <p>If the button doesn't work, copy this link:</p>

//         <p>${link}</p>
//       `,
//     });

//     console.log("resend")

//     if (error) {
//       console.error(error);
//       throw new Error(error.message);
//     }

//     console.log("Email Sent:", data);
//   } catch (error) {
//     console.error("Resend Error:", error);
//     throw error;
//   }
// };


import SibApiV3Sdk from "sib-api-v3-sdk"

const client = SibApiV3Sdk.ApiClient.instance

const apiKey = client.authentications["api-key"]
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendInviteEmail = async (email, link) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    console.log(sendInviteEmail)

    sendSmtpEmail.sender = {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME,
    };
    

    sendSmtpEmail.to = [
      {
        email,
      },
    ];

    sendSmtpEmail.subject = "Set your password";

    sendSmtpEmail.htmlContent = `
      <h2>Welcome!</h2>

      <p>Click below to set your password:</p>

      <a href="${link}">
        Set Password
      </a>

      <br><br>

      <p>If the button doesn't work, copy this link:</p>

      <p>${link}</p>
    `;

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(result)

    console.log("Email sent:", result);
  } catch (error) {
    console.error("Brevo Error:", error);
    throw error;
  }
};