import prisma, { categories } from '../../../lib/prisma';
import { Roles } from '../../../lib/constants';
import requiresAuth from '../../../lib/requiresAuthApiMiddleware';
import createJoinCode from '../../../lib/createJoinCode';

const handler = async (req, res) => {
  const { session } = req;

  if (req.method === 'POST') {
    if (!session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to add new questions',
      });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(422).json({
        error: true,
        message: 'The required question details are missing',
      });
    }

    const record = await prisma.platforms.create({
      data: {
        user_id: session.user.userId,
        name: name,
        user_join_codes: { create: { code: await createJoinCode() } },
      },

      include: {
        user_join_codes: { select: { code: true } },
      },
    });

    return res.json(record);
  }

  if (req.method === 'GET') {
    const queryParams = {
      id: true,
      name: true,
      user_id: true,
      user_join_codes: true,
    };

    const platforms = await prisma.platforms.findMany({
      select: queryParams,
      where: { user_id: session.user.userId, archived: false },
    });

    return res.json(
      platforms.map(p => ({
        id: p.id,
        name: p.name,
        user_join_code: p.user_join_codes ? p.user_join_codes.code : '',
      }))
    );
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
