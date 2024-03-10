import { CONFIG, EMAIL, EMAIL_SENT_RESPONSE } from "../types";
import { util_sendEmail_SMTP } from "../utils/smtp";

export const sendEmail_GMAIL = async (
  email: EMAIL,
  config: CONFIG["GMAIL"]
): Promise<EMAIL_SENT_RESPONSE> => {
  try {
    if (!config) throw new Error("GMAIL is not configured properly.");

    const message = await util_sendEmail_SMTP(config, email);

    return {
      provider: "GMAIL",
      time: new Date(),
      id: message.messageId,
      email,
    };
  } catch (error) {
    console.log(error);

    const msg = {
      provider: "GMAIL",
      time: new Date(),
      error: error,
    };

    throw new Error(JSON.stringify(msg));
  }
};
