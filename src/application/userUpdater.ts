import { DBUser, DBUserStudent } from "@/domain/models/user";
import { UserRepository } from "@/domain/repositories/userRepository";
import { PartialDeep } from "type-fest";

export class UserUpdater {
	private userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	async updateStudentById(
		id: number,
		data: PartialDeep<DBUserStudent>,
	): Promise<DBUser | null> {
		return this.userRepository.updateStudentById(id, data);
	}
}
