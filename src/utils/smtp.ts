import { createTransport } from "nodemailer";
import { EMAIL, Transporter } from "../types";

export const util_sendEmail_SMTP = async (
  transporter: Transporter,
  email: EMAIL
) => {
  const mailTransporter = createTransport(transporter);

  try {
    return await mailTransporter.sendMail(email);
  } catch (error) {
    console.error(error);
    throw new Error("SMTP send failed");
  }
};
