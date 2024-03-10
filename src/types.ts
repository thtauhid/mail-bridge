export type EMAIL = {
  to: string | string[];
  from?: string;
  subject: string;
  body: string;
};

export type PROVIDER = "RESEND";

export type SECRETS = {
  RESEND_API_KEY?: string;
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
