import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createGenders = async () => {
	const genders = ["male", "female"];

	for (const gender of genders) {
		await prisma.gender.upsert({
			where: { name: gender },
			update: { name: gender },
			create: { name: gender },
		});
	}
};

const createRoles = async () => {
	const roles = ["student", "teacher", "admin"];

	for (const role of roles) {
		await prisma.role.upsert({
			where: { name: role },
			update: { name: role },
			create: { name: role },
		});
	}
};

const createMaritalStatuses = async () => {
	const maritalStatuses = ["single", "married", "divorced", "widowed"];

	for (const maritalStatus of maritalStatuses) {
		await prisma.maritalStatus.upsert({
			where: { name: maritalStatus },
			update: { name: maritalStatus },
			create: { name: maritalStatus },
		});
	}
};

const createCampuses = async () => {
	const campuses = ["Puerto Ordaz"];

	for (const campus of campuses) {
		await prisma.campus.upsert({
			where: { name: campus },
			update: { name: campus },
			create: { name: campus },
		});
	}
};

const createCareers = async () => {
	const careers = ["Ingenieria Informatica"];

	for (const career of careers) {
		await prisma.career.upsert({
			where: { name: career },
			update: { name: career },
			create: { name: career },
		});
	}
};

async function main() {
	await createGenders();
	await createRoles();
	await createMaritalStatuses();
	await createCampuses();
	await createCareers();
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
