import { getSession } from 'next-auth/client';
import Head from 'next/head';
import PropTypes from 'prop-types';

import { Header, LoginMessage, NoAccess, PlatformsTable } from '../components';

import { Roles } from '../lib/constants';

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
      host: context.req.headers.host,
    },
  };
}

function ManagePlat({ session, host, toggleTheme }) {
  if (!session) {
    return (
      <div>
        <Header session={session} toggleTheme={toggleTheme} />
        <LoginMessage />
      </div>
    );
  }
  return (
    <div>
      <Head>
        <title>Platforms</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header session={session} toggleTheme={toggleTheme} />
      {session.user.roles.includes(Roles.USER_TYPE_ADMIN) ? (
        <div>
          <h3>
            Manage Platforms
            <PlatformsTable host={host} />
          </h3>
        </div>
      ) : (
        <NoAccess />
      )}
    </div>
  );
}

ManagePlat.propTypes = {
  session: PropTypes.object.isRequired,
  host: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default ManagePlat;
