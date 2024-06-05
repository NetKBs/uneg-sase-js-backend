import { z } from "zod";

export const subjectSchema = z.object({
	id: z.number(),
	code: z.number(),
	name: z.string(),
	cu: z.number(),
});

export type Subject = z.infer<typeof subjectSchema>;

export const careerSubjectSchema = subjectSchema.extend({
	career: z.boolean(),
	semester: z.number(),
	needed: subjectSchema.array(),
});

export type CareerSubject = z.infer<typeof careerSubjectSchema>;

export const studentSubjectSchema = subjectSchema.extend({});

export type StudentSubject = z.infer<typeof studentSubjectSchema>;
