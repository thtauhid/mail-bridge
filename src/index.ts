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
    // Check if user has provided a "from" field
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

    // AWS SES
    if (this.provider_priority.includes("AWS_SES") && this.config.AWS_SES) {
      const { REGION } = this.config.AWS_SES;

      if (!REGION) report.errors.push("AWS_SES.REGION is required");
    }

    // Brevo
    if (this.provider_priority.includes("BREVO") && this.config.BREVO) {
      const { host, port, auth } = this.config.BREVO;

      if (!host) report.errors.push("BREVO.host is required.");
      if (!port) report.errors.push("BREVO.port is required.");
      if (!auth?.user) report.errors.push("BREVO.auth.user is required.");
      if (!auth?.pass) report.errors.push("BREVO.auth.pass is required.");
    }

    // GMAIL
    if (this.provider_priority.includes("GMAIL") && this.config.GMAIL) {
      const { host, port, auth } = this.config.GMAIL;

      if (!host) report.errors.push("GMAIL.host is required.");
      if (!port) report.errors.push("GMAIL.port is required.");
      if (!auth?.user) report.errors.push("GMAIL.auth.user is required.");
      if (!auth?.pass) report.errors.push("GMAIL.auth.pass is required.");
    }

    // MAILGUN
    if (this.provider_priority.includes("MAILGUN") && this.config.MAILGUN) {
      const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = this.config.MAILGUN;

      if (!MAILGUN_API_KEY)
        report.errors.push("MAILGUN.MAILGUN_API_KEY is required.");
      if (!MAILGUN_DOMAIN)
        report.errors.push("MAILGUN.MAILGUN_DOMAIN is required.");
    }

    // OUTLOOK
    if (this.provider_priority.includes("OUTLOOK")) {
      if (this.config.OUTLOOK) {
        const { host, port, auth } = this.config.OUTLOOK;

        if (!host) report.errors.push("OUTLOOK.host is required.");
        if (!port) report.errors.push("OUTLOOK.port is required.");
        if (!auth?.user) report.errors.push("OUTLOOK.auth.user is required.");
        if (!auth?.pass) report.errors.push("OUTLOOK.auth.pass is required.");
      } else {
        report.errors.push("OUTLOOK is not configured properly.");
      }
    }

    // Resend
    if (this.provider_priority.includes("RESEND") && this.config.RESEND) {
      const { API_KEY } = this.config.RESEND;

      if (!API_KEY) report.errors.push("RESEND.API_KEY is required");
    }

    // SMTP
    if (this.provider_priority.includes("SMTP")) {
      if (this.config.SMTP) {
        const { host, port, auth } = this.config.SMTP;

        if (!host) report.errors.push("SMTP.host is required.");
        if (!port) report.errors.push("SMTP.port is required.");
        if (!auth?.user) report.errors.push("SMTP.auth.user is required.");
        if (!auth?.pass) report.errors.push("SMTP.auth.pass is required.");
      } else {
        report.errors.push("SMTP is not configured properly.");
      }
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
      report.comment = "✅ MailBridge seems to be configured correctly";
    } else {
      report.comment = "❌ MailBridge has some configuration errors";
    }

    return report;
  }
}
