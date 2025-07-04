import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { AppError } from '../error/AppError';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.NODEMAILER_EMAIL,
    pass: env.NODEMAILER_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: env.NODEMAILER_EMAIL,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new AppError(`Failed to send email: ${errorMessage}`, 500);
  }
};
