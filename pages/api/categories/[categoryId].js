import requiresAuth from '../../../lib/requiresAuthApiMiddleware';
import prisma from '../../../lib/prisma';
import { Roles } from '../../../lib/constants';

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
 * /questions/{id}:
 *  put:
 *    summary: Update a self-report question
 *    description: "Update the given question's body or default training URL, to be shown to users when they self-report. Note: you must be an administrator to perform this operation."
 *    tags: [questions]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Question ID to update
 *        required: true
 *        schema:
 *          type: integer
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
 *        $ref: '#/components/responses/invalid_question_id'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 *  delete:
 *    summary: Delete a self-report question
 *    description: "Delete the given self-report question from the system, to no longer be shown to any users when they self-report. This is irreversible. Note: you must be an administrator to perform this operation."
 *    tags: [questions]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Question ID to delete
 *        required: true
 *        schema:
 *          type: integer
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
 *        $ref: '#/components/responses/invalid_question_id'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 */
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

    const { type, platform } = req.body;
    if (!type && !platform) {
      return res.status(422).json({
        error: true,
        message: 'The required category details are missing',
      });
    }

    // Note: we don't support changing the standard of a question (otherwise users will
    // answer the same question but scores will be recorded against different standards,
    // skewing the results)
    const fields = {};
    // if (url) fields.default_url = url;
    if (type) fields.type = type;
    if (platform) fields.platform = platform;

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
