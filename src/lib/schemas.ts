import { z } from "zod";

// Shared validation for the contact enquiry form (used on the page and the server).
export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(100, "Please keep your name under 100 characters"),
  email: z.string().trim().email("That email address doesn't look quite right").max(255, "Please keep your email under 255 characters"),
  topic: z.enum(["family", "supporter", "partner", "other"], { message: "Please choose what best describes you" }),
  message: z.string().trim().min(10, "Please write a little more so we can help (at least 10 characters)").max(1000, "Please keep your message under 1000 characters"),
});

export type Enquiry = z.infer<typeof enquirySchema>;

export const TOPIC_LABELS: Record<Enquiry["topic"], string> = {
  family: "A family looking for support",
  supporter: "A supporter wanting to help",
  partner: "A fundraising partner or business",
  other: "Something else",
};

// Validation for the AI support matcher.
export const supportRequestSchema = z.object({
  situation: z.string().trim().min(20, "Please tell us a little more (at least 20 characters)").max(1500, "Please keep it under 1500 characters"),
});

export type SupportRequest = z.infer<typeof supportRequestSchema>;
