import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ResponseStatus, createResponse } from "@/utils/createResponse";
import { userCreator, userFinder } from "../dependencies";
import { createStudentSchema } from "../validators/users";
import { HTTPException } from "hono/http-exception";

const students = new Hono();

students.post(
	"/students",
	zValidator("json", createStudentSchema),
	async (c) => {
		const newStudentData = c.req.valid("json");

		const alreadyExistingUser = await userFinder.findByUsername(
			newStudentData.username,
		);

		if (alreadyExistingUser) {
			throw new HTTPException(ResponseStatus.CONFLICT, {
				message: "User already exists",
			});
		}

		const createdUser = await userCreator.createStudent(newStudentData);

		if (!createdUser) {
			throw new HTTPException(ResponseStatus.INTERNAL_SERVER_ERROR, {
				message: "An error occurred while creating the student",
			});
		}

		const { password, ...createdUserWithoutPassword } = createdUser;

		return createResponse(ResponseStatus.CREATED, {
			data: createdUserWithoutPassword,
		});
	},
);

students.get("/students/:id", async (c) => {
	const id = c.req.param("id");

	const numberId = parseInt(id);

	if (isNaN(numberId)) {
		throw new HTTPException(ResponseStatus.BAD_REQUEST, {
			message: "Invalid id",
		});
	}

	const user = await userFinder.findById(numberId);

	if (!user || user.data.role !== "student") {
		throw new HTTPException(ResponseStatus.NOT_FOUND, {
			message: "Student not found",
		});
	}

	return createResponse(ResponseStatus.OK, {
		data: user,
	});
});

export default students;
