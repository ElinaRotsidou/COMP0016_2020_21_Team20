import requiresAuth from '../../lib/requiresAuthApiMiddleware';
import prisma from '../../lib/prisma';
import { Roles } from '../../lib/constants';

/**
 * @swagger
 * tags:
 *  name: health_boards
 *  description: Health Boards in the system
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    health_board:
 *      properties:
 *        id:
 *          type: integer
 *          example: 1
 *        name:
 *          type: string
 *          example: Aneurin Bevan
 */

/**
 * @swagger
 * /health_boards:
 *  get:
 *    summary: Retrieve a list of health boards
 *    description: "Retrieve a list of health boards. Note: only platform administrators can use this endpoint to fetch the health boards in the system. This could be used e.g. for populating a list of health boards when adding a new hospital."
 *    tags: [health_boards]
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/health_board'
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      403:
 *        $ref: '#/components/responses/insufficient_permission'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 */
const handler = async (req, res) => {
  const { session } = req;

  if (req.method === 'GET') {
    if (!session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to view health boards',
      });
    }

    const healthBoards = await prisma.health_boards.findMany({
      select: { id: true, name: true },
      orderBy: { id: 'asc' },
    });

    // Return the name and id of the health boards
    return res.json(healthBoards);
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
