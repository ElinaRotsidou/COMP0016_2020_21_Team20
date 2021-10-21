import requiresAuth from '../../../lib/requiresAuthApiMiddleware';
import setUserPlatformAndRole from '../../../lib/setUserPlatformAndRole';
import { Roles } from '../../../lib/constants';

const handler = async (req, res) => {
  const { session } = req;

  if (req.method === 'POST') {
    const result = await setUserPlatformAndRole({
      userId: session.user.userId,
      newUserType: Roles.USER_TYPE_UNKNOWN,
    });
    return res.json({ success: result });
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
