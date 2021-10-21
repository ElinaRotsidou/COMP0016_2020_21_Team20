import requiresAuth from '../../lib/requiresAuthApiMiddleware';
import prisma from '../../lib/prisma';
import { Roles } from '../../lib/constants';

const handler = async (req, res) => {
  const { session } = req;

  if (req.method === 'GET') {
    const {
      from,
      to,
      only_is_mentoring_session: onlyIsMentoringSession,
      only_not_mentoring_session: onlyNotMentoringSession,

      user_id: userIdOverride,
      platform_id: platformIdOverride,
    } = req.query;

    const filters = [];

    if (from) filters.push({ timestamp: { gte: new Date(+from) } });
    if (to) filters.push({ timestamp: { lte: new Date(+to) } });

    if (onlyIsMentoringSession === '1') {
      filters.push({ is_mentoring_session: true });
    } else if (onlyNotMentoringSession === '1') {
      filters.push({ is_mentoring_session: false });
    }

    if (session.user.roles.includes(Roles.USER_TYPE_USER)) {
      if (!session.user.platformId) {
        return res.json({ responses: [], averages: {} });
      }

      filters.push({
        user_id: { equals: session.user.userId },
      });

      if (userIdOverride && userIdOverride === session.user.userId) {
        filters.push({ user_id: { equals: session.user.userId } });
      }
      if (platformIdOverride) {
        filters.push({
          platforms: { id: { equals: +platformIdOverride } },
        });
      }
    } else if (session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      filters.push({
        platforms: { user_id: { equals: session.user.userId } },
      });

      if (platformIdOverride) {
        filters.push({
          platforms: { id: { equals: +platformIdOverride } },
        });
      }
    } else {
      if (!session.user.userId) {
        return res.json({ responses: [], averages: {} });
      }

      // Default to lowest-level i.e. logged in user's data
      filters.push({ user_id: { equals: session.user.userId } });
    }

    const select = {
      id: true,
      timestamp: true,
      is_mentoring_session: true,
      platforms: true,
      scores: { select: { response_id: true, score: true } },
    };

    const orderBy = { timestamp: 'asc' };

    const responses = filters.length
      ? await prisma.responses.findMany({
          where: { AND: filters },
          select,
          orderBy,
        })
      : await prisma.responses.findMany({ select, orderBy });

    const scorePerQuestion = {};
    responses.forEach(val =>
      val.scores.forEach(score => {
        if (scorePerQuestion[score.response_id]) {
          scorePerQuestion[score.response_id].push(score.score);
        } else {
          scorePerQuestion[score.response_id] = [score.score];
        }
      })
    );

    const responseData = { responses, averages: {} };
    Object.entries(scorePerQuestion).map(
      ([standard, scores]) =>
        (responseData.averages[standard] =
          scores.reduce((acc, val) => acc + val, 0) / scores.length)
    );
    return res.json(responseData);
  }

  if (req.method === 'POST') {
    const scores = req.body.scores.map(scoreObj => {
      return {
        score: scoreObj.score,
      };
    });

    const platforms = await prisma.platforms.findMany({
      where: { user_id: session.user.userId },
    });

    const insertion = await prisma.responses.create({
      data: {
        users: { connect: { id: session.user.userId } },
        timestamp: new Date(),
        platforms: { connect: { id: session.user.platformId } },
        is_mentoring_session: req.body.is_mentoring_session,
        scores: { create: scores },
      },
    });

    return res.json(insertion);
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
