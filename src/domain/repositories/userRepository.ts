import { DBUser } from "../models/user";

export interface UserRepository {
	getById(id: number): Promise<DBUser | null>;
	getByUsername(username: string): Promise<DBUser | null>;
	create(data: Omit<DBUser, "id">): Promise<DBUser | null>;
}
