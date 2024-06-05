import { z } from "zod";

export const contactDataSchema = z.object({
	email: z.string(),
	alternativeEmail: z.string().optional(),
	universityEmail: z.string().optional(),
	phoneNumber: z.string(),
	alternativePhoneNumber: z.string().optional(),
	houseAddress: z.string(),
	workAddress: z.string().optional(),
});

export type ContactData = z.infer<typeof contactDataSchema>;
