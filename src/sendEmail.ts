import { sendEmail_AWS_SES } from "./providers/aws";
import { sendEmail_BREVO } from "./providers/brevo";
import { sendEmail_GMAIL } from "./providers/gmail";
import { sendEmail_MAILGUN } from "./providers/mailgun";
import { sendEmail_OUTLOOK } from "./providers/outlook";
import { sendEmail_RESEND } from "./providers/resend";
import { sendEmail_SMTP } from "./providers/smtp";
import { EMAIL, PROVIDER, CONFIG } from "./types";

export const sendEmail = async (
  email: EMAIL,
  provider: PROVIDER,
  config: CONFIG
) => {
  switch (provider) {
    case "AWS_SES":
      return await sendEmail_AWS_SES(email, config.AWS_SES);

    case "BREVO":
      return await sendEmail_BREVO(email, config.BREVO);

    case "GMAIL":
      return await sendEmail_GMAIL(email, config.GMAIL);

    case "MAILGUN":
      return await sendEmail_MAILGUN(email, config.MAILGUN);

    case "OUTLOOK":
      return await sendEmail_OUTLOOK(email, config.OUTLOOK);

    case "RESEND":
      return await sendEmail_RESEND(email, config.RESEND);

    case "SMTP":
      return await sendEmail_SMTP(email, config.SMTP);

    default:
      throw new Error("Invalid provider");
  }
};
