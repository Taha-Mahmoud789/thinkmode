"use server";

export interface ContactFormState {
  status: "idle" | "success" | "error" | "invalid";
  message: string;
}

/**
 * Contact form backend. Stores submissions server-side (log for now) —
 * connect an email service or ticketing system in deliverToInbox().
 */
export async function sendContactAction(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const topic = String(formData.get("topic") ?? "general");
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return {
      status: "invalid",
      message: "Please fill in your name, email, and message.",
    };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { status: "invalid", message: "That email address doesn't look right." };
  }
  if (message.length > 5000) {
    return { status: "invalid", message: "Message is too long (5000 character limit)." };
  }

  try {
    // Deliver via your mail provider / helpdesk here.
    console.info(`[contact] ${topic} from ${name} <${email}>: ${message.slice(0, 120)}…`);
    return {
      status: "success",
      message: "Message received — we'll get back to you soon.",
    };
  } catch (error) {
    console.error("[contact] delivery failed:", error);
    return {
      status: "error",
      message: "Couldn't send your message. Please try again shortly.",
    };
  }
}
