import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {

    user: process.env.EMAIL, // your Gmail email
    pass: process.env.EMAIL_PASSWORD, // your Gmail app password
  },
});

export const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: 'Your OTP for Account Verification',
    html: `<h3>Your OTP is: <b>${otp}</b></h3><p>This OTP is valid for 30 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
