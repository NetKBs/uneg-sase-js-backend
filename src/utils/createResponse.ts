import { Context } from "hono";

export enum ResponseStatus {
	OK = 200,
	CREATED = 201,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	CONFLICT = 409,
	INTERNAL_SERVER_ERROR = 500,
	SERVICE_UNAVAILABLE = 503,
}

interface Meta {}

interface Error {
	status: ResponseStatus;
	name: string;
	message?: string;
}

interface Body {
	data: any;
	meta?: Meta;
	error?: Error;
}

export const createResponse = (
	status: ResponseStatus,
	body: Body,
): Response => {
	return new Response(
		JSON.stringify({
			data: body.data,
			meta: body.meta || {},
			error: body.error || null,
		}),
		{
			status,
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
};

export const createContextResponse = (
	c: Context,
	status: ResponseStatus,
	body: Body,
) => {
	c.status(status);
	return c.json(body);
};
