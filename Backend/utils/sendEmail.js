// Final Port Fix Test.


const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Required for port 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        // This is the "magic" line that fixes the Render connection issue
        rejectUnauthorized: false 
      }
    });

    await transporter.sendMail({
      from: `"ResinMart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: text, 
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email not sent!");
    console.log(error);
    return error;
  }
};

module.exports = sendEmail;