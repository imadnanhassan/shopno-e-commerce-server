import nodemailer from 'nodemailer';
import { env } from '../config/env';

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

  await transporter.sendMail(mailOptions);
};
