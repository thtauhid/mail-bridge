import { processEmail } from "./processEmail";
import { EMAIL, PROVIDER, CONFIG } from "./types";

export class MailBridge {
  private config: CONFIG;
  private provider_priority: PROVIDER[];
  private defaultFrom: string;
  private retryCount: number;

  constructor({
    config,
    defaultFrom,
    priority,
    retryCount,
  }: {
    config: CONFIG;
    defaultFrom: string;
    priority?: PROVIDER[];
    retryCount?: number;
  }) {
    this.config = config;
    this.defaultFrom = defaultFrom;

    // If the user has provided a priority list
    if (priority) {
      // Filter out the providers that are not valid
      this.provider_priority = priority.filter((provider) =>
        Object.keys(config).includes(provider)
      );

      // If the length of the priority list is not the same as the length of the config object
      // then add the missing providers to the priority list
      if (this.provider_priority.length !== Object.keys(config).length) {
        // Find out the missing providers
        const allProviders = Object.keys(config);
        const missingProviders = allProviders.filter(
          (provider) => !this.provider_priority.includes(provider as PROVIDER)
        ) as PROVIDER[];

        // Add the missing providers to the priority list
        this.provider_priority =
          this.provider_priority.concat(missingProviders);
      }
    } else {
      // If the user has not provided a priority list
      // then use all the providers in the config object
      this.provider_priority = Object.keys(config) as PROVIDER[];
    }

    // Update the retry count
    this.retryCount = retryCount || this.provider_priority.length;
    // if the retry count is zero update it properly
    if (retryCount === 0) this.retryCount = 0;

    console.log("MailBridge initialized");
  }

  async send(
    email: EMAIL,
    { provider, retryCount }: { provider?: PROVIDER; retryCount?: number }
  ) {
    // Check if user has provided a "from" field
    if (!email.from) {
      email.from = this.defaultFrom;
    }

    // If user has provided a provider, use that
    // If the provider exists in priority list, move it to the front
    if (provider && this.provider_priority.includes(provider)) {
      // Remove the provider from the priority list
      this.provider_priority = this.provider_priority.filter(
        (p) => p !== provider
      );

      // Add the provider to the front of the priority list
      this.provider_priority.unshift(provider);
    }

    // Limit the number of items in the priority list based on the retry count
    if (retryCount) {
      this.provider_priority = this.provider_priority.slice(0, retryCount + 1);
    } else if (retryCount === 0) {
      this.provider_priority = this.provider_priority.slice(0, 1);
    } else if (this.retryCount === 0) {
      this.provider_priority = this.provider_priority.slice(0, 1);
    } else {
      this.provider_priority = this.provider_priority.slice(
        0,
        this.retryCount + 1
      );
    }

    // If the user has not provided a provider
    // Or the provider does not exist in priority list,
    // the default provider will be used
    return await processEmail(email, this.config, this.provider_priority);
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
    if (this.provider_priority.includes("aws_ses") && this.config.aws_ses) {
      const { region: REGION } = this.config.aws_ses;

      if (!REGION) report.errors.push("aws_ses.region is required");
    }

    // Brevo
    if (this.provider_priority.includes("brevo") && this.config.brevo) {
      const { host, port, auth } = this.config.brevo;

      if (!host) report.errors.push("brevo.host is required.");
      if (!port) report.errors.push("brevo.port is required.");
      if (!auth?.user) report.errors.push("brevo.auth.user is required.");
      if (!auth?.pass) report.errors.push("brevo.auth.pass is required.");
    }

    // GMAIL
    if (this.provider_priority.includes("gmail") && this.config.gmail) {
      const { host, port, auth } = this.config.gmail;

      if (!host) report.errors.push("gmail.host is required.");
      if (!port) report.errors.push("gmail.port is required.");
      if (!auth?.user) report.errors.push("gmail.auth.user is required.");
      if (!auth?.pass) report.errors.push("gmail.auth.pass is required.");
    }

    // MAILGUN
    if (this.provider_priority.includes("mailgun") && this.config.mailgun) {
      const { api_key: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN } =
        this.config.mailgun;

      if (!MAILGUN_API_KEY) report.errors.push("mailgun.api_key is required.");
      if (!MAILGUN_DOMAIN) report.errors.push("mailgun.domain is required.");
    }

    // OUTLOOK
    if (this.provider_priority.includes("outlook")) {
      if (this.config.outlook) {
        const { host, port, auth } = this.config.outlook;

        if (!host) report.errors.push("outlook.host is required.");
        if (!port) report.errors.push("outlook.port is required.");
        if (!auth?.user) report.errors.push("outlook.auth.user is required.");
        if (!auth?.pass) report.errors.push("outlook.auth.pass is required.");
      } else {
        report.errors.push("outlook is not configured properly.");
      }
    }

    // Resend
    if (this.provider_priority.includes("resend") && this.config.resend) {
      const { api_key: API_KEY } = this.config.resend;

      if (!API_KEY) report.errors.push("resend.api_key is required");
    }

    // SMTP
    if (this.provider_priority.includes("smtp")) {
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
