# Mail Bridge

## Description

Send email using any email provider.

## Email Providers

| Provider | Support              | Comment                               |
| -------- | -------------------- | ------------------------------------- |
| SMTP     | ✅                   | Uses nodemailer                       |
| Resend   | ✅                   | Uses official resend package          |
| Mailgun  | ✅                   | Uses official mailgun.js package      |
| Brevo    | ✅                   | Uses SMTP (nodemailer) under the hood |
| Gmail    | ✅                   | Uses SMTP (nodemailer) under the hood |
| Outlook  | ✅                   | Uses SMTP (nodemailer) under the hood |
| AWS SES  | Under Implementation |                                       |
| Mailjet  | Planned              |                                       |
| Loops    | Planned              |                                       |
| SendGrid | ❌                   | Didn't allow me to create an account. |

## Installation

```bash
npm install mail-bridge
```

## Usage

First, you need to import the `MailBridge` class.

```javascript
const { MailBridge } = require("mail-bridge"); // CommonJS
import { MailBridge } from "mail-bridge"; // ES6
```

Then, you need to create an instance of the `MailBridge` class.

```javascript
const mailBridge = new MailBridge({
  // First, you need to provide the configuration for the email providers.
  // You can provide the configuration for single or multiple providers.
  // Use environment variables or .env file to store sensitive information.
  config: {
    RESEND: {
      API_KEY: "1234",
    },
    AWS_SES: {
      REGION: "us-west-2",
    },
    BREVO: {
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: "user",
        pass: "pass",
      },
    },
    SMTP: {
      host: "smtp.example.com",
      port: 587,
      auth: {
        user: "user",
        pass: "pass",
      },
    },
    MAILGUN: {
      MAILGUN_API_KEY: "key-1234",
      MAILGUN_DOMAIN: "example.com",
    },
  },
  // Then, you need to provide the default "from" email address.
  defaultFrom: "info@example.com",
  // Optionally, you can provide the priority of the email providers (if you have configures multiple providers).
  priority: ["RESEND", "AWS_SES", "BREVO", "SMTP", "MAILGUN"],
});
```

Finally, you can send an email using the `send` method.

```javascript
// You can use async/await
const mail = await mailBridge.send({
  // "from" is optional. If not provided, the default "from" email address will be used.
  from: "sender-email",
  to: "recipient-email",
  subject: "Email Subject",
  text: "Email Body",
});

console.log(mail);
```

```javascript
// Or you can use Promise(.then, .catch, .finally)
mailBridge
  .send({
    // "from" is optional. If not provided, the default "from" email address will be used.
    from: "sender-email",
    to: "recipient-email",
    subject: "Email Subject",
    text: "Email Body",
  })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    console.log("done");
  });
```

## API

| Method      | Description                                    | Parameters                        | Returns                      |
| ----------- | ---------------------------------------------- | --------------------------------- | ---------------------------- |
| send        | Send an email                                  | email: EMAIL, provider?: PROVIDER | Promise<EMAIL_SENT_RESPONSE> |
| checkConfig | Check the configuration of MailBridge instance | -                                 | Configuration Details        |

## Type Definitions

```typescript
export type EMAIL = {
  to: string | string[];
  from?: string;
  subject: string;
  text: string;
};

export type PROVIDER = "RESEND" | "BREVO" | "AWS_SES" | "SMTP" | "MAILGUN";

export type CONFIG = {
  RESEND?: {
    API_KEY: string;
  };
  BREVO?: Transporter;
  AWS_SES?: {
    REGION: string;
  };
  SMTP?: Transporter;
  MAILGUN?: {
    MAILGUN_API_KEY: string;
    MAILGUN_DOMAIN: string;
  };
};

export type EMAIL_SENT_RESPONSE = {
  provider: PROVIDER;
  time: any; // Date time
  id?: string;
  email: EMAIL;
};

export type EMAIL_SENT_FAILURE = {
  provider: PROVIDER;
  time: any; // Date time
  error: string;
};

// SMTP
export type Transporter = {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
};
```

## Contributing

Contributions are welcome. Please open an issue or a pull request.
