"use strict";
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
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
// export async function sendEmail(to: string, subject: string, text: string, html?: string) {
//   const transporter = nodemailer.createTransport({
//     service: "gmail", // tu peux mettre "Outlook", "Yahoo", ou configurer SMTP custom
//     auth: {
//       user: process.env.EMAIL_USER, // ton adresse mail
//       pass: process.env.EMAIL_PASS, // mot de passe ou App Password
//     },
//   });
//   await transporter.sendMail({
//     from: `"Mon App" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text,
//     html,
//   });
// }
function sendEmail(to, subject, text, html) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            yield transporter.sendMail({
                from: `"Mon App" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                text,
                html,
            });
        }
        catch (error) {
            console.error("Erreur lors de l'envoi de l'email :", error);
            throw error;
        }
    });
}
