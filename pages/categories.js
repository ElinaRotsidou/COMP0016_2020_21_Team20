import { getSession } from 'next-auth/client';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { Panel, PanelGroup, Table, Button } from 'rsuite';

import { Header, LoginMessage, NoAccess } from '../components';

import TestingCat from '/Users/elinarotsidou/Documents/GitHub/COMP0016_2020_21_Team20/components/TestingCat/TestingCat.js';

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
        <title>Manage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header session={session} toggleTheme={toggleTheme} />
      {session.user.roles.includes(Roles.USER_TYPE_ADMIN) ? (
        <div>
          <h3>Manage Categories</h3>
          <h4>
            <TestingCat />
          </h4>
          {/* <Button  
        float="right"
        appearance="primary"
        onClick={event =>  window.location.href='/admin'}
        >  
        <div>Add new question</div>
      </Button> */}
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
