import { MailBridge } from "../dist";

const config = {
  config: {
    BREVO: {
      host: process.env.BREVO_HOST!,
      port: Number(process.env.BREVO_PORT!),
      auth: {
        user: process.env.BREVO_USER!,
        pass: process.env.BREVO_PASS!,
      },
    },
  },
  defaultFrom: process.env.DEFAULT_FROM!,
};

const mailBridge = new MailBridge(config);

const x = mailBridge.send({
  to: process.env.DEFAULT_FROM!,
  subject: "Test Email",
  text: "Yo",
});

console.log(x);
