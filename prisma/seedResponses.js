const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getRandomScore = () => Math.floor(Math.random() * 5);

const seedResponses = async userId => {
  await Promise.all([
    prisma.responses.create({
      data: {
        users: { connect: { id: userId } },
        platforms: { connect: { id: 1 } },
        timestamp: new Date('2020-12-01 13:00:00'),
        is_mentoring_session: true,
        scores: {
          create: [
            { response_id: { connect: { id: 1 } }, score: getRandomScore() },
            { response_id: { connect: { id: 2 } }, score: getRandomScore() },
            { response_id: { connect: { id: 3 } }, score: getRandomScore() },
            { response_id: { connect: { id: 4 } }, score: getRandomScore() },
            { response_id: { connect: { id: 5 } }, score: getRandomScore() },
            { response_id: { connect: { id: 6 } }, score: getRandomScore() },
            { response_id: { connect: { id: 7 } }, score: getRandomScore() },
          ],
        },
      },
    }),
    prisma.responses.create({
      data: {
        users: { connect: { id: userId } },
        platforms: { connect: { id: 1 } },
        timestamp: new Date('2020-12-07 13:00:00'),
        is_mentoring_session: false,
        scores: {
          create: [
            { response_id: { connect: { id: 1 } }, score: getRandomScore() },
            { response_id: { connect: { id: 2 } }, score: getRandomScore() },
            { response_id: { connect: { id: 3 } }, score: getRandomScore() },
            { response_id: { connect: { id: 4 } }, score: getRandomScore() },
            { response_id: { connect: { id: 5 } }, score: getRandomScore() },
            { response_id: { connect: { id: 6 } }, score: getRandomScore() },
            { response_id: { connect: { id: 7 } }, score: getRandomScore() },
          ],
        },
      },
    }),
    prisma.responses.create({
      data: {
        users: { connect: { id: userId } },
        platforms: { connect: { id: 1 } },
        timestamp: new Date('2020-12-14 13:00:00'),
        is_mentoring_session: true,
        scores: {
          create: [
            { response_id: { connect: { id: 1 } }, score: getRandomScore() },
            { response_id: { connect: { id: 2 } }, score: getRandomScore() },
            { response_id: { connect: { id: 3 } }, score: getRandomScore() },
            { response_id: { connect: { id: 4 } }, score: getRandomScore() },
            { response_id: { connect: { id: 5 } }, score: getRandomScore() },
            { response_id: { connect: { id: 6 } }, score: getRandomScore() },
            { response_id: { connect: { id: 7 } }, score: getRandomScore() },
          ],
        },
      },
    }),
    prisma.responses.create({
      data: {
        users: { connect: { id: userId } },
        platforms: { connect: { id: 1 } },
        timestamp: new Date('2020-12-21 13:00:00'),
        is_mentoring_session: false,
        scores: {
          create: [
            { response_id: { connect: { id: 1 } }, score: getRandomScore() },
            { response_id: { connect: { id: 2 } }, score: getRandomScore() },
            { response_id: { connect: { id: 3 } }, score: getRandomScore() },
            { response_id: { connect: { id: 4 } }, score: getRandomScore() },
            { response_id: { connect: { id: 5 } }, score: getRandomScore() },
            { response_id: { connect: { id: 6 } }, score: getRandomScore() },
            { response_id: { connect: { id: 7 } }, score: getRandomScore() },
          ],
        },
      },
    }),
    prisma.responses.create({
      data: {
        users: { connect: { id: userId } },
        platforms: { connect: { id: 1 } },
        timestamp: new Date('2020-12-26 16:00:00'),
        is_mentoring_session: true,
        scores: {
          create: [
            { response_id: { connect: { id: 1 } }, score: getRandomScore() },
            { response_id: { connect: { id: 2 } }, score: getRandomScore() },
            { response_id: { connect: { id: 3 } }, score: getRandomScore() },
            { response_id: { connect: { id: 4 } }, score: getRandomScore() },
            { response_id: { connect: { id: 5 } }, score: getRandomScore() },
            { response_id: { connect: { id: 6 } }, score: getRandomScore() },
            { response_id: { connect: { id: 7 } }, score: getRandomScore() },
          ],
        },
      },
    }),
    prisma.responses.create({
      data: {
        users: { connect: { id: userId } },
        platforms: { connect: { id: 1 } },
        timestamp: new Date('2021-01-01 10:00:00'),
        is_mentoring_session: false,
        scores: {
          create: [
            { response_id: { connect: { id: 1 } }, score: getRandomScore() },
            { response_id: { connect: { id: 2 } }, score: getRandomScore() },
            { response_id: { connect: { id: 3 } }, score: getRandomScore() },
            { response_id: { connect: { id: 4 } }, score: getRandomScore() },
            { response_id: { connect: { id: 5 } }, score: getRandomScore() },
            { response_id: { connect: { id: 6 } }, score: getRandomScore() },
            { response_id: { connect: { id: 7 } }, score: getRandomScore() },
          ],
        },
      },
    }),
    prisma.responses.create({
      data: {
        users: { connect: { id: userId } },
        platforms: { connect: { id: 1 } },
        timestamp: new Date('2021-01-11 17:00:00'),
        is_mentoring_session: true,
        scores: {
          create: [
            { response_id: { connect: { id: 1 } }, score: getRandomScore() },
            { response_id: { connect: { id: 2 } }, score: getRandomScore() },
            { response_id: { connect: { id: 3 } }, score: getRandomScore() },
            { response_id: { connect: { id: 4 } }, score: getRandomScore() },
            { response_id: { connect: { id: 5 } }, score: getRandomScore() },
            { response_id: { connect: { id: 6 } }, score: getRandomScore() },
            { response_id: { connect: { id: 7 } }, score: getRandomScore() },
          ],
        },
      },
    }),
  ]);
};

const userId = process.argv[2];
if (!userId) {
  return console.error(
    'You must run this script with the user ID for whom you want to insert data. e.g. node seedResponses.js fa0c7dea-ade1-4425-c659-4bf56eae7eb6'
  );
}

console.log('Seeding responses for user ' + userId);
seedResponses(userId)
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
