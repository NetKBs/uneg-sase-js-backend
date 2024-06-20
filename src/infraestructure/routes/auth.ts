import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { authSchema } from "../validators/auth";
import { HTTPException } from "hono/http-exception";
import { ResponseStatus, createContextResponse } from "@/utils/createResponse";
import { userFinder } from "../dependencies";
import { sign } from "hono/jwt";
import { env } from "@/env";
import { setCookie } from "hono/cookie";

const auth = new Hono();

auth.post("/auth/login", zValidator("json", authSchema), async (c) => {
	const { username, password } = c.req.valid("json");

	const user = await userFinder.findByUsername(username);

	if (!user) {
		throw new HTTPException(ResponseStatus.UNAUTHORIZED, {
			message: "Invalid credentials",
		});
	}

	const matchPassword = await Bun.password
		.verify(password, user.password)
		.catch(() => false);

	if (!matchPassword) {
		throw new HTTPException(ResponseStatus.UNAUTHORIZED, {
			message: "Invalid credentials",
		});
	}

	const payload = {
		sub: user.id,
		exp: Math.floor(Date.now() / 1000) + 60 * 60,
	};

	const token = await sign(payload, env.JWT_SECRET);

	setCookie(c, "token", token);

	return createContextResponse(c, ResponseStatus.OK, {
		data: {
			token,
		},
	});
});

export default auth;
