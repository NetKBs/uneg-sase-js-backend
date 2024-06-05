import { z } from "zod";

export const personalDataSchema = z.object({
	ic: z.string(),
	name: z.string(),
	secondName: z.string(),
	lastName: z.string(),
	secondLastName: z.string(),
	gender: z.enum(["male", "female"]),
	maritalStatus: z.enum(["single", "married", "divorced", "widowed"]),
	birthDate: z.string().date(),
	birthCountry: z.string(),
	birthState: z.string(),
	birthCity: z.string(),
});

export type PersonalData = z.infer<typeof personalDataSchema>;
