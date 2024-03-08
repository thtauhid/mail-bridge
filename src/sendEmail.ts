import { sendEmail_RESEND } from "./providers/resend";
import { EMAIL, PROVIDER, SECRETS } from "./types";

export const sendEmail = async (
  email: EMAIL,
  provider: PROVIDER,
  secrets: SECRETS
) => {
  switch (provider) {
    case "RESEND":
      return sendEmail_RESEND(email, secrets.RESEND_API_KEY!);
  }
};
