import { sendEmail } from "./sendEmail";
import { EMAIL, PROVIDER, SECRETS } from "./types";

export class SuperSend {
  private providers: PROVIDER[];
  private secrets: SECRETS;

  constructor(providers: PROVIDER[], secrets: SECRETS) {
    this.providers = providers;

    if (providers.includes("RESEND") && !secrets?.RESEND_API_KEY) {
      throw new Error(
        "Error: RESEND_API_KEY is required. Pass it in the secrets object when initializing SuperSend"
      );
    }

    this.secrets = secrets;
    console.log("SuperSend initialized");
  }

  async send(email: EMAIL, provider?: PROVIDER) {
    // Use the default provider if none is provided
    if (!provider) {
      return sendEmail(email, this.providers[0], this.secrets);
    }

    // Use the provided provider
    return sendEmail(email, provider, this.secrets);
  }
}
