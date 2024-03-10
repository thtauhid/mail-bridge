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
    // BREVO: {
    //   host: process.env.BREVO_HOST!,
    //   port: Number(process.env.BREVO_PORT!),
    //   auth: {
    //     user: process.env.BREVO_USER!,
    //     pass: process.env.BREVO_PASS!,
    //   },
    // },
    MAILGUN: {
      MAILGUN_API_KEY: process.env.MAILGUN_API_KEY!,
      MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN!,
    },
  },
  defaultFrom: process.env.DEFAULT_FROM!,
};

const mailBridge = new MailBridge(config);

mailBridge
  .send({
    to: process.env.DEFAULT_FROM!,
    subject: "Test Email 2",
    text: "Test email 2",
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
