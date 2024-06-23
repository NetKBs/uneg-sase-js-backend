import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ResponseStatus, createResponse } from "@/utils/createResponse";
import { userCreator, userFinder, userUpdater } from "../dependencies";
import { createStudentSchema, updateStudentSchema } from "../validators/users";
import { HTTPException } from "hono/http-exception";
import { authValidator } from "@/infraestructure/helpers/authValidator";

const students = new Hono();

students.post(
	"/students",
	zValidator("json", createStudentSchema),
	async (c) => {
		await authValidator(userFinder, c, "admin");

		const newStudentData = c.req.valid("json");

		const alreadyExistingUser = await userFinder.findByUsername(
			newStudentData.username,
		);

		if (alreadyExistingUser) {
			throw new HTTPException(ResponseStatus.CONFLICT, {
				message: "User already exists",
			});
		}

		const hashedPassword = await Bun.password.hash(newStudentData.password, {
			algorithm: "bcrypt",
			cost: 10,
		});

		const createdUser = await userCreator.createStudent({
			username: newStudentData.username,
			data: newStudentData.data,
			password: hashedPassword,
		});

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

students.get("/students/me", async (c) => {
	const user = await authValidator(userFinder, c, "student");

	const { password, ...userWithoutPassword } = user;

	return createResponse(ResponseStatus.OK, {
		data: userWithoutPassword,
	});
});

students.get("/students/:id", async (c) => {
	await authValidator(userFinder, c, "admin");

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

	const { password, ...userWithoutPassword } = user;

	return createResponse(ResponseStatus.OK, {
		data: userWithoutPassword,
	});
});

students.patch(
	"/students/:id",
	zValidator("json", updateStudentSchema),
	async (c) => {
		await authValidator(userFinder, c, "admin");

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

		const newUserData = c.req.valid("json");
		const updatedUser = await userUpdater.updateStudentById(
			numberId,
			newUserData,
		);

		if (!updatedUser) {
			throw new HTTPException(ResponseStatus.INTERNAL_SERVER_ERROR, {
				message: "An error occurred while updating the student",
			});
		}

		const { password, ...userWithoutPassword } = updatedUser;

		return createResponse(ResponseStatus.OK, {
			data: userWithoutPassword,
		});
	},
);

export default students;
