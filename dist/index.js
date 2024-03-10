"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
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
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  MailBridge: () => MailBridge
});
module.exports = __toCommonJS(src_exports);

// src/providers/resend.ts
var import_resend = require("resend");
var sendEmail_RESEND = (email, api_key) => __async(void 0, null, function* () {
  try {
    const resend = new import_resend.Resend(api_key);
    const data = yield resend.emails.send({
      from: email.from,
      to: email.to,
      subject: email.subject,
      html: email.body
    });
    console.log(data);
    return [];
  } catch (error) {
    console.error(error);
  }
});

// src/sendEmail.ts
var sendEmail = (email, provider, secrets) => __async(void 0, null, function* () {
  switch (provider) {
    case "RESEND":
      return yield sendEmail_RESEND(email, secrets.RESEND_API_KEY);
  }
});

// src/index.ts
var MailBridge = class {
  constructor({
    providers,
    secrets,
    defaultFrom,
    retryCount
  }) {
    this.providers = providers;
    this.defaultFrom = defaultFrom;
    this.retryCount = retryCount || 0;
    if (providers.includes("RESEND") && !(secrets == null ? void 0 : secrets.RESEND_API_KEY)) {
      throw new Error(
        "RESEND_API_KEY is required. Pass it in the secrets object when initializing MailBridge"
      );
    }
    this.secrets = secrets;
    console.log("MailBridge initialized");
  }
  send(email, provider) {
    return __async(this, null, function* () {
      if (!email.from) {
        email.from = this.defaultFrom;
      }
      if (!provider) {
        return yield sendEmail(email, this.providers[0], this.secrets);
      }
      return yield sendEmail(email, provider, this.secrets);
    });
  }
  /**
   * Check the configuration of the MailBridge
   */
  checkConfig() {
    let report = {
      providers: Array(),
      errors: Array(),
      defaultFrom: void 0,
      comment: ""
    };
    for (let provider of this.providers) {
      report.providers.push(provider);
    }
    if (this.providers.includes("RESEND") && !this.secrets.RESEND_API_KEY) {
      report.errors.push("RESEND_API_KEY is required");
    }
    if (this.providers.includes("MAILGUN") && !this.secrets.MAILGUN_API_KEY) {
      report.errors.push("MAILGUN_API_KEY is required");
    }
    if (this.providers.includes("MAILGUN") && !this.secrets.MAILGUN_DOMAIN) {
      report.errors.push("MAILGUN_DOMAIN is required");
    }
    if (!this.defaultFrom) {
      report.errors.push("Default from address is not configured");
    } else {
      if (!this.defaultFrom.includes("@")) {
        report.errors.push("Default from address is not a valid email address");
      }
      report.defaultFrom = this.defaultFrom;
    }
    if (this.retryCount < 0) {
      report.errors.push("Retry count cannot be negative");
    }
    if (report.errors.length === 0) {
      report.comment = "MailBridge seems to be configured correctly";
    } else {
      report.comment = "MailBridge has some configuration errors";
    }
    return report;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MailBridge
});
