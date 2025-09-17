"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = void 0;
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
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendOtpEmail = (to, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
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
        yield transporter.sendMail(mailOptions);
        console.log(`Email OTP envoyé à ${to}`);
    }
    catch (error) {
        console.error("Erreur en envoyant l’email OTP:", error);
        throw error;
    }
});
exports.sendOtpEmail = sendOtpEmail;
