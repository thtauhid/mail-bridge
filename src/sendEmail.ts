import { sendEmail_AWS_SES } from "./providers/aws";
import { sendEmail_RESEND } from "./providers/resend";
import { EMAIL, PROVIDER, CONFIG } from "./types";

export const sendEmail = async (
  email: EMAIL,
  provider: PROVIDER,
  config: CONFIG
) => {
  switch (provider) {
    case "RESEND":
      return await sendEmail_RESEND(email, config.RESEND);

    case "AWS_SES":
      return await sendEmail_AWS_SES(email, config.AWS_SES);
  }
};
