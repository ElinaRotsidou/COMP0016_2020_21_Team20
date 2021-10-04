import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, Icon, Alert } from 'rsuite';
import { mutate } from 'swr';

import PropTypes from 'prop-types';
import styles from './UserJoinCode.module.css';

import useSWR from '../../lib/swr';
import { Roles } from '../../lib/constants';

const useCode = session => {
  if (!session) {
    return { code: null, error: true, message: 'You are not logged in' };
  }

  const { data, error } = useSWR('/api/platforms/' + session.user.platformId);
  return data
    ? {
        code: data
          ? { name: data.name, code: data.User_join_codes.code }
          : data,
        error: error || data.error,
        message: data.message,
      }
    : {
        code: null,
        error: error,
        message: error ? error.message : 'Unknown error',
      };
};

function UserJoinCode({ session, host }) {
  const { code, error, message } = useCode(session);

  const regenerateCode = async id => {
    const res = await fetch(
      '/api/join_codes/' + Roles.USER_TYPE_DEPARTMENT + '/' + id,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      }
    ).then(res => res.json());

    if (res.error) {
      Alert.error(`Error: ${res.message}`);
    } else {
      mutate('/api/platforms/' + id);
      Alert.success('Join URL updated', 3000);
    }
  };

  if (error) {
    Alert.error(
      `Error: ${message}. Please reload/try again later or the contact system administrator`,
      0
    );

    return (
      <div className={styles.content}>
        There was an error fetching your department&apos;s unique Join URL
      </div>
    );
  }

  if (!code) {
    return (
      <div className={styles.content}>
        Loading your platform&apos;s unique Join URL...
      </div>
    );
  }

  const joinUrl = `https://${host}/join/${Roles.USER_TYPE_USER}/${code.code}`;
  return (
    <div className={styles.content}>
      <div className={styles.url}>
        {`Please send this unique URL to users so they can join your ${code.name} platform:
        ${joinUrl}`}
      </div>

      <div className={styles.actions}>
        <CopyToClipboard text={joinUrl}>
          <Button
            appearance="primary"
            onClick={() => Alert.info('Copied', 5000)}>
            <Icon icon="clone" /> Copy to clipboard
          </Button>
        </CopyToClipboard>

        <Button
          appearance="primary"
          onClick={() => regenerateCode(session.user.platformId)}>
          Re-generate URL
        </Button>
      </div>
    </div>
  );
}

UserJoinCode.propTypes = {
  /** The session of the users webpage, used to fecth the correct join code from the backend*/
  session: PropTypes.object,
  /** The host name of the website*/
  host: PropTypes.string.isRequired,
};

export default UserJoinCode;
