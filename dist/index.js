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

// src/providers/aws.ts
var import_client_ses = require("@aws-sdk/client-ses");
var sendEmail_AWS_SES = (email, config) => __async(void 0, null, function* () {
  const sesClient = new import_client_ses.SESClient({ region: config == null ? void 0 : config.REGION });
  let to_address;
  if (typeof email.to === "string") {
    to_address = [email.to];
  } else {
    to_address = email.to;
  }
  const sendEmailCommand = new import_client_ses.SendEmailCommand({
    Destination: {
      ToAddresses: to_address
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: email.body
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: email.subject
      }
    },
    Source: email.from
  });
  try {
    const data = yield sesClient.send(sendEmailCommand);
    return {
      provider: "AWS_SES",
      time: /* @__PURE__ */ new Date(),
      id: data.MessageId,
      email
    };
  } catch (error) {
    console.log(error);
    const msg = {
      provider: "AWS_SES",
      time: /* @__PURE__ */ new Date(),
      error
    };
    throw new Error(JSON.stringify(msg));
  }
});

// src/providers/resend.ts
var import_resend = require("resend");
var sendEmail_RESEND = (email, config) => __async(void 0, null, function* () {
  var _a;
  try {
    const resend = new import_resend.Resend(config == null ? void 0 : config.API_KEY);
    const data = yield resend.emails.send({
      from: email.from,
      to: email.to,
      subject: email.subject,
      html: email.body
    });
    return {
      provider: "RESEND",
      time: /* @__PURE__ */ new Date(),
      id: (_a = data.data) == null ? void 0 : _a.id,
      email
    };
  } catch (error) {
    console.log(error);
    const msg = {
      provider: "RESEND",
      time: /* @__PURE__ */ new Date(),
      error
    };
    throw new Error(JSON.stringify(msg));
  }
});

// src/sendEmail.ts
var sendEmail = (email, provider, config) => __async(void 0, null, function* () {
  switch (provider) {
    case "RESEND":
      return yield sendEmail_RESEND(email, config.RESEND);
    case "AWS_SES":
      return yield sendEmail_AWS_SES(email, config.AWS_SES);
  }
});

// src/index.ts
var MailBridge = class {
  constructor({
    config,
    priority,
    defaultFrom,
    retryCount
  }) {
    this.config = config;
    this.defaultFrom = defaultFrom;
    if (priority) {
      this.provider_priority = priority;
    } else {
      this.provider_priority = Object.keys(config);
    }
    this.retryCount = retryCount || 0;
    console.log("MailBridge initialized");
  }
  send(email, provider) {
    return __async(this, null, function* () {
      if (!email.from) {
        email.from = this.defaultFrom;
      }
      if (!provider) {
        return yield sendEmail(email, this.provider_priority[0], this.config);
      }
      return yield sendEmail(email, provider, this.config);
    });
  }
  /**
   * Check the configuration of the MailBridge
   */
  checkConfig() {
    var _a, _b;
    let report = {
      providers: Array(),
      errors: Array(),
      defaultFrom: void 0,
      comment: ""
    };
    for (let provider of this.provider_priority) {
      report.providers.push(provider);
    }
    if (this.provider_priority.includes("RESEND") && !((_a = this.config.RESEND) == null ? void 0 : _a.API_KEY)) {
      report.errors.push("RESEND.API_KEY is required");
    }
    if (this.provider_priority.includes("AWS_SES") && !((_b = this.config.AWS_SES) == null ? void 0 : _b.REGION)) {
      report.errors.push("AWS_SES.REGION is required");
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
