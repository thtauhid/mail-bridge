type EMAIL = {
  to: string | string[];
  from: string;
  subject: string;
  body: string;
};
type PROVIDER = "RESEND" | "MAILGUN";
type SECRETS = {
  RESEND_API_KEY?: string;
  MAILGUN_API_KEY?: string;
  MAILGUN_DOMAIN?: string;
};

declare class MailBridge {
  private providers;
  private secrets;
  constructor(providers: PROVIDER[], secrets: SECRETS);
  send(email: EMAIL, provider?: PROVIDER): Promise<never[] | undefined>;
}

export { MailBridge };
