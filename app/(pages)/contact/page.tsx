import type { Metadata } from "next";
import ContactPageClient from "./_ContactClient";

export const metadata: Metadata = {
  title: "Contact — Let's Talk About What's Next",
  description:
    "Get in touch with CREOIT. Tell us what you're trying to build — branding, content, performance marketing, events or growth strategy.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
