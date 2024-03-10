import { sendEmail } from "./sendEmail";
import { EMAIL, PROVIDER, SECRETS } from "./types";

export class MailBridge {
  private providers: PROVIDER[];
  private secrets: SECRETS;
  private defaultFrom: string;

  constructor({
    providers,
    secrets,
    defaultFrom,
  }: {
    providers: PROVIDER[];
    secrets: SECRETS;
    defaultFrom: string;
  }) {
    this.providers = providers;
    this.defaultFrom = defaultFrom;

    if (providers.includes("RESEND") && !secrets?.RESEND_API_KEY) {
      throw new Error(
        "RESEND_API_KEY is required. Pass it in the secrets object when initializing MailBridge"
      );
    }

    this.secrets = secrets;
    console.log("MailBridge initialized");
  }

  async send(email: EMAIL, provider?: PROVIDER) {
    // Check if user has provided a from field
    if (!email.from) {
      email.from = this.defaultFrom;
    }

    // Use the default provider if none is provided
    if (!provider) {
      return await sendEmail(email, this.providers[0], this.secrets);
    }

    // Use the provided provider
    return await sendEmail(email, provider, this.secrets);
  }
}
