import { getSession } from 'next-auth/client';
import Head from 'next/head';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, ButtonGroup, Modal } from 'rsuite';
import { Panel, PanelGroup } from 'rsuite';

import {
  Header,
  LoginMessage,
  NewUserForm,
  NoAccess,
  NewEntityForm,
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

/**
 * The manage page is used to provide various management functionality depending on the user type.
 * If the user is not logged in, they are prompted to login.
 *
 * The current management functionality, for each user type is:
 * - Department Managers: Manage the department-specific Question Training URLs, and their
 * department's Join Code
 * - Hospitals: Manage the departments in their hospital, and their join codes
 * - Administrators: Manage the health boards, hospitals, and users in the system
 *
 * All other users do not have access to this page.
 *
 * @param session the user's session object to decide what to display
 * @param toggleTheme the global function to toggle the current theme
 * @param host The host name of the website
 */
function Manage({ session, host, toggleTheme }) {
  const [addNewUserModalUserType, setAddNewUserModalUserType] = useState(null);
  const [addNewEntityModalType, setAddNewEntityModalType] = useState(null);

  if (!session) {
    return (
      <div>
        <Header session={session} toggleTheme={toggleTheme} />
        <LoginMessage />
      </div>
    );
  }

  const renderContent = () => {
    if (session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      return (
        <div>
          <h3>Add new users</h3>
          <p>
            Set up user accounts for new users and allocate them to a platform
            where they will have access only to the questtions of that platform.
            You can generate the user's credentials that can be distributed to
            the relevant user.
          </p>
          <p>
            For more advanced user management (such as updating passwords or
            deleting users), please visit the platform&apos;s Keycloak Admin
            Console for precise user management functionality.
          </p>

          <Modal
            show={addNewUserModalUserType !== null}
            onHide={() => setAddNewUserModalUserType(null)}
            size="xs">
            <Modal.Header>
              <Modal.Title>Add new user</Modal.Title>
              <Modal.Header>
                Please enter the details of the new user
              </Modal.Header>
            </Modal.Header>
            <Modal.Body>
              <NewUserForm
                userType={addNewUserModalUserType}
                onSuccess={() => {
                  Alert.success(
                    'User successfully added! Please share the password with the user -- they will be required to update this when they login',
                    10000
                  );
                  setAddNewUserModalUserType(null);
                }}
                onError={message => Alert.error('Error: ' + message, 0)}
              />
            </Modal.Body>
          </Modal>

          <p>
            <ButtonGroup justified>
              <Button
                id="addNewHealthBoardUser"
                appearance="ghost"
                onClick={() =>
                  setAddNewUserModalUserType(Roles.USER_TYPE_USER)
                }>
                Add new user
              </Button>
            </ButtonGroup>
          </p>
        </div>
      );
    } else {
      return <NoAccess />;
    }
  };

  return (
    <div>
      <Head>
        <title>Manage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header session={session} toggleTheme={toggleTheme} />
      {renderContent()}
    </div>
  );
}

Manage.propTypes = {
  session: PropTypes.object.isRequired,
  host: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Manage;
