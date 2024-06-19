import { z } from "zod";
import { personalDataSchema } from "./personalData";
import { contactDataSchema } from "./contactData";

export const adminSchema = z.object({
	personalData: personalDataSchema,
	contactData: contactDataSchema,
});

export type Admin = z.infer<typeof adminSchema>;
