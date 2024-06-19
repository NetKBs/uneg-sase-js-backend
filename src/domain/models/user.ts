import { z } from "zod";
import { studentSchema } from "./student";
import { teacherSchema } from "./teacher";
import { adminSchema } from "./admin";

export const userSchema = z.object({
	id: z.number(),
	username: z.string(),
	data: z.discriminatedUnion("role", [
		z
			.object({
				role: z.literal("student"),
			})
			.merge(studentSchema),
		z
			.object({
				role: z.literal("teacher"),
			})
			.merge(teacherSchema),
		z
			.object({
				role: z.literal("admin"),
			})
			.merge(adminSchema),
	]),
});

export type User = z.infer<typeof userSchema>;

export const dbUserSchema = userSchema.extend({
	password: z.string(),
});

export type DBUser = z.infer<typeof dbUserSchema>;
