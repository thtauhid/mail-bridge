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
      return await sendEmail(email, this.config, this.provider_priority[0]);
    }

    // Use the provided provider
    return await sendEmail(email, this.config, provider);
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
    if (this.provider_priority.includes("AWS_SES") && this.config.aws_ses) {
      const { region: REGION } = this.config.aws_ses;

      if (!REGION) report.errors.push("aws_ses.region is required");
    }

    // Brevo
    if (this.provider_priority.includes("BREVO") && this.config.brevo) {
      const { host, port, auth } = this.config.brevo;

      if (!host) report.errors.push("brevo.host is required.");
      if (!port) report.errors.push("brevo.port is required.");
      if (!auth?.user) report.errors.push("brevo.auth.user is required.");
      if (!auth?.pass) report.errors.push("brevo.auth.pass is required.");
    }

    // GMAIL
    if (this.provider_priority.includes("GMAIL") && this.config.gmail) {
      const { host, port, auth } = this.config.gmail;

      if (!host) report.errors.push("gmail.host is required.");
      if (!port) report.errors.push("gmail.port is required.");
      if (!auth?.user) report.errors.push("gmail.auth.user is required.");
      if (!auth?.pass) report.errors.push("gmail.auth.pass is required.");
    }

    // MAILGUN
    if (this.provider_priority.includes("MAILGUN") && this.config.mailgun) {
      const { api_key: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN } =
        this.config.mailgun;

      if (!MAILGUN_API_KEY) report.errors.push("mailgun.api_key is required.");
      if (!MAILGUN_DOMAIN) report.errors.push("mailgun.domain is required.");
    }

    // OUTLOOK
    if (this.provider_priority.includes("OUTLOOK")) {
      if (this.config.outlook) {
        const { host, port, auth } = this.config.outlook;

        if (!host) report.errors.push("outlook.host is required.");
        if (!port) report.errors.push("outlook.port is required.");
        if (!auth?.user) report.errors.push("outlook.auth.user is required.");
        if (!auth?.pass) report.errors.push("outlook.auth.pass is required.");
      } else {
        report.errors.push("OUTLOOK is not configured properly.");
      }
    }

    // Resend
    if (this.provider_priority.includes("RESEND") && this.config.resend) {
      const { api_key: API_KEY } = this.config.resend;

      if (!API_KEY) report.errors.push("resend.api_key is required");
    }

    // SMTP
    if (this.provider_priority.includes("SMTP")) {
      if (this.config.smtp) {
        const { host, port, auth } = this.config.smtp;

        if (!host) report.errors.push("smtp.host is required.");
        if (!port) report.errors.push("smtp.port is required.");
        if (!auth?.user) report.errors.push("smtp.auth.user is required.");
        if (!auth?.pass) report.errors.push("smtp.auth.pass is required.");
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
      report.comment = "✅ Looks good!";
    } else {
      report.comment = "❌ Errors found in the configuration";
    }

    return report;
  }
}
