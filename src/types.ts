export type EMAIL = {
  to: string | string[];
  from?: string;
  subject: string;
  text: string;
};

export type PROVIDER =
  | "resend"
  | "brevo"
  | "aws_ses"
  | "smtp"
  | "mailgun"
  | "gmail"
  | "outlook";

export type CONFIG = {
  aws_ses?: {
    region: string;
    // TODO: Proper credentials to be added here
  };
  brevo?: Transporter;
  gmail?: Transporter;
  mailgun?: {
    api_key: string;
    domain: string;
  };
  outlook?: Transporter;
  resend?: {
    api_key: string;
  };
  smtp?: Transporter;
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
