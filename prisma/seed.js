const { PrismaClient } = require('@prisma/client');
const { standards, likertScaleQuestions } = require('../seedData');

const prisma = new PrismaClient();

const seedQuestions = async () => {
  await Promise.all(
    likertScaleQuestions.map(question => {
      const data = {
        category_id: question.categories,
        type: 'likert_scale',
        body: question.question,
        platform_id: question.platform_id,
      };

      return prisma.questions.create({ data });
    })
  );

  const seedData = async () => {
    await seedEntities();
    await seedQuestions();
  };

  seedData()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
};
