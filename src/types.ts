export type EMAIL = {
  to: string | string[];
  from?: string;
  subject: string;
  body: string;
};

export type PROVIDER = "RESEND" | "AWS_SES";

export type CONFIG = {
  RESEND?: {
    API_KEY: string;
  };
  AWS_SES?: {
    REGION: string;
    // TODO: Proper credentials to be added here
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
