import { CONFIG, EMAIL, EMAIL_SENT_RESPONSE } from "../types";
import { sendEmail_SMTP } from "../utils/smtp";

export const sendEmail_BREVO = async (
  email: EMAIL,
  config: CONFIG["BREVO"]
): Promise<EMAIL_SENT_RESPONSE> => {
  try {
    if (!config) throw new Error("BREVO is not configured properly.");

    const message = await sendEmail_SMTP(config, email);

    return {
      provider: "BREVO",
      time: new Date(),
      id: message.messageId,
      email,
    };
  } catch (error) {
    console.log(error);

    const msg = {
      provider: "BREVO",
      time: new Date(),
      error: error,
    };

    throw new Error(JSON.stringify(msg));
  }
};
