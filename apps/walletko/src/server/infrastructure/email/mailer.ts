import nodemailer from "nodemailer";

export type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
};

export interface Mailer {
  sendMail(options: SendMailOptions): Promise<void>;
}

type MailerConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

class NodemailerMailer implements Mailer {
  private readonly transporter;
  private readonly from: string;

  constructor(config: MailerConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
    });
    this.from = config.from;
  }

  async sendMail({ to, subject, html }: SendMailOptions): Promise<void> {
    await this.transporter.sendMail({ from: this.from, to, subject, html });
  }
}

// env is read once at the module boundary, not inside the class
export const mailer: Mailer = new NodemailerMailer({
  // biome-ignore lint/style/noNonNullAssertion: required env vars asserted at startup
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  // biome-ignore lint/style/noNonNullAssertion: required env vars asserted at startup
  user: process.env.SMTP_USER!,
  // biome-ignore lint/style/noNonNullAssertion: required env vars asserted at startup
  pass: process.env.SMTP_PASS!,
  // biome-ignore lint/style/noNonNullAssertion: required env vars asserted at startup
  from: process.env.EMAIL_FROM!,
});
