import { z } from "zod";
import { personalDataSchema } from "./personalData";
import { contactDataSchema } from "./contactData";

export const teacherSchema = z.object({
	personalData: personalDataSchema,
	contactData: contactDataSchema,
});

export type Teacher = z.infer<typeof teacherSchema>;
