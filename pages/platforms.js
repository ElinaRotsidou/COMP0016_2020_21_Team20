import { getSession } from 'next-auth/client';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { Panel, PanelGroup, Table, Button, Icon } from 'rsuite';

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

  // function addCode() {
  //    document.getElementById("add_to_me").innerHTML +=
  //    "<h3>This is the text which has been inserted by JS</h3>";
  // };

  return (
    <div>
      <Head>
        <title>Manage</title>
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
