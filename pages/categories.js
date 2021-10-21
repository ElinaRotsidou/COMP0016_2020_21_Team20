import { getSession } from 'next-auth/client';
import Head from 'next/head';
import PropTypes from 'prop-types';

import { Header, LoginMessage, NoAccess, CategoriesTable } from '../components';

import { Roles } from '../lib/constants';

export async function getServerSideProps(context) {
  return { props: { session: await getSession(context) } };
}

function ManageCat({ session, toggleTheme }) {
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
          <h3>Manage Categories</h3>
          <h4>
            <CategoriesTable />
          </h4>
        </div>
      ) : (
        <NoAccess />
      )}
    </div>
  );
}

ManageCat.propTypes = {
  session: PropTypes.object.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default ManageCat;
