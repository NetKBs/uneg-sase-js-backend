import { Student } from "@/domain/models/student";
import { DBUser } from "@/domain/models/user";
import { UserRepository } from "@/domain/repositories/userRepository";

export class UserCreator {
	private userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	createStudent(
		user: Omit<DBUser, "id" | "data"> & { data: Student },
	): Promise<DBUser | null> {
		return this.userRepository.create({
			username: user.username,
			password: user.password,
			data: {
				role: "student",
				...user.data,
			},
		});
	}
}
