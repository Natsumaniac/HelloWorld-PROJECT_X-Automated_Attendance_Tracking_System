const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred email provider
  auth: {
    user: process.env.EMAIL_USER, // set in your .env
    pass: process.env.EMAIL_PASS, // set in your .env
  },
});

const sendPasswordEmail = async (to, password) => {
  await transporter.sendMail({
    from: `"Attendance System" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Student Account Password',
    text: `Welcome! Your account has been created.\n\nYour temporary password is: ${password}\n\nPlease log in and change your password as soon as possible.`,
  });
};

module.exports = { sendPasswordEmail };