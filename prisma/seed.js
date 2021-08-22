const { PrismaClient } = require('@prisma/client');
const { standards, likertScaleQuestions } = require('../seedData');

const prisma = new PrismaClient();

const seedStandards = async () => {
  await Promise.all(
    standards.map((standard, i) =>
      prisma.standards.create({ data: { name: standard, id: i + 1 } })
    )
  );
};

const seedQuestions = async () => {
  await Promise.all(
    likertScaleQuestions.map(question => {
      const data = {
        default_url: question.url,
        category: question.category,
        standards: { connect: { id: question.standardId } },
        type: 'likert_scale',
        body: question.question,
        // platform_id :
      };

      return prisma.questions.create({ data });
    })
  );

  const seedData = async () => {
    await seedStandards();
    await seedEntities();
    await seedQuestions();
  };

  seedData()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
};
