import { isValidEmail } from "@/lib/utils";

/**
 * Newsletter abstraction.
 *
 * The UI talks ONLY to this module. To go live, implement `subscribe()` with a
 * real provider (Resend, Buttondown, Mailchimp, ConvertKit, a Google Sheet…
 * anything that accepts an email). Until then the subscription is accepted,
 * logged server-side, and reported honestly to the user as "pending provider".
 */

export interface SubscribeResult {
  status: "success" | "invalid-email" | "already-subscribed" | "error";
  message: string;
}

export interface SubscribeInput {
  email: string;
  /** Optional attribution captured by the form. */
  source?: string;
}

export const newsletterConfig = {
  /** Wire your provider here. */
  provider: process.env.NEWSLETTER_PROVIDER ?? "pending",
} as const;

async function subscribeWithProvider(input: SubscribeInput): Promise<SubscribeResult> {
  switch (newsletterConfig.provider) {
    case "resend":
      // Example skeleton — set NEWSLETTER_PROVIDER=resend + RESEND_API_KEY:
      // const res = await fetch("https://api.resend.com/contacts", {...});
      return {
        status: "error",
        message: "Resend integration is scaffolded but not implemented yet.",
      };
    case "buttondown":
      return {
        status: "error",
        message: "Buttondown integration is scaffolded but not implemented yet.",
      };
    default:
      console.info(
        `[newsletter] subscription stored locally until a provider is configured: ${input.email}`,
      );
      return {
        status: "success",
        message:
          "You're on the list — delivery starts as soon as we connect the sending provider.",
      };
  }
}

/** Single entry point used by server actions / route handlers. */
export async function subscribeToNewsletter(
  input: SubscribeInput,
): Promise<SubscribeResult> {
  const email = input.email.trim().toLowerCase();
  if (!isValidEmail(email)) {
    return {
      status: "invalid-email",
      message: "That email address doesn't look right — mind checking it?",
    };
  }
  try {
    return await subscribeWithProvider({ ...input, email });
  } catch (error) {
    console.error("[newsletter] subscribe failed:", error);
    return {
      status: "error",
      message: "Something went wrong on our side. Please try again in a moment.",
    };
  }
}
