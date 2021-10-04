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
        message: 'You do not have permission to view individual departments',
      });
    }

    const includes = {};
    if (session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      if (+req.query.platformId !== session.user.platformId) {
        return res.status(403).json({
          error: true,
          message:
            'You do not have permission to view a department you do not belong to',
        });
      }
      includes.user_join_codes = { select: { code: true } };
      // } else if (session.user.roles.includes(Roles.USER_TYPE_HOSPITAL)) {
      //   const isDepartmentInHospital = await prisma.departments.count({
      //     where: {
      //       AND: [
      //         { id: { equals: +req.query.departmentId } },
      //         { hospital_id: { equals: session.user.hospitalId } },
      //       ],
      //     },
      //   });

      //   if (!isDepartmentInHospital) {
      //     return res.status(403).json({
      //       error: true,
      //       message:
      //         'You do not have permission to view a department that is not in your hospital',
      //     });
      //   }
      // } else if (session.user.roles.includes(Roles.USER_TYPE_HEALTH_BOARD)) {
      //   const isDepartmentInHealthBoard = await prisma.departments.count({
      //     where: {
      //       AND: [
      //         { id: { equals: +req.query.departmentId } },
      //         {
      //           hospitals: {
      //             health_board_id: { equals: session.user.healthBoardId },
      //           },
      //         },
      //       ],
      //     },
      //   });

      //   if (!isDepartmentInHealthBoard) {
      //     return res.status(403).json({
      //       error: true,
      //       message:
      //         'You do not have permission to view a department that is not in your health board',
      //     });
      //   }
      // }

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

    // if (req.method === 'DELETE') {
    //   if (!session.user.roles.includes(Roles.USER_TYPE_HOSPITAL)) {
    //     return res.status(403).json({
    //       error: true,
    //       message: 'You do not have permission to delete departments',
    //     });
    //   }

    //   const isDepartmentInHospital = await prisma.departments.count({
    //     where: {
    //       AND: [
    //         { id: { equals: +req.query.departmentId } },
    //         { hospital_id: { equals: session.user.hospitalId } },
    //       ],
    //     },
    //   });

    //   if (!isDepartmentInHospital) {
    //     return res.status(403).json({
    //       error: true,
    //       message: 'You do not have permission to delete this department',
    //     });
    //   }

    //   const responses = await Promise.all([
    //     prisma.departments.update({
    //       data: { archived: true },
    //       where: { id: +req.query.departmentId },
    //     }),
    //     prisma.question_urls.deleteMany({
    //       where: { department_id: { equals: +req.query.departmentId } },
    //     }),
    //   ]);

    //   return res.json({ success: responses.every(r => !!r) });
    // }

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

    // Note: we don't support changing the standard of a question (otherwise users will
    // answer the same question but scores will be recorded against different standards,
    // skewing the results)
    const fields = {};
    // if (url) fields.default_url = url;
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
