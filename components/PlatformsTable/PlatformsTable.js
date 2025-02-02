import { useState } from 'react';
import { Button, Icon, Input, Alert } from 'rsuite';
import { mutate } from 'swr';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import styles from './PlatformsTable.module.css';
import Link from 'next/link';

import { Roles } from '../../lib/constants';

import { AlertDialog, CustomTable } from '..';
import useSWR from '../../lib/swr';
import { platform } from 'chart.js';

const columns = [
  {
    id: 'platform',
    label: 'Platforms',
    width: 'auto',
    render: (edited, row, host, i) => {
      if (edited) {
        const buffer = {};
        Object.assign(buffer, row);
        editedRow = buffer;
        return (
          <Input
            id={'platformInput' + i}
            className={styles.input}
            defaultValue={row.name}
            onChange={value => (editedRow.name = value)}
          />
        );
      } else {
        return <div id={'platform' + i}>{row.name}</div>;
      }
    },
  },
  {
    id: 'url',
    label: 'Join URL',
    width: 'auto',
    render: (editing, row, host) =>
      `${host}/join/${Roles.USER_TYPE_USER}/${row['user_join_code']}`,
  },

  { id: 'actions', label: 'Actions', width: 'auto' },
];

const usePlatforms = () => {
  const { data, error } = useSWR('/api/platforms');

  if (data) {
    return { data: data, error: error || data.error, message: data.message };
  }
  return { data: null, error: error, message: error ? error.message : null };
};

var editedRow = null;
export default function Testing({ host }) {
  const [editing, setEditing] = useState(false);
  const [showNewPlatformDialog, setShowNewPlatformDialog] = useState(false);
  const [dialogText, setDialogText] = useState(null);

  const { data: data, error: error, message: message } = usePlatforms();

  var newRow = { name: null };

  if (error) {
    Alert.error(
      `Error: ${message}. Please reload/try again later or the contact system administrator`,
      0
    );
  }

  const updatePlatform = async () => {
    const res = await fetch('/api/platforms/' + editedRow.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editedRow.name }),
    }).then(res => res.json());

    if (res.error) {
      Alert.error(res.message, 0);
    } else {
      setEditing(null);
      mutate('/api/platforms');
      Alert.success('Platform successfully updated', 3000);
    }
  };

  const deletePlatform = async id => {
    const res = await fetch('/api/platforms/' + id, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());

    if (res.error) {
      Alert.error(res.message, 0);
    } else {
      mutate('/api/platforms');
      Alert.success('Platform successfully deleted', 3000);
    }
  };

  const addNewPlatform = async () => {
    if (!newRow.name) {
      setDialogText(
        <div className={styles.alertText}>*Please fill in each field</div>
      );
    } else {
      const res = await fetch('/api/platforms/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRow.name,
        }),
      }).then(res => res.json());

      if (res.error) {
        Alert.error(res.message, 0);
      } else {
        setShowNewPlatformDialog(false);
        newRow = { name: null };
        // Refetch to ensure no stale data
        mutate('/api/platforms');
        Alert.success('New platform successfully added', 3000);
      }
    }
  };

  const renderActionCells = (editing, row, i, host) => {
    if (editing === i) {
      return (
        <div className={styles.actionButtons}>
          <Button
            aria-label={'Save'}
            id={'saveEdit' + i}
            appearance="primary"
            onClick={() => updatePlatform()}>
            <Icon icon="save" />
          </Button>
          <Button
            aria-label={'Cancel'}
            color="red"
            onClick={() => {
              editedRow = null;
              setEditing(null);
              mutate('/api/platforms');
            }}>
            <Icon icon="close" />
          </Button>
        </div>
      );
    } else {
      return (
        <div className={styles.actionButtons}>
          <CopyToClipboard
            text={`${host}/join/${Roles.USER_TYPE_USER}/${row['user_join_code']}`}>
            <Button
              appearance="primary"
              onClick={() => Alert.info('Copied', 5000)}>
              <Icon
                aria-label="Copy to clipboard"
                id={'copy' + i}
                icon="clone"
              />
            </Button>
          </CopyToClipboard>
          <Link
            href={{ pathname: '/CATEGORIES', query: { platform_id: row.id } }}>
            <Button float="right" color="orange">
              <Icon icon="eye" />
            </Button>
          </Link>
          <Button
            aria-label={'Edit Platform'}
            id={'edit' + i}
            color="green"
            onClick={() => setEditing(i)}>
            <Icon icon="pencil" />
          </Button>
          <Button
            id={'delete' + i}
            color="red"
            onClick={async () => {
              if (
                window.confirm('Are you sure you want to delete this platform?')
              ) {
                await deletePlatform(row.id);
              }
            }}>
            <Icon icon="trash" />
          </Button>
        </div>
      );
    }
  };

  return (
    <div>
      <AlertDialog
        open={showNewPlatformDialog}
        setOpen={setShowNewPlatformDialog}
        title="Please fill in the information of the new platforms:"
        text={dialogText}
        content={[
          <div key="alertdialog-new-platform">
            <label>Name:</label>
            <Input
              id="bodyText"
              className={styles.input}
              onChange={value => (newRow.name = value)}
            />
          </div>,
        ]}
        actions={[
          <Button
            key="alertdialog-edit"
            color="red"
            onClick={() => setShowNewPlatformDialog(false)}>
            Cancel
          </Button>,
          <Button
            id="addPlatform"
            key="alertdialog-confirm"
            onClick={() => addNewPlatform()}
            appearance="primary">
            Add
          </Button>,
        ]}
      />

      <Button
        id="addNewPlatform"
        className={styles.buttons}
        appearance="primary"
        onClick={() => {
          setDialogText(null);
          setShowNewPlatformDialog(true);
        }}>
        <div>Add new Platform</div>
      </Button>

      <CustomTable
        host={host}
        data={data}
        columns={columns}
        renderActionCells={renderActionCells}
        editing={editing}
      />
    </div>
  );
}

Testing.propTypes = {
  /** The host name of the website*/
  host: PropTypes.string.isRequired,
};
