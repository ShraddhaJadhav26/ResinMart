const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Port 587 requires secure: false
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // ADD THESE TWO SETTINGS:
      connectionTimeout: 10000, // Wait 10 seconds before giving up
      greetingTimeout: 10000,
      tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2" // Forces a modern, stable security version
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