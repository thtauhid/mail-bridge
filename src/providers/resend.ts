import { Resend } from "resend";
import { EMAIL } from "../types";

export const sendEmail_RESEND = async (email: EMAIL, api_key: string) => {
  try {
    const resend = new Resend(api_key);
    const data = await resend.emails.send({
      from: email.from!,
      to: email.to,
      subject: email.subject,
      html: email.body,
    });

    return data;
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
