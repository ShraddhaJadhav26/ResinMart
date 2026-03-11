const { Resend } = require('resend');

// This uses the key you just added to Render
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, subject, text) => {
  try {
    const data = await resend.emails.send({
      // For now, you MUST use this "onboarding" email
      from: 'ResinMart <onboarding@resend.dev>', 
      to: email,
      subject: subject,
      html: text, // This sends the clickable link
    });

    console.log("Email sent successfully via Resend!", data);
  } catch (error) {
    console.error("Resend Error:", error);
    return error;
  }
};

module.exports = sendEmail;