import { CONFIG, EMAIL, EMAIL_SENT_RESPONSE } from "../types";
import { util_sendEmail_SMTP } from "../utils/smtp";

export const sendEmail_OUTLOOK = async (
  email: EMAIL,
  config: CONFIG["outlook"]
): Promise<EMAIL_SENT_RESPONSE> => {
  try {
    if (!config) throw new Error("OUTLOOK is not configured properly.");

    const message = await util_sendEmail_SMTP(config, email);

    return {
      provider: "outlook",
      time: new Date(),
      id: message.messageId,
      email,
    };
  } catch (error) {
    console.log(error);

    const msg = {
      provider: "OUTLOOK",
      time: new Date(),
      error: error,
    };

    throw new Error(JSON.stringify(msg));
  }
};
