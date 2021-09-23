import { getSession } from 'next-auth/client';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { Panel, PanelGroup, Table, Button } from 'rsuite';

import { Header, LoginMessage, QuestionsTable, NoAccess } from '../components';

import { Roles } from '../lib/constants';

export async function getServerSideProps(context) {
  return { props: { session: await getSession(context) } };
}

/**
 * The admin page allows administrators to manage and add new questions, via the QuestionsTable component.
 * If the user is not logged in, they are prompted to login.
 *
 * All other users do not have access to this page.
 *
 * @param session the user's session object to decide what to display
 * @param toggleTheme the global function to toggle the current theme
 */
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
          <h3>Manage and add new questions</h3>
          <QuestionsTable />
        </div>
      ) : (
        <NoAccess />
      )}
    </div>
  );
}

{
  /* <p>
            <Panel header="Category A " bordered>
              <table>
                <tr>
                  <th>Question Body</th>
                </tr>
                <tr>
                  <td>.</td>
                </tr>
                <tr>
                  <td>.</td>
                </tr>
                <tr>
                  <td>.</td>
                </tr>
              </table>
            </Panel>
          </p>

          <p>
            <Panel header="Category B " bordered>
              <table>
                <tr>
                  <th>Question Body</th>
                </tr>
                <tr>
                  <td>.</td>
                </tr>
                <tr>
                  <td>.</td>
                </tr>
                <tr>
                  <td>.</td>
                </tr>
              </table>
            </Panel>
          </p>

          <p>
            <Panel header="Category C" bordered>
              <table>
                <tr>
                  <th>Question Body</th>
                </tr>
                <tr>
                  <td>.</td>
                </tr>
                <tr>
                  <td>.</td>
                </tr>
                <tr>
                  <td>.</td>
                </tr>
              </table>
            </Panel>
          </p> */
}

{
  /* <p>
             <Panel header="Category " bordered>
          </Panel>
          </p>
          <p>
             <Panel header="Category" bordered>
             <QuestionsTable />
          </Panel>
          </p> */
}

Manage.propTypes = {
  session: PropTypes.object.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Manage;

// <div style={{
//   display: 'block', width: 700, paddingLeft: 30
// }}>
//   <h4>React Suite Panel Component</h4>
//   <Panel header="Sample Panel title" shaded>
//     Greetings from GeeksforGeeks
//   </Panel>
// </div>
