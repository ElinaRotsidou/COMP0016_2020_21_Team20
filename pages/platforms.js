import { getSession } from 'next-auth/client';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { Panel, PanelGroup, Table, Button } from 'rsuite';

import { Header, LoginMessage, QuestionsTable, NoAccess } from '../components';

import { Roles } from '../lib/constants';

export async function getServerSideProps(context) {
  return { props: { session: await getSession(context) } };
}

function Manage({ session, toggleTheme }) {
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
          <h3>
            Manage Platforms
            {/* <QuestionsTable /> */}
            {/* <Button  
        id="addNewQuestion"
        float="right"
        appearance="primary"
        onClick={() => {
          setDialogText(null);
          setShowNewQuestionDialog(true);
        }}>  
        <div>Add new question</div>
      </Button> */}
          </h3>
        </div>
      ) : (
        <NoAccess />
      )}
    </div>
  );
}

Manage.propTypes = {
  session: PropTypes.object.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Manage;
