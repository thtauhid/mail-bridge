import { Resend } from "resend";
import { CONFIG, EMAIL, EMAIL_SENT_RESPONSE } from "../types";

export const sendEmail_RESEND = async (
  email: EMAIL,
  config: CONFIG["RESEND"]
): Promise<EMAIL_SENT_RESPONSE> => {
  try {
    const resend = new Resend(config?.API_KEY);
    const data = await resend.emails.send({
      from: email.from!,
      to: email.to,
      subject: email.subject,
      html: email.body,
    });

    return {
      provider: "RESEND",
      time: new Date(),
      id: data.data?.id,
      email,
    };
  } catch (error) {
    console.log(error);

    const msg = {
      provider: "RESEND",
      time: new Date(),
      error: error,
    };

    throw new Error(JSON.stringify(msg));
  }
};
