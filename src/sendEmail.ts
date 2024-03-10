import { sendEmail_AWS_SES } from "./providers/aws";
import { sendEmail_BREVO } from "./providers/brevo";
import { sendEmail_MAILGUN } from "./providers/mailgun";
import { sendEmail_RESEND } from "./providers/resend";
import { sendEmail_SMTP } from "./providers/smtp";
import { EMAIL, PROVIDER, CONFIG } from "./types";

export const sendEmail = async (
  email: EMAIL,
  provider: PROVIDER,
  config: CONFIG
) => {
  switch (provider) {
    case "RESEND":
      return await sendEmail_RESEND(email, config.RESEND);

    case "BREVO":
      return await sendEmail_BREVO(email, config.BREVO);

    case "AWS_SES":
      return await sendEmail_AWS_SES(email, config.AWS_SES);

    case "MAILGUN":
      return await sendEmail_MAILGUN(email, config.MAILGUN);

    case "SMTP":
      return await sendEmail_SMTP(email, config.SMTP);
  }
};
