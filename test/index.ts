import { MailBridge } from "../src";
import { CONFIG, PROVIDER } from "../src/types";

import "dotenv/config";

const config: {
  config: CONFIG;
  priority?: PROVIDER[] | undefined;
  defaultFrom: string;
  retryCount?: number | undefined;
} = {
  config: {
    brevo: {
      host: process.env.BREVO_HOST!,
      port: Number(process.env.BREVO_PORT!),
      auth: {
        user: process.env.BREVO_USER!,
        pass: process.env.BREVO_PASS!,
      },
    },

    mailgun: {
      api_key: process.env.MAILGUN_API_KEY!,
      domain: process.env.MAILGUN_DOMAIN!,
    },

    resend: {
      api_key: process.env.RESEND_API_KEY!,
    },
  },
  // priority: ["mailgun", "gmail", "outlook"],
  defaultFrom: process.env.DEFAULT_FROM!,
  retryCount: 0,
};

const mailBridge = new MailBridge(config);

// mailBridge
//   .send(
//     {
//       to: process.env.DEFAULT_FROM!,
//       subject: "Test Email: Retry Function",
//       text: "Test Email: Retry Function",
//     },
//     { provider: "aws_ses" }
//   )
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.error(err);
//   })
//   .finally(() => {
//     console.log("done");
//   });

// const configCheck = mailBridge.checkConfig();

// console.log("Config check:");

// if (configCheck.errors.length > 0)
//   console.table({ errors: configCheck.errors });

// console.table({
//   providers: configCheck.providers,
// });

// console.table({
//   defaultFrom: configCheck.defaultFrom,
//   comment: configCheck.comment,
// });
