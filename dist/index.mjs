var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) =>
      x.done
        ? resolve(x.value)
        : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/providers/resend.ts
import { Resend } from "resend";
var sendEmail_RESEND = (email, api_key) =>
  __async(void 0, null, function* () {
    try {
      const resend = new Resend(api_key);
      const data = yield resend.emails.send({
        from: email.from,
        to: email.to,
        subject: email.subject,
        html: email.body,
      });
      console.log(data);
      return [];
    } catch (error) {
      console.error(error);
    }
  });

// src/sendEmail.ts
var sendEmail = (email, provider, secrets) =>
  __async(void 0, null, function* () {
    switch (provider) {
      case "RESEND":
        return yield sendEmail_RESEND(email, secrets.RESEND_API_KEY);
    }
  });

// src/index.ts
var MailBridge = class {
  constructor(providers, secrets) {
    this.providers = providers;
    if (
      providers.includes("RESEND") &&
      !(secrets == null ? void 0 : secrets.RESEND_API_KEY)
    ) {
      throw new Error(
        "RESEND_API_KEY is required. Pass it in the secrets object when initializing MailBridge"
      );
    }
    this.secrets = secrets;
    console.log("MailBridge initialized");
  }
  send(email, provider) {
    return __async(this, null, function* () {
      if (!provider) {
        return yield sendEmail(email, this.providers[0], this.secrets);
      }
      return yield sendEmail(email, provider, this.secrets);
    });
  }
};
export { MailBridge };
