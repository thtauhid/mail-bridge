import { sendEmail } from "./sendEmail";
import { EMAIL, PROVIDER, SECRETS } from "./types";

export class MailBridge {
  private providers: PROVIDER[];
  private secrets: SECRETS;
  private defaultFrom: string;
  /**
   * The number of times to retry sending an email.
   * Multiple retries are useful when the email provider is down.
   * Multiple providers need to be configured for this to work.
   */
  private retryCount: number;

  constructor({
    providers,
    secrets,
    defaultFrom,
    retryCount,
  }: {
    providers: PROVIDER[];
    secrets: SECRETS;
    defaultFrom: string;
    retryCount?: number;
  }) {
    this.providers = providers;
    this.defaultFrom = defaultFrom;
    this.retryCount = retryCount || 0;

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

  /**
   * Check the configuration of the MailBridge
   */
  checkConfig() {
    let report = {
      providers: Array<PROVIDER>(),
      errors: Array<string>(),
      defaultFrom: undefined as string | undefined,
      comment: "",
    };

    // Add all the providers to the report
    for (let provider of this.providers) {
      report.providers.push(provider);
    }

    // Check if the secrets are present for each provider

    // Resend
    if (this.providers.includes("RESEND") && !this.secrets.RESEND_API_KEY) {
      report.errors.push("RESEND_API_KEY is required");
    }

    // Mailgun
    if (this.providers.includes("MAILGUN") && !this.secrets.MAILGUN_API_KEY) {
      report.errors.push("MAILGUN_API_KEY is required");
    }

    if (this.providers.includes("MAILGUN") && !this.secrets.MAILGUN_DOMAIN) {
      report.errors.push("MAILGUN_DOMAIN is required");
    }

    // Default from
    if (!this.defaultFrom) {
      report.errors.push("Default from address is not configured");
    } else {
      // Check if the default from is a valid email address
      if (!this.defaultFrom.includes("@")) {
        report.errors.push("Default from address is not a valid email address");
      }

      report.defaultFrom = this.defaultFrom;
    }

    // Retry count
    if (this.retryCount < 0) {
      report.errors.push("Retry count cannot be negative");
    }

    if (report.errors.length === 0) {
      report.comment = "MailBridge seems to be configured correctly";
    } else {
      report.comment = "MailBridge has some configuration errors";
    }

    return report;
  }
}
