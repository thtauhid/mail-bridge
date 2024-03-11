import { sendEmail } from "./sendEmail";
import { EMAIL, PROVIDER, CONFIG, EMAIL_SENT_RESPONSE } from "./types";

export const processEmail = async (
  email: EMAIL,
  config: CONFIG,
  provider_priority: PROVIDER[]
): Promise<EMAIL_SENT_RESPONSE> => {
  // Get the next provider
  const provider = provider_priority.shift();

  if (!provider) throw new Error("No providers provided");

  // Send the email
  try {
    const response = await sendEmail(email, config, provider);
    return response;
  } catch (error) {
    // If there are no more providers, throw the error
    if (provider_priority.length === 0) {
      throw new Error("All providers failed to send email");
    }

    // Try the next provider
    return await processEmail(email, config, provider_priority);
  }
};
