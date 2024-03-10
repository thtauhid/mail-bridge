export type EMAIL = {
  to: string | string[];
  from?: string;
  subject: string;
  text: string;
};

export type PROVIDER =
  | "RESEND"
  | "BREVO"
  | "AWS_SES"
  | "SMTP"
  | "MAILGUN"
  | "GMAIL"
  | "OUTLOOK";

export type CONFIG = {
  AWS_SES?: {
    REGION: string;
    // TODO: Proper credentials to be added here
  };
  BREVO?: Transporter;
  GMAIL?: Transporter;
  MAILGUN?: {
    MAILGUN_API_KEY: string;
    MAILGUN_DOMAIN: string;
  };
  OUTLOOK?: Transporter;
  RESEND?: {
    API_KEY: string;
  };
  SMTP?: Transporter;
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
