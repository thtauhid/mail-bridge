import { sendEmail } from "./sendEmail";
import { EMAIL, PROVIDER, CONFIG } from "./types";

export class MailBridge {
  private config: CONFIG;
  private provider_priority: PROVIDER[];
  private defaultFrom: string;
  private retryCount: number;

  constructor({
    config,
    priority,
    defaultFrom,
    retryCount,
  }: {
    config: CONFIG;
    priority?: PROVIDER[];
    defaultFrom: string;
    retryCount?: number;
  }) {
    this.config = config;
    this.defaultFrom = defaultFrom;
    if (priority) {
      this.provider_priority = priority;
    } else {
      this.provider_priority = Object.keys(config) as PROVIDER[];
    }
    this.retryCount = retryCount || 0;
    console.log("MailBridge initialized");
  }

  async send(email: EMAIL, provider?: PROVIDER) {
    // Check if user has provided a from field
    if (!email.from) {
      email.from = this.defaultFrom;
    }

    // Use the default provider if none is provided
    if (!provider) {
      return await sendEmail(email, this.provider_priority[0], this.config);
    }

    // Use the provided provider
    return await sendEmail(email, provider, this.config);
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
    for (let provider of this.provider_priority) {
      report.providers.push(provider);
    }

    // Check if the secrets are present for each provider

    // Resend
    if (
      this.provider_priority.includes("RESEND") &&
      !this.config.RESEND?.API_KEY
    ) {
      report.errors.push("RESEND.API_KEY is required");
    }

    // Brevo
    if (this.provider_priority.includes("BREVO")) {
      if (!this.config.BREVO?.host)
        report.errors.push("BREVO.host is required.");

      if (!this.config.BREVO?.port)
        report.errors.push("BREVO.port is required.");

      if (!this.config.BREVO?.auth.user)
        report.errors.push("BREVO.auth.user is required.");

      if (!this.config.BREVO?.auth.pass)
        report.errors.push("BREVO.auth.pass is required.");
    }

    if (
      this.provider_priority.includes("AWS_SES") &&
      !this.config.AWS_SES?.REGION
    ) {
      // AWS SES
      report.errors.push("AWS_SES.REGION is required");
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
