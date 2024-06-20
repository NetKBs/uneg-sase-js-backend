import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	PORT: z.string().transform((s) => Number(s)),
	JWT_SECRET: z.string().min(1),
});

export const env = envSchema.parse(process.env);
