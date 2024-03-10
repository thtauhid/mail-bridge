import FormData from "form-data";
import Mailgun from "mailgun.js";

import { CONFIG, EMAIL, EMAIL_SENT_RESPONSE } from "../types";

export const sendEmail_MAILGUN = async (
  email: EMAIL,
  config: CONFIG["MAILGUN"]
): Promise<EMAIL_SENT_RESPONSE> => {
  const mailgun = new Mailgun(FormData);

  try {
    const mg = mailgun.client({
      username: "api",
      key: config?.MAILGUN_API_KEY!,
    });

    const data = await mg.messages.create(config?.MAILGUN_DOMAIN!, {
      from: email.from,
      to: email.to,
      subject: email.subject,
      html: email.text,
    });

    return {
      provider: "MAILGUN",
      time: new Date(),
      id: data.id,
      email,
    };
  } catch (error) {
    console.log(error);

    const msg = {
      provider: "MAILGUN",
      time: new Date(),
      error: error,
    };

    throw new Error(JSON.stringify(msg));
  }
};
