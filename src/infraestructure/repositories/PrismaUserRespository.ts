import { DBUser } from "@/domain/models/user";
import { UserRepository } from "@/domain/repositories/userRepository";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaUserAdapter } from "../adapters/PrismaUserAdapter";
import { Student } from "@/domain/models/student";

export default class PrismaUserRespository implements UserRepository {
	private prisma: PrismaClient;
	private adapter: PrismaUserAdapter;
	private prismaUserInclude = {
		role: true,
		Student: {
			include: {
				personalData: {
					include: {
						maritalStatus: true,
						gender: true,
					},
				},
				academicData: true,
			},
		},
		Teacher: {
			include: {
				personalData: {
					include: {
						maritalStatus: true,
						gender: true,
					},
				},
			},
		},
	};

	constructor(prisma: PrismaClient) {
		this.prisma = prisma;
		this.adapter = new PrismaUserAdapter();
	}

	async getById(id: number): Promise<DBUser | null> {
		const prismaUser = await this.prisma.user.findUnique({
			where: {
				id,
			},
			include: this.prismaUserInclude,
		});

		if (!prismaUser) {
			return null;
		}

		return this.adapter.adaptUserData(prismaUser);
	}

	async getByUsername(username: string): Promise<DBUser | null> {
		const prismaUser = await this.prisma.user.findUnique({
			where: {
				username,
			},
			include: this.prismaUserInclude,
		});

		if (!prismaUser) {
			return null;
		}

		return this.adapter.adaptUserData(prismaUser);
	}

	async create(newUserData: Omit<DBUser, "id">): Promise<DBUser | null> {
		const roleName = newUserData.data.role;

		let studentCreateInput: Prisma.StudentCreateWithoutUserInput | undefined;
		let teacherCreateInput: Prisma.TeacherCreateWithoutUserInput | undefined;

		const personalDataCreateInput: Prisma.PersonalDataCreateInput = {
			ic: newUserData.data.personalData.ic,
			name: newUserData.data.personalData.name,
			secondName: newUserData.data.personalData.secondName,
			lastName: newUserData.data.personalData.lastName,
			secondLastName: newUserData.data.personalData.secondLastName,
			gender: {
				connect: {
					name: newUserData.data.personalData.gender,
				},
			},
			maritalStatus: {
				connect: {
					name: newUserData.data.personalData.maritalStatus,
				},
			},
			birthDate: newUserData.data.personalData.birthDate,
			birthCountry: newUserData.data.personalData.birthCountry,
			birthState: newUserData.data.personalData.birthState,
			birthCity: newUserData.data.personalData.birthCity,
			email: newUserData.data.contactData.email,
			altEmail: newUserData.data.contactData.alternativeEmail,
			phone: newUserData.data.contactData.phoneNumber,
			altPhone: newUserData.data.contactData.alternativePhoneNumber,
			houseAddress: newUserData.data.contactData.houseAddress,
			workAddress: newUserData.data.contactData.workAddress,
		};

		if (roleName === "student") {
			const student = newUserData.data as Student;
			studentCreateInput = {
				personalData: {
					create: personalDataCreateInput,
				},
				academicData: {
					create: {
						active: true,
						unegEmail: newUserData.data.contactData.universityEmail,
						campus: {
							connect: {
								name: student.academicData.campus,
							},
						},
						career: {
							connect: {
								name: newUserData.data.academicData.career,
							},
						},
					},
				},
			};
		} else if (roleName === "teacher") {
			teacherCreateInput = {
				personalData: {
					create: personalDataCreateInput,
				},
			};
		} else {
			return null;
		}

		const prismaUser = await this.prisma.user.create({
			data: {
				username: newUserData.username,
				password: newUserData.password,
				role: {
					connect: {
						name: roleName,
					},
				},
				Student: {
					create: studentCreateInput,
				},
				Teacher: {
					create: teacherCreateInput,
				},
			},
			include: this.prismaUserInclude,
		});

		return this.adapter.adaptUserData(prismaUser);
	}
}
