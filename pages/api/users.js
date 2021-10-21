import requiresAuth from '../../lib/requiresAuthApiMiddleware';
import { addNewUser } from '../../lib/handleUserAuthEvents';
import { Roles } from '../../lib/constants';

const handler = async (req, res) => {
  const { session } = req;

  if (req.method === 'POST') {
    if (!session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to add users to the system',
      });
    }

    const {
      email,
      password,
      user_type: userType,
      entity_id: entityId,
    } = req.body;

    if (
      !email ||
      !password ||
      !userType ||
      !Object.values(Roles).includes(userType)
    ) {
      return res.status(422).json({
        error: true,
        message: 'The required user details are missing or invalid',
      });
    }
    if ([Roles.USER_TYPE_ADMIN].includes(userType)) {
      if (entityId) {
        return res.status(422).json({
          error: true,
          message: 'The required userr details are missing',
        });
      }
    }

    const result = await addNewUser({ email, password, entityId, userType });
    if (result) {
      return res.json({ success: true, user_id: result });
    } else {
      return res.json({ success: false });
    }
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
