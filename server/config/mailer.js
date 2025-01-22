import nodemailer from 'nodemailer';
import envConfig from './env.js';

export const transporter = nodemailer.createTransport({
  host: 'smtp.dreamhost.com',
  port: 465,
  secure: true,
  auth: {
    user: envConfig.mailerEmail,
    pass: envConfig.mailerPass,
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to send mail');
  }
});
