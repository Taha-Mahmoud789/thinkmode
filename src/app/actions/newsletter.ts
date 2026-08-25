"use server";

import { subscribeToNewsletter } from "@/lib/newsletter";

export interface NewsletterFormState {
  status: "idle" | "success" | "invalid-email" | "already-subscribed" | "error";
  message: string;
}

export const initialNewsletterState: NewsletterFormState = {
  status: "idle",
  message: "",
};

/** Server action backing every newsletter form on the site. */
export async function subscribeAction(
  _prev: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  const email = String(formData.get("email") ?? "");
  const source = String(formData.get("source") ?? "site");

  if (!email) {
    return {
      status: "invalid-email",
      message: "Please enter your email address.",
    };
  }

  const result = await subscribeToNewsletter({ email, source });
  return { status: result.status, message: result.message };
}
