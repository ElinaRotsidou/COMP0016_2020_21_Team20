import { getSession } from 'next-auth/client';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { Panel, PanelGroup, Table, Button, Icon } from 'rsuite';

import { Header, LoginMessage, NoAccess } from '../components';

import Testing from '/Users/elinarotsidou/Documents/GitHub/COMP0016_2020_21_Team20/components/Testing/Testing';

import { Roles } from '../lib/constants';

export async function getServerSideProps(context) {
  return { props: { session: await getSession(context) } };
}

function ManagePlat({ session, toggleTheme }) {
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
            <Testing />
          </h3>
          {/* <Button 
          float="right"
          appearance="primary"
          onClick={() => Router.back()}>
           <Icon icon="trash" />
           </Button> */}

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

ManagePlat.propTypes = {
  session: PropTypes.object.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default ManagePlat;
