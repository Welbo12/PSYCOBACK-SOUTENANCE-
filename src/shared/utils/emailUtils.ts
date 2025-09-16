// import nodemailer from "nodemailer";
// export async function sendEmail(to: string, subject: string, text: string, html?: string) {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: `"Mon App" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text : " bonjour voici votre code otp " + text,
//     });
//   } catch (error) {
//     console.error("Erreur lors de l'envoi de l'email :", error);
//     throw error;
//   }
// }
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOtpEmail = async (to: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
      },
    });

    const mailOptions = {
      from: `"Arthuriousk" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Code de vérification",
      html: `
       <p>Voici votre code OTP : </p>
       <div style="background-color: #f5f5f5; padding: 10px; text-align: center; border-radius: 3px; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
       <strong>${otp}</strong>
       </div> 
       <p>Il expire dans 10 minutes :) .</p>
       `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email OTP envoyé à ${to}`);
  } catch (error) {
    console.error("Erreur en envoyant l’email OTP:", error);
    throw error;
  }
};   