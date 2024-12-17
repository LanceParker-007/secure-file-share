import nodemailer from "nodemailer";

class EmailService {
  static async sendOTPEmail(email, otp) {
    try {
      // Create a transporter using SendGrid's SMTP server
      const transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        secure: false, // false = STARTTLS, true = SSL/TLS
        auth: {
          user: "apikey", // SendGrid API username is always 'apikey'
          pass: process.env.SENDGRID_API_KEY, // Your SendGrid API key
        },
      });

      // Email configuration
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Your One-Time Password (OTP)",
        text: `Your OTP is: ${otp}. This code will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <h2>Your One-Time Password (OTP)</h2>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This code will expire in 10 minutes and can be used only once. If you enter it wrong, please sign up again.</p>
            <small>If you did not request this, please ignore this email.</small>
          </div>
        `,
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);
      console.log("OTP Email sent:", info.messageId);
      console.log(
        `Note: But otp is received late for  therefore disabling mfa verification! 
        Anybody can sign in once sign up is successful!`
      );

      return true;
    } catch (error) {
      console.error("Error sending OTP email:", error);
      throw new Error("Failed to send OTP email");
    }
  }
}

export default EmailService;
