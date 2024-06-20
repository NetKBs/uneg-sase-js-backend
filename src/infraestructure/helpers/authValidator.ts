import { UserFinder } from "@/application/userFinder";
import { DBUser } from "@/domain/models/user";
import { Context } from "hono";
import { env } from "@/env";
import { verify } from "hono/jwt";
import { getCookie } from "hono/cookie";
import { ResponseStatus } from "@/utils/createResponse";
import { HTTPException } from "hono/http-exception";

type UserRole = DBUser["data"]["role"];
type DBUserWithRole<T> = DBUser & {
	data: {
		role: T;
	};
};

export const authValidator = async <T extends UserRole>(
	userFinder: UserFinder,
	c: Context,
	role?: T,
): Promise<DBUserWithRole<T>> => {
	const token = getCookie(c, "token");

	if (!token) {
		throw new HTTPException(ResponseStatus.UNAUTHORIZED, {
			message: "Token not found",
		});
	}

	const decoded = await verify(token, env.JWT_SECRET).catch(() => {
		throw new HTTPException(ResponseStatus.UNAUTHORIZED, {
			message: "Invalid token",
		});
	});

	const id = decoded.sub as number;

	const user = await userFinder.findById(id);

	if (!user) {
		throw new HTTPException(ResponseStatus.UNAUTHORIZED, {
			message: "Unauthorized",
		});
	}

	if (user.data.role !== role) {
		throw new HTTPException(ResponseStatus.UNAUTHORIZED, {
			message: `You must be a ${role} to perform this action`,
		});
	}

	return user as DBUserWithRole<T>;
};
