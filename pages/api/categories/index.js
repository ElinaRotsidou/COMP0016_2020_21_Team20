import prisma, { categories } from '../../../lib/prisma';
import { Roles } from '../../../lib/constants';
import requiresAuth from '../../../lib/requiresAuthApiMiddleware';

const handler = async (req, res) => {
  const { session } = req;

  if (req.method === 'POST') {
    if (!session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to add new category',
      });
    }

    const { type } = req.body;
    if (!type) {
      return res.status(422).json({
        error: true,
        message: 'The required question details are missing',
      });
    }

    const record = await prisma.categories.create({
      data: {
        type: type,
        platforms: { connect: { id: Number(req.body.platform_id) } },
      },
    });

    return res.json(record);
  }

  if (req.method === 'GET') {
    const queryParams = {
      id: true,
      type: true,
      platforms: true,
    };

    const categories = await prisma.categories.findMany({
      select: queryParams,
      where: {
        platforms: { user_id: session.user.userId },
        platform_id: Number(req.query.id),
      },
    });

    return res.json(
      categories.map(c => ({
        id: c.id,
        type: c.type,
        platforms: c.platforms,
      }))
    );
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};
export default requiresAuth(handler);
