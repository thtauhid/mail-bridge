type EMAIL = {
    to: string | string[];
    from?: string;
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
    private defaultFrom;
    /**
     * The number of times to retry sending an email.
     * Multiple retries are useful when the email provider is down.
     * Multiple providers need to be configured for this to work.
     */
    private retryCount;
    constructor({ providers, secrets, defaultFrom, retryCount, }: {
        providers: PROVIDER[];
        secrets: SECRETS;
        defaultFrom: string;
        retryCount?: number;
    });
    send(email: EMAIL, provider?: PROVIDER): Promise<never[] | undefined>;
    /**
     * Check the configuration of the MailBridge
     */
    checkConfig(): {
        providers: PROVIDER[];
        errors: string[];
        defaultFrom: string | undefined;
        comment: string;
    };
}

export { MailBridge };
