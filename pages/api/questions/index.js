import prisma from '../../../lib/prisma';
import { Roles } from '../../../lib/constants';
import requiresAuth from '../../../lib/requiresAuthApiMiddleware';
import { getUserProfile } from '../../../lib/handleUserAuthEvents';
import getAdminAccessToken from '../../../lib/getKeycloakAdminAccessToken';

const handler = async (req, res) => {
  const { session } = req;

  if (req.method === 'POST') {
    if (!session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to add new questions',
      });
    }
    const { body, type } = req.body;
    if (!body || !type) {
      return res.status(422).json({
        error: true,
        message: 'The required question details are missing',
      });
    }
    const record = await prisma.questions.create({
      data: {
        body: body,
        type: type,
        categories: { connect: { id: Number(req.body.category_id) } },
      },
    });
    return res.json(record);
  }

  if (session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
    if (req.method === 'GET') {
      const queryParams = {
        id: true,
        categories: true,
        body: true,
        type: true,
      };

      const questions = await prisma.questions.findMany({
        select: queryParams,
        where: {
          categories: { platforms: { user_id: session.user.userId } },
          archived: false,
          category_id: Number(req.query.id),
        },
      });

      return res.json(
        questions.map(q => ({
          id: q.id,
          body: q.body,
          type: q.type,
          categories: q.categories,
        }))
      );
    }
  } else if (session.user.roles.includes(Roles.USER_TYPE_USER)) {
    if (req.method === 'GET') {
      const queryParams = {
        id: true,
        body: true,
        type: true,
        categories: true,
      };

      const questions = await prisma.questions.findMany({
        select: queryParams,
        where: {
          archived: false,
          categories: { platforms: { id: session.user.platformId } },
        },
      });

      const questionsToReturn = questions.reduce((result, question) => {
        if (result[question.type]) {
          result[question.type].push(question);
        } else {
          result[question.type] = [question];
        }
        return result;
      }, {});

      return res.json(questionsToReturn);
    }
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
