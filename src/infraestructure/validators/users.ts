import { academicDataSchema } from "@/domain/models/academicData";
import { contactDataSchema } from "@/domain/models/contactData";
import { personalDataSchema } from "@/domain/models/personalData";
import { z } from "zod";

export const createStudentSchema = z.object({
	username: z.string(),
	password: z.string(),
	data: z.object({
		personalData: personalDataSchema,
		contactData: contactDataSchema.omit({ universityEmail: true }),
		academicData: academicDataSchema.pick({
			campus: true,
			career: true,
		}),
	}),
});
