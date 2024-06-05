import { Context } from "hono";
import { ResponseStatus, createResponse } from "./createResponse";
import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";

const getStatus = (status: StatusCode): ResponseStatus => {
	switch (status) {
		case 200:
			return ResponseStatus.OK;
		case 201:
			return ResponseStatus.CREATED;
		case 204:
			return ResponseStatus.NO_CONTENT;
		case 400:
			return ResponseStatus.BAD_REQUEST;
		case 401:
			return ResponseStatus.UNAUTHORIZED;
		case 403:
			return ResponseStatus.FORBIDDEN;
		case 404:
			return ResponseStatus.NOT_FOUND;
		case 409:
			return ResponseStatus.CONFLICT;
		case 500:
			return ResponseStatus.INTERNAL_SERVER_ERROR;
		case 503:
			return ResponseStatus.SERVICE_UNAVAILABLE;
		default:
			return ResponseStatus.INTERNAL_SERVER_ERROR;
	}
};

const getName = (status: StatusCode): string => {
	switch (status) {
		case 200:
			return "OK";
		case 201:
			return "Created";
		case 204:
			return "No Content";
		case 400:
			return "Bad Request";
		case 401:
			return "Unauthorized";
		case 403:
			return "Forbidden";
		case 404:
			return "Not Found";
		case 409:
			return "Conflict";
		case 500:
			return "Internal Server Error";
		case 503:
			return "Service Unavailable";
		default:
			return "Internal Server Error";
	}
};

export const errorHandler = (
	error: Error,
	_c: Context,
): Response | Promise<Response> => {
	if (!(error instanceof HTTPException)) {
		return createResponse(ResponseStatus.INTERNAL_SERVER_ERROR, {
			data: null,
			error: {
				status: ResponseStatus.INTERNAL_SERVER_ERROR,
				name: "Internal Server Error",
				message: "Internal Server Error",
			},
		});
	}

	return createResponse(getStatus(error.status), {
		data: null,
		error: {
			status: getStatus(error.status),
			name: getName(error.status),
			message: error.message,
		},
	});
};
