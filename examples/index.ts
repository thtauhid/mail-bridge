import { SuperSend } from "../src";

const superSend = new SuperSend(["RESEND"], {
  RESEND_API_KEY: "RESEND_API",
});

superSend.send({
  from: "hi@example.com",
  to: "abc@example.com",
  subject: "Hello, world!",
  body: "Hello, world!",
});
