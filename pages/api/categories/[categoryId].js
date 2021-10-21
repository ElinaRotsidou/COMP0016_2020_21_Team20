import requiresAuth from '../../../lib/requiresAuthApiMiddleware';
import prisma from '../../../lib/prisma';
import { Roles } from '../../../lib/constants';

const handler = async (req, res) => {
  const { session } = req;
  const { categoryId } = req.query;

  if (isNaN(categoryId)) {
    return res
      .status(422)
      .json({ error: true, message: 'Invalid category ID provided' });
  }

  if (req.method === 'PUT') {
    if (!session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to modify categories',
      });
    }

    const { type } = req.body;
    if (!type) {
      return res.status(422).json({
        error: true,
        message: 'The required category details are missing',
      });
    }

    const fields = {};
    if (type) fields.type = type;

    const response = await prisma.categories.update({
      where: { id: +categoryId },
      data: fields,
    });

    return res.json(response);
  }

  if (req.method === 'DELETE') {
    if (!session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to delete categories',
      });
    }

    const response = await prisma.categories.update({
      data: { archived: true },
      where: { id: +categoryId },
    });

    return res.json(response);
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
