type EMAIL = {
    to: string | string[];
    from?: string;
    subject: string;
    body: string;
};
type PROVIDER = "RESEND";
type SECRETS = {
    RESEND_API_KEY?: string;
};
type EMAIL_SENT_RESPONSE = {
    provider: PROVIDER;
    time: any;
    id?: string;
    email: EMAIL;
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
    send(email: EMAIL, provider?: PROVIDER): Promise<EMAIL_SENT_RESPONSE>;
    /**
     * Check the configuration of the MailBridge
     */
    checkConfig(): {
        providers: "RESEND"[];
        errors: string[];
        defaultFrom: string | undefined;
        comment: string;
    };
}

export { MailBridge };
