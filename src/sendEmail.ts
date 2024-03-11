import { sendEmail_AWS_SES } from "./providers/aws";
import { sendEmail_BREVO } from "./providers/brevo";
import { sendEmail_GMAIL } from "./providers/gmail";
import { sendEmail_MAILGUN } from "./providers/mailgun";
import { sendEmail_OUTLOOK } from "./providers/outlook";
import { sendEmail_RESEND } from "./providers/resend";
import { sendEmail_SMTP } from "./providers/smtp";
import { CONFIG, EMAIL, PROVIDER } from "./types";

export const sendEmail = async (
  email: EMAIL,
  config: CONFIG,
  provider: PROVIDER
) => {
  switch (provider) {
    case "AWS_SES":
      return await sendEmail_AWS_SES(email, config.aws_ses);

    case "BREVO":
      return await sendEmail_BREVO(email, config.brevo);

    case "GMAIL":
      return await sendEmail_GMAIL(email, config.gmail);

    case "MAILGUN":
      return await sendEmail_MAILGUN(email, config.mailgun);

    case "OUTLOOK":
      return await sendEmail_OUTLOOK(email, config.outlook);

    case "RESEND":
      return await sendEmail_RESEND(email, config.resend);

    case "SMTP":
      return await sendEmail_SMTP(email, config.smtp);

    default:
      throw new Error("Invalid provider");
  }
};
