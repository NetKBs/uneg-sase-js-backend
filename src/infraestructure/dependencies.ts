import { PrismaClient } from "@prisma/client";
import PrismaUserRespository from "./repositories/PrismaUserRespository";
import { UserRepository } from "@/domain/repositories/userRepository";
import { UserCreator } from "@/application/userCreator";
import { UserFinder } from "@/application/userFinder";
import { UserUpdater } from "@/application/userUpdater";

const prisma = new PrismaClient();

const userRepository: UserRepository = new PrismaUserRespository(prisma);

export const userCreator = new UserCreator(userRepository);
export const userFinder = new UserFinder(userRepository);
export const userUpdater = new UserUpdater(userRepository);
