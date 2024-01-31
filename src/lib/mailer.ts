import { createTransport } from "nodemailer";
import { logError } from "./logger";

type SendMailParams = {
  to: string;
  subject: string;
  content: string;
};

export async function sendEmail({ to, subject, content }: SendMailParams) {
  try {
    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: +(process.env.SMTP_PORT ?? "0"),
      secure: process.env.SMTP_SECURE !== "false",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: subject,
      html: content,
    });
  } catch (error) {
    logError(error);
    throw error;
  }
}
