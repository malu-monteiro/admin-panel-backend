import nodemailer from "nodemailer";

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || "587", 10);
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
  console.error(
    "Error: Email environment variables (EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS) are not configured correctly in .env"
  );
}

export const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error verifying SMTP connection:", error);
  } else {
    console.log("SMTP server ready to send emails!");
  }
});
