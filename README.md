# Mail Bridge

## Description

Send email using any email provider.

## Features

- Send email using multiple email providers.
- Automatically switch to the next provider if the current provider fails.
- Simple and easy to use API.
- Set the priority of the email providers.

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
| SendGrid | ❌                   |                                       |

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
    // AWS SES
    aws_ses: {
      region: "us-west-2",
    },
    // Brevo
    brevo: {
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: "user",
        pass: "pass",
      },
    },
    // Gmail
    gmail: {
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "user",
        pass: "pass",
      },
    },
    // Mailgun
    mailgun: {
      api_key: "key-1234",
      domain: "example.com",
    },
    // Resend
    resend: {
      api_key: "1234",
    },
    // Outlook
    outlook: {
      host: "smtp-mail.outlook.com",
      port: 587,
      auth: {
        user: "user",
        pass: "pass",
      },
    },
    // SMTP
    smtp: {
      host: "smtp.example.com",
      port: 587,
      auth: {
        user: "user",
        pass: "pass",
      },
    },
  },

  // Then, you need to provide the default "from" email address.
  defaultFrom: "info@example.com",

  // Optionally, you can provide the priority of the email providers (if you have configures multiple providers).
  // You don't need to provide the priority if you have configured only one provider.
  // It's not mandatory to provide the priority of all the providers.
  // If you don't provide the priority of a provider, it will be considered as the lowest priority.
  priority: ["resend", "brevo", "aws_ses", "smtp", "mailgun"],

  // Optionally, you can provide the default retry count for all the emails.
  // If you don't provide the retry count, the numbers of providers
  // defined in the 'config' will be used as the default retry count.
  retryCount: 3,
});
```

Finally, you can send an email using the `send` method.

```javascript
// You can use async/await
const mail = await mailBridge.send(
  {
    // "from" is optional. If not provided, the default "from" email address will be used.
    from: "sender-email",
    to: "recipient-email",
    subject: "Email Subject",
    text: "Email Body",
  },
  // Optionally you can pass a provider and rety count as the second parameter
  {
    provider: "resend", // Optional. Puts the provider in the first priority.
    retryCount: 3, // Optional. Overrides the default retry count for the specific email.
  }
);

console.log(mail);
```

```javascript
// Or you can use Promise(.then, .catch, .finally)
mailBridge
  .send(
    {
      // "from" is optional. If not provided, the default "from" email address will be used.
      from: "sender-email",
      to: "recipient-email",
      subject: "Email Subject",
      text: "Email Body",
    },
    // Optionally you can pass a provider and rety count as the second parameter
    {
      provider: "resend", // Optional. Puts the provider in the first priority.
      retryCount: 3, // Optional. Overrides the default retry count for the specific email.
    }
  )
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

## Type Definitions

```typescript
export type EMAIL = {
  to: string | string[];
  from?: string;
  subject: string;
  text: string;
};

export type PROVIDER =
  | "aws_ses"
  | "brevo"
  | "gmail"
  | "mailgun"
  | "outlook"
  | "resend"
  | "smtp";

export type CONFIG = {
  aws_ses?: {
    region: string;
  };
  brevo?: Transporter;
  gmail?: Transporter;
  mailgun?: {
    api_key: string;
    domain: string;
  };
  outlook?: Transporter;
  resend?: {
    api_key: string;
  };
  smtp?: Transporter;
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
