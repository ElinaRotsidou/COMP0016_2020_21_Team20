import { Button, Message } from 'rsuite';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import PropTypes from 'prop-types';
import { Header, LoginMessage } from '../../components';

import setUserPlatformAndRole from '/Users/elinarotsidou/Documents/GitHub/COMP0016_2020_21_Team20/lib/setUserPlatformAndRole.js';
import prisma from '../../lib/prisma';
import { Roles } from '../../lib/constants';

export const getServerSideProps = async context => {
  const { params } = context.query;
  const [type, joinCode] = params;

  if (
    ![Roles.USER_TYPE_USER, Roles.USER_TYPE_ADMIN].includes(type) ||
    !joinCode
  ) {
    return { notFound: true };
  }

  // User must have no role to be able to join a platform
  const session = await getSession(context);
  if (!session || !session.user.roles.includes(Roles.USER_TYPE_UNKNOWN)) {
    return { props: { session } };
  }

  console.log('Session', session ? session.user : undefined);
  const dbTable =
    type === Roles.USER_TYPE_ADMIN
      ? prisma.admin_join_codes
      : prisma.user_join_codes;

  const platform = await dbTable.findFirst({ where: { code: joinCode } });

  if (!platform) return { props: { invalidCode: true } };

  const success = await setUserPlatformAndRole({
    platformId: platform.platform_id,
    userId: session.user.userId,
    newUserType: type,
  });

  return { props: { success, session } };
};

function PlatformJoin({ session, ...props }) {
  const router = useRouter();

  if (!session) {
    return (
      <div>
        <Header session={session} />
        <LoginMessage />
      </div>
    );
  }

  if (props.success === true) {
    return (
      <>
        <Header session={session} />
        <Message
          style={{ margin: 'auto', width: '50%', textAlign: 'center' }}
          type="success"
          title="Successfully joined platform"
          description={
            <p id="joinSuccess">
              You have successfully joined the platform!
              <br />
              <br />
              <Button
                id="goToHomepage"
                appearance="primary"
                onClick={() => router.push('/')}>
                Click here to go back to the homepage
              </Button>
            </p>
          }></Message>
      </>
    );
  }

  return (
    <div>
      <Header session={session} />
      {/* {!session.user.roles.includes(Roles.USER_TYPE_UNKNOWN) &&
        'You are not eligible to join a platform at this time.'} */}
      {props.invalidCode &&
        'Your join code is invalid. Please ensure your code has not expired and is exactly as you were provided.'}
      {props.success === true &&
        'You have successfully joined the platform. You will be redirected in 5 seconds.'}
      {props.success === false && 'There was an error joining the platform.'}
    </div>
  );
}
PlatformJoin.propTypes = {
  session: PropTypes.object,
  user: PropTypes.object,
  invalidCode: PropTypes.bool,
  success: PropTypes.bool,
};

export default PlatformJoin;
