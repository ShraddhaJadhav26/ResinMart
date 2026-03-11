const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "shraddha26122005@gmail.com", // Replace this
        pass: "gxbszcshkssudesd"     // Replace this with 16-char code
      },
    });

    await transporter.sendMail({
      from: '"ResinMart" <YOUR_GMAIL@gmail.com>',
      to: email,
      subject: subject,
      html: text, // We will send HTML for a nice link
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email not sent!");
    console.log(error);
    return error;
  }
};

module.exports = sendEmail;