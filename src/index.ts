import { Hono } from "hono";
import { logger } from "hono/logger";

import studentsRouter from "@/infraestructure/routes/students";
import { errorHandler } from "./utils/errorHandler";

const app = new Hono();

app.use("*", logger());

app.onError(errorHandler);
app.route("/", studentsRouter);

export default {
	port: 5000,
	fetch: app.fetch,
};
