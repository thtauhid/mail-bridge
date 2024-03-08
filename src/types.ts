export type EMAIL = {
  to: string | string[];
  from: string;
  subject: string;
  body: string;
};

export type PROVIDER = "RESEND" | "MAILGUN";

export type SECRETS = {
  RESEND_API_KEY?: string;
  MAILGUN_API_KEY?: string;
  MAILGUN_DOMAIN?: string;
};
