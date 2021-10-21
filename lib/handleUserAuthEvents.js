import prisma from './prisma';
import { Roles } from './constants';
import config from './config';
import setUserPlatformAndRole from './setUserPlatformAndRole';
import getAdminAccessToken from './getKeycloakAdminAccessToken';
import { user_type } from '@prisma/client';

const getUserType = userRoles => {
  if (userRoles.includes(Roles.USER_TYPE_ADMIN)) {
    return Roles.USER_TYPE_ADMIN;
  } else if (userRoles.includes(Roles.USER_TYPE_USER)) {
    return Roles.USER_TYPE_USER;
  } else {
    return Roles.USER_TYPE_UNKNOWN;
  }
};

async function handleUserAttemptLogin(user, account, profile) {
  const userId = profile.sub;
  if (!userId) return Promise.reject(new Error('invaliduser'));

  const isPlatformArchived = profile.platform_id
    ? await prisma.platforms.count({
        where: {
          AND: [
            { id: { equals: profile.platform_id } },
            { archived: { equals: true } },
          ],
        },
      })
    : false;

  if (isPlatformArchived) {
    await setUserPlatformAndRole({
      userId,
      newUserType: Roles.USER_TYPE_UNKNOWN,
    });

    return Promise.reject(new Error('platformdeleted'));
  }

  return true;
}

async function handleUserSuccessfulLogin(message) {
  const { account } = message;
  console.log('Handling user login', account ? account.id : 'unknown id');

  const userinfo = await fetch(`${config.KEYCLOAK_BASE_AUTH_URL}/userinfo`, {
    headers: { Authorization: 'Bearer ' + account.accessToken },
  }).then(res => res.json());

  const userId = account.id;
  const userRoles = userinfo.roles;

  var role = user_type.unknown;
  if (getUserType(userRoles) == 'platform_administrator') {
    role = user_type.admin;
  }

  if (getUserType(userRoles) == 'clinician') {
    role = user_type.user;
  }

  await prisma.users.upsert({
    create: {
      id: userId,
      user_type: role,
    },
    update: { user_type: role },
    where: { id: userId },
  });
}

async function handleUserLogout(accessToken) {
  const profile = await getUserProfile(accessToken);
  if (!profile) return false;

  const userId = profile.sub;
  const adminAccessToken = await getAdminAccessToken();
  const sessions = await fetch(
    `${config.KEYCLOAK_ADMIN_USERS_URL}/${userId}/sessions`,
    { headers: { Authorization: 'Bearer ' + adminAccessToken } }
  ).then(res => res.json());

  if (sessions.error || !sessions) return false;

  const results = await Promise.all(
    sessions.map(s =>
      fetch(`${config.KEYCLOAK_ADMIN_SESSIONS_URL}/${s.id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + adminAccessToken },
      }).then(res => res.status)
    )
  );

  return results.every(r => r === 204);
}

async function getUserProfile(accessToken, refreshToken, user) {
  const accessTokenRes = await fetch(
    `${config.KEYCLOAK_BASE_AUTH_URL}/userinfo`,
    {
      headers: { Authorization: 'Bearer ' + accessToken },
    }
  ).then(res => res.json());

  // Try using refresh token to get token if we have a refresh token
  if (accessTokenRes.error === 'invalid_token' && refreshToken) {
    const newAccessToken = await fetch(
      `${config.KEYCLOAK_BASE_AUTH_URL}/token`,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        body: `grant_type=refresh_token&client_id=${process.env.CLIENT_ID}&refresh_token=${refreshToken}`,
      }
    ).then(res => res.json());

    if (newAccessToken.access_token) {
      // If we've been passed the user, update it
      if (user) {
        user.accessToken = newAccessToken.access_token;
        user.refreshToken = newAccessToken.refresh_token;
      }

      return await fetch(`${config.KEYCLOAK_BASE_AUTH_URL}/userinfo`, {
        headers: { Authorization: 'Bearer ' + newAccessToken.access_token },
      }).then(res => res.json());
    } else {
      console.error('Profile fetch failed using refresh token', newAccessToken);
    }
  }

  return accessTokenRes;
}

async function addNewUser({ email, password, entityId, userType } = {}) {
  // This would be simpler if Keycloak supported the `realmRoles` property
  // in the POST /users endpoint (as they say they do in their docs.).
  // But, they don't. So we need to do it in 2 requests: create user, then set role

  const accessToken = await getAdminAccessToken();
  const attributes = {};

  if ([Roles.USER_TYPE_USER, Roles.USER_TYPE_USER].includes(userType)) {
    attributes.platform_id = entityId;
  }

  const res = await fetch(config.KEYCLOAK_ADMIN_USERS_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      credentials: [{ type: 'password', value: password, temporary: true }],
      enabled: true,
      realmRoles: [userType],
      attributes,
    }),
  });

  if (res.status !== 201) {
    console.error('Failed to create user', await res.json());
    return false;
  }

  const userId = res.headers.get('Location').split('/').pop();
  const availableRoles = await fetch(
    `${config.KEYCLOAK_ADMIN_USERS_URL}/${userId}/role-mappings/realm/available`,
    { headers: { Authorization: 'Bearer ' + accessToken } }
  ).then(res => res.json());

  const roleToAdd = availableRoles.find(r => r.name === userType);
  const status = await fetch(
    `${config.KEYCLOAK_ADMIN_USERS_URL}/${userId}/role-mappings/realm`,
    {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify([roleToAdd]),
    }
  ).then(res => res.status);

  return status === 204 ? userId : null;
}

export {
  handleUserSuccessfulLogin,
  handleUserAttemptLogin,
  handleUserLogout,
  getUserProfile,
  addNewUser,
};
