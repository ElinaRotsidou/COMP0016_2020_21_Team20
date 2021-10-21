import requiresAuth from '../../../lib/requiresAuthApiMiddleware';
import prisma from '../../../lib/prisma';
import { Roles } from '../../../lib/constants';

const handler = async (req, res) => {
  const { session } = req;
  const { platformId } = req.query;

  if (isNaN(platformId)) {
    return res
      .status(422)
      .json({ error: true, message: 'Invalid platform ID provided' });
  }

  if (req.method === 'GET') {
    if (session.user.roles.includes(Roles.USER_TYPE_USER)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to view',
      });
    }

    const includes = {};
    if (session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      if (+req.query.platformId !== session.user.platformId) {
        return res.status(403).json({
          error: true,
          message:
            'You do not have permission to view a platform you do not belong to',
        });
      }
      includes.user_join_codes = { select: { code: true } };

      let platform;
      if (Object.keys(includes).length) {
        platform = await prisma.platforms.findFirst({
          where: { id: +req.query.platformId },
          include: includes,
        });
      } else {
        platform = await prisma.platforms.findFirst({
          where: { id: +req.query.platformId },
        });
      }
      return res.json(platform);
    }

    res.status(405).json({ error: true, message: 'Method Not Allowed' });
  }

  if (req.method === 'PUT') {
    if (!session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to modify platforms',
      });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(422).json({
        error: true,
        message: 'The required platform details are missing',
      });
    }

    const fields = {};
    if (name) fields.name = name;

    const response = await prisma.platforms.update({
      where: { id: +platformId },
      data: fields,
    });

    return res.json(response);
  }

  if (req.method === 'DELETE') {
    if (!session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to delete platforms',
      });
    }

    const response = await prisma.platforms.update({
      data: { archived: true },
      where: { id: +platformId },
    });

    return res.json(response);
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
