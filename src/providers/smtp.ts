import { CONFIG, EMAIL, EMAIL_SENT_RESPONSE } from "../types";
import { util_sendEmail_SMTP } from "../utils/smtp";

export const sendEmail_SMTP = async (
  email: EMAIL,
  config: CONFIG["SMTP"]
): Promise<EMAIL_SENT_RESPONSE> => {
  try {
    if (!config) throw new Error("SMTP is not configured properly.");

    const message = await util_sendEmail_SMTP(config, email);

    return {
      provider: "SMTP",
      time: new Date(),
      id: message.messageId,
      email,
    };
  } catch (error) {
    console.log(error);

    const msg = {
      provider: "SMTP",
      time: new Date(),
      error: error,
    };

    throw new Error(JSON.stringify(msg));
  }
};
