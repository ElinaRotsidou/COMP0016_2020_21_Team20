import { getSession } from 'next-auth/client';
import Head from 'next/head';

import {
  Header,
  LoginMessage,
  QuestionsTable,
  NoAccess,
  FeedbackNotification,
} from '../components';

import { Roles } from '../lib/constants';

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
      host: context.req.headers.host,
    },
  };
}

function manage({ session, host }) {
  if (!session) {
    return (
      <div>
        <Header session={session} />
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
      <div style={{ zIndex: 1000, position: 'relative' }}>
        <Header session={session} />
      </div>
      {session.user.roles.includes(Roles.USER_TYPE_ADMIN) ? (
        <div>
          <h3>Manage and add new questions</h3>
          <QuestionsTable />
        </div>
      ) : (
        <NoAccess />
      )}
      <FeedbackNotification />
    </div>
  );
}

export default manage;