import { User } from "@/domain/models/user";
import { UserRepository } from "@/domain/repositories/userRepository";

export class UserFinder {
	private userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	async findById(id: number): Promise<User | null> {
		return this.userRepository.getById(id);
	}

	async findByUsername(username: string): Promise<User | null> {
		return this.userRepository.getByUsername(username);
	}
}
