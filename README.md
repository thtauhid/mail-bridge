# Mail Bridge

## Description

Send email using any email provider.
Currently under development.

## Email Providers

| Provider | Support              | Comment                                                        |
| -------- | -------------------- | -------------------------------------------------------------- |
| Resend   | ✅                   |                                                                |
| Brevo    | ✅                   |                                                                |
| AWS SES  | Under Implementation |                                                                |
| Loops    | Planned              |                                                                |
| Gmail    | Planned              |                                                                |
| Mailgun  | ⚠️                   | Doesn't have a free plan. So, can't test. Maybe in the future. |
| SendGrid | ❌                   | Didn't allow me to create an account.                          |

## Installation

```bash
npm install mail-bridge
```

## Usage

First, you need to import the `MailBridge` class.

```javascript
const MailBridge = require("mail-bridge"); // CommonJS
import { MailBridge } from "mail-bridge"; // ES6
```

Then, you need to create an instance of the `MailBridge` class.

```javascript
const mailBridge = new MailBridge({
  // First, you need to provide the configuration for the email providers.
  // You can provide the configuration for single or multiple providers.
  config: {
    RESEND: {
      API_KEY: "1234",
    },
    AWS_SES: {
      REGION: "us-west-2",
    },
  },
  // Then, you need to provide the default "from" email address.
  defaultFrom: "info@example.com",
  // Optionally, you can provide the priority of the email providers (if you have configures multiple providers).
  priority: ["RESEND", "AWS_SES"],
});
```

Finally, you can send an email using the `send` method.

```javascript
mailBridge.send({
  // "from" is optional. If not provided, the default "from" email address will be used.
  from: "sender-email",
  to: "recipient-email",
  subject: "Email Subject",
  text: "Email Body",
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
  body: string;
};

export type PROVIDER = "RESEND" | "AWS_SES";

export type CONFIG = {
  RESEND?: {
    API_KEY: string;
  };
  AWS_SES?: {
    REGION: string;
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
```

## Contributing

Contributions are welcome. Please open an issue or a pull request.
