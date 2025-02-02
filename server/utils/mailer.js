import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const user = process.env.gmailAddress;
const pass = process.env.gmailPassKey;

const mail = async (type, userAddress, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
  try {
    let info;
    if (type === "verify") {
      info = await transporter.sendMail({
        from: '"The Social Key 🐘" <shubhamkadariya@gmail.com>',
        to: userAddress,
        subject: "OTP for The Social Key Application!",
        html: `
          <html>
            <head>
                <style>
                    /* Your Styles Here */
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>OTP Verification for The Social Key Application</h2>
                    <p>Hello,</p>
                    <p>Thank you for using The Social Key Application. We are sending this email to verify your identity and ensure that you have authorized this request.</p>
                    <p>For security reasons, we require an OTP (One-Time Password) to complete the action.</p>
                    <div class="otp-container">
                        <p>Your OTP is: <strong>${otp}</strong></p>
                    </div>
                    <p>If you did not request this, please ignore this email or contact support.</p>
                    <div class="footer">
                        <p>&copy; 2024 The Social Key Application. All rights reserved.</p>
                    </div>
                </div>
            </body>
          </html>`,
      });
    } else {
      info = await transporter.sendMail({
        from: '"The Social Key 🐘" <shubhamkadariya@gmail.com>',
        to: userAddress,
        subject: "Welcome to The Social Key Application!",
        html: `
          <html>
            <head>
                <style>
                    /* Your Styles Here */
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Welcome to The Social Key Application!</h2>
                    <p>Congratulations! You have successfully signed up and your email has been verified.</p>
                    <div class="success-container">
                        <p>Your account is now fully verified and ready to use. You can start exploring The Social Key Application right away!</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 The Social Key Application. All rights reserved.</p>
                    </div>
                </div>
            </body>
          </html>`,
      });
    }
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Failed to send email");
  }
};

export default mail;
