import { PersonalData as PrismaPersonalData, Prisma } from "@prisma/client";
import { DBUser } from "@/domain/models/user";
import { PersonalData } from "@/domain/models/personalData";
import { ContactData } from "@/domain/models/contactData";

const prismaUserWithData = Prisma.validator<Prisma.UserDefaultArgs>()({
	include: {
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
	},
});

type PrismaUserWithData = Prisma.UserGetPayload<typeof prismaUserWithData>;
type UserRole = DBUser["data"]["role"];
type UserGender = PersonalData["gender"];
type UserMaritalStatus = PersonalData["maritalStatus"];

export class PrismaUserAdapter {
	constructor() {}

	adaptUserData(prismaUser: PrismaUserWithData): DBUser | null {
		let personalData: PrismaPersonalData | null = null;
		let role: UserRole | null = null;
		let gender: UserGender | null = null;
		let maritalStatus: UserMaritalStatus | null = null;

		if (prismaUser.Student && prismaUser.role.name === "student") {
			personalData = prismaUser.Student.personalData;
			role = "student";
			gender = prismaUser.Student.personalData.gender.name as UserGender;
			maritalStatus = prismaUser.Student.personalData.maritalStatus
				.name as UserMaritalStatus;
		} else if (prismaUser.Teacher && prismaUser.role.name === "teacher") {
			personalData = prismaUser.Teacher.personalData;
			role = "teacher";
			gender = prismaUser.Teacher.personalData.gender.name as UserGender;
			maritalStatus = prismaUser.Teacher.personalData.maritalStatus
				.name as UserMaritalStatus;
		} else {
			return null;
		}

		const userPersonalData: PersonalData = {
			ic: personalData.ic.toString(),
			name: personalData.name,
			secondName: personalData.secondName,
			lastName: personalData.lastName,
			secondLastName: personalData.secondLastName,
			gender,
			maritalStatus,
			birthDate: personalData.birthDate,
			birthCountry: personalData.birthCountry,
			birthState: personalData.birthState,
			birthCity: personalData.birthCity,
		};

		const userContactData: ContactData = {
			email: personalData.email,
			alternativeEmail: personalData.altEmail ?? undefined,
			universityEmail: personalData.email,
			phoneNumber: personalData.phone.toString(),
			alternativePhoneNumber: personalData.altPhone?.toString(),
			houseAddress: personalData.houseAddress,
			workAddress: personalData.workAddress ?? undefined,
		};

		if (role === "student") {
			return {
				id: prismaUser.id,
				username: prismaUser.username,
				password: prismaUser.password,
				data: {
					role: "student",
					personalData: userPersonalData,
					contactData: userContactData,
					academicData: {},
				},
			};
		}

		if (role === "teacher") {
			return {
				id: prismaUser.id,
				username: prismaUser.username,
				password: prismaUser.password,
				data: {
					role: "teacher",
					personalData: userPersonalData,
					contactData: userContactData,
				},
			};
		}

		return null;
	}
}
