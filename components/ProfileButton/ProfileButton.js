import { signOut } from 'next-auth/client';
import { Dropdown, Icon } from 'rsuite';
import PropTypes from 'prop-types';

import { LeaveButton } from '../';

import { Roles } from '../../lib/constants';

function ProfileButton({ session }) {
  return (
    <Dropdown role="button" title="Your account" icon={<Icon icon="user" />}>
      {/*only show leave option if clinician or department*/}
      {session && session.user.roles.includes(Roles.USER_TYPE_USER) && (
        <Dropdown.Item role="menuitem">
          <LeaveButton />
        </Dropdown.Item>
      )}
      <Dropdown.Item
        role="menuitem"
        onSelect={() => signOut({ callbackUrl: '/', redirect: true })}>
        Sign out
      </Dropdown.Item>
    </Dropdown>
  );
}

ProfileButton.propTypes = {
  /** The session of the users webpage, used determine whether to show a LeaveDeptButton */
  session: PropTypes.object,
};

export default ProfileButton;
