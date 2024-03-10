export type EMAIL = {
  to: string | string[];
  from?: string;
  subject: string;
  text: string;
};

export type PROVIDER = "RESEND" | "BREVO" | "AWS_SES" | "SMTP" | "MAILGUN";

export type CONFIG = {
  RESEND?: {
    API_KEY: string;
  };
  BREVO?: Transporter;
  AWS_SES?: {
    REGION: string;
    // TODO: Proper credentials to be added here
  };
  SMTP?: Transporter;
  MAILGUN?: {
    MAILGUN_API_KEY: string;
    MAILGUN_DOMAIN: string;
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

// SMTP
export type Transporter = {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
};
