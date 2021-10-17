import prisma, { categories } from '../../../lib/prisma';
import { Roles } from '../../../lib/constants';
import requiresAuth from '../../../lib/requiresAuthApiMiddleware';
import { platform } from 'chart.js';

/**
 * @swagger
 * tags:
 *  name: questions
 *  description: Self-report questions
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    question:
 *      properties:
 *        id:
 *         type: integer
 *         example: 1
 *        body:
 *          type: string
 *          example: I have supported the patient with a shared decision making process to enable us to agree a management approach that is informed by what matters to them.
 *        type:
 *          type: string
 *          example: likert_scale
 *        standards:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *              example: 1
 *            name:
 *              type: string
 *              example: Individual Care
 *        url:
 *          type: string
 *          example: http://www.wales.nhs.uk/governance-emanual/person-centred-care
 */

/**
 * @swagger
 * /questions:
 *  get:
 *    summary: Retrieve the self-report questions
 *    description: Retrieve the list of questions stored in the system, to be asked to users. Returns an object with keys for each question type along with an array of questions for that type.
 *    tags: [questions]
 *    parameters:
 *      - in: query
 *        name: default_urls
 *        schema:
 *          type: integer
 *          default: 0
 *        required: false
 *        description: "'1' if you want to get the default URLs for all questions, or '0' if you want your department-overridden URL returned (if it exists)."
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              additionalProperties:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/question'
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 *  post:
 *    summary: Add a new self-report question
 *    description: "Submit a new self-report question to the system, to be shown to all users when they self-report. Note: you must be an administrator to be able to perform this operation."
 *    tags: [questions]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              body:
 *                type: string
 *                example: I have supported the patient with a shared decision making process to enable us to agree a management approach that is informed by what matters to them.
 *              url:
 *                type: string
 *                example: http://www.wales.nhs.uk/governance-emanual/person-centred-care
 *              standard:
 *                type: integer
 *                example: 1
 *              type:
 *                type: string
 *                example: likert_scale
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/question'
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      403:
 *        $ref: '#/components/responses/insufficient_permission'
 *      422:
 *        description: Invalid details
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/error'
 *            example:
 *              error: true
 *              message: The required question details are missing
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 */
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
