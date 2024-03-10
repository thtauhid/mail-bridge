import { CONFIG, EMAIL, EMAIL_SENT_RESPONSE } from "../types";
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";

export const sendEmail_AWS_SES = async (
  email: EMAIL,
  config: CONFIG["AWS_SES"]
): Promise<EMAIL_SENT_RESPONSE> => {
  const sesClient = new SESClient({ region: config?.REGION });
  let to_address: string[]; // Array of email addresses

  if (typeof email.to === "string") {
    to_address = [email.to];
  } else {
    to_address = email.to;
  }

  const sendEmailCommand = new SendEmailCommand({
    Destination: {
      ToAddresses: to_address,
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: email.body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: email.subject,
      },
    },
    Source: email.from,
  });

  try {
    const data = await sesClient.send(sendEmailCommand);
    return {
      provider: "AWS_SES",
      time: new Date(),
      id: data.MessageId,
      email,
    };
  } catch (error) {
    console.log(error);

    const msg = {
      provider: "AWS_SES",
      time: new Date(),
      error: error,
    };

    throw new Error(JSON.stringify(msg));
  }
};
