type EMAIL = {
    to: string | string[];
    from?: string;
    subject: string;
    body: string;
};
type PROVIDER = "RESEND" | "AWS_SES";
type CONFIG = {
    RESEND?: {
        API_KEY: string;
    };
    AWS_SES?: {
        REGION: string;
    };
};
type EMAIL_SENT_RESPONSE = {
    provider: PROVIDER;
    time: any;
    id?: string;
    email: EMAIL;
};

declare class MailBridge {
    private config;
    private provider_priority;
    private defaultFrom;
    private retryCount;
    constructor({ config, priority, defaultFrom, retryCount, }: {
        config: CONFIG;
        priority?: PROVIDER[];
        defaultFrom: string;
        retryCount?: number;
    });
    send(email: EMAIL, provider?: PROVIDER): Promise<EMAIL_SENT_RESPONSE>;
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
