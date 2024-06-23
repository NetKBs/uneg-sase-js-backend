import { PartialDeep } from "type-fest";
import { DBUser, DBUserStudent } from "../models/user";

export interface UserRepository {
	getById(id: number): Promise<DBUser | null>;
	getByUsername(username: string): Promise<DBUser | null>;
	create(data: Omit<DBUser, "id">): Promise<DBUser | null>;
	updateStudentById(
		id: number,
		data: PartialDeep<DBUserStudent>,
	): Promise<DBUser | null>;
}
