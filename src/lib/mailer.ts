import { createTransport } from "nodemailer";
import { logError } from "./logger";
import Mail from "nodemailer/lib/mailer";

type SendMailParams = {
  to: string;
  subject: string;
  content: string;
  attachments?: Mail.Attachment[];
};

export async function sendEmail({
  to,
  subject,
  content,
  attachments,
}: SendMailParams) {
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
      attachments,
    });
  } catch (error) {
    logError(error);
    throw error;
  }
}
