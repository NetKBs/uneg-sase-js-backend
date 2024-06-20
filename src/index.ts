import { env } from "@/env";
import { Hono } from "hono";
import { logger } from "hono/logger";

import studentsRouter from "@/infraestructure/routes/students";
import authRouter from "@/infraestructure/routes/auth";
import { errorHandler } from "@/infraestructure/helpers/errorHandler";

const app = new Hono();

app.use("*", logger());

app.onError(errorHandler);
app.route("/", authRouter);
app.route("/", studentsRouter);

export default {
	port: env.PORT,
	fetch: app.fetch,
};
