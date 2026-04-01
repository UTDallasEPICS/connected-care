export default defineEventHandler(async () => {
	return prisma.sessionType.findMany();
});
