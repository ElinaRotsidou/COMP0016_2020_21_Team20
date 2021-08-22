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
          <h3>
            Manage and add new questions
            <QuestionsTable />
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
          <p>
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
          </p>

          {/* <p>
             <Panel header="Category " bordered>
          </Panel>
          </p>
          <p>
             <Panel header="Category" bordered>
             <QuestionsTable />
          </Panel>
          </p> */}

          {/* <Panel header="User List" bordered bodyFill>
    <Table height={400} data={tableData}>
      <Column width={70} align="center" fixed>
        <HeaderCell>Id</HeaderCell>
        <Cell dataKey="id" />
      </Column>

      <Column width={200} fixed>
        <HeaderCell>First Name</HeaderCell>
        <Cell dataKey="firstName" />
      </Column>

      <Column width={200}>
        <HeaderCell>Last Name</HeaderCell>
        <Cell dataKey="lastName" />
      </Column>

      <Column width={200}>
        <HeaderCell>City</HeaderCell>
        <Cell dataKey="city" />
      </Column>

      <Column width={200}>
        <HeaderCell>Street</HeaderCell>
        <Cell dataKey="street" />
      </Column>

      <Column width={300}>
        <HeaderCell>Company Name</HeaderCell>
        <Cell dataKey="companyName" />
      </Column>

      <Column width={300}>
        <HeaderCell>Email</HeaderCell>
        <Cell dataKey="email" />
      </Column>
    </Table>
  </Panel> */}
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

// <div style={{
//   display: 'block', width: 700, paddingLeft: 30
// }}>
//   <h4>React Suite Panel Component</h4>
//   <Panel header="Sample Panel title" shaded>
//     Greetings from GeeksforGeeks
//   </Panel>
// </div>
