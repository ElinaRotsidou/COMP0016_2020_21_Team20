import { useState } from 'react';
import {
  Button,
  Icon,
  Input,
  SelectPicker,
  Alert,
  Panel,
  PanelGroup,
} from 'rsuite';
import { mutate } from 'swr';

import styles from './Testing.module.css';
import PropTypes from 'prop-types';

import { AlertDialog, CustomTable } from '..';
import useSWR from '../../lib/swr';
import { platform } from 'chart.js';

const columns = [
  {
    id: 'platform',
    label: 'Platforms',
    width: '40%',
    render: (edited, row, host, i) => {
      // if (edited) {
      //   // If this question is being edited then it needs to be an input box
      //   // Copy all the info about the row being currently edited
      //   const buffer = {};
      //   Object.assign(buffer, row);
      //   editedRow = buffer;
      //   return (
      //     <Input
      //       id={'questionInput' + i}
      //       className={styles.input}
      //       key={row.id.name}
      //       defaultValue={row.name}
      //       onChange={value => (editedRow.name = value)}
      //     />
      //   );
      // } else {
      // Else just display body
      return <div id={'platform' + i}>{row.name}</div>;
    },
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
export default function Testing() {
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

  // const updateQuestion = async () => {
  //   console.log('dame' + editedRow);
  //   console.log(editedRow);

  //   const res = await fetch('/api/platforms/' + editedRow.id, {
  //     method: 'PUT',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ name: editedRow.name }),
  //   }).then(res => res.json());

  //   if (res.error) {
  //     Alert.error(res.message, 0);
  //   } else {
  //     setEditing(null);
  //     // Refetch to ensure no stale data
  //     // mutate('/api/questions?default_urls=1');
  //     Alert.success('Question successfully updated', 3000);
  //   }
  // };

  const deleteQuestion = async id => {
    const res = await fetch('/api/platforms/' + id, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());

    if (res.error) {
      Alert.error(res.message, 0);
    } else {
      // Refetch to ensure no stale data
      // mutate('/api/questions?default_urls=1');
      Alert.success('Question successfully deleted', 3000);
    }
  };

  const addNewPlatform = async () => {
    if (!newRow.name) {
      Alert.success('hi');
      // setDialogText(
      //   <div className={styles.alertText}>*Please fill in each field</div>
      // );
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
        mutate('/api/questions?default_urls=1');
        Alert.success('New question successfully added', 3000);
      }
    }
  };

  const renderActionCells = (editing, row, i, host) => {
    // if (editing === i) {
    //   return (
    //     <div className={styles.actionButtons}>
    //       <Button
    //         aria-label={'Save'}
    //         id={'saveEdit' + i}
    //         appearance="primary"
    //         onClick={() => updateQuestion()}>
    //         <Icon icon="save" />
    //       </Button>
    //       <Button
    //         aria-label={'Cancel'}
    //         color="red"
    //         onClick={() => {
    //           // No row is being edited so reset this value
    //           editedRow = null;
    //           setEditing(null);
    //           // Refetch to ensure no stale data
    //           mutate('/api/questions?default_urls=1');
    //         }}>
    //         <Icon icon="close" />
    //       </Button>
    //     </div>
    //   );
    // } else {
    return (
      <div className={styles.actionButtons}>
        {/* <Button
            aria-label={'Edit Question'}
            id={'edit' + i}
            appearance="primary"
            onClick={() => setEditing(i)}>
            <Icon icon="pencil" />
          </Button> */}
        <Button
          color="red"
          onClick={async () => {
            if (
              window.confirm(
                'Are you sure you want to delete this question?. Deleting a question cannot be undone.'
              )
            ) {
              await deleteQuestion(row.id);
            }
          }}>
          <Icon icon="trash" />
        </Button>
      </div>
    );
  };

  return (
    <div>
      <AlertDialog
        open={showNewPlatformDialog}
        setOpen={setShowNewPlatformDialog}
        title="Please fill in the information of the new question:"
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
        data={data}
        columns={columns}
        renderActionCells={renderActionCells}
        editing={false}
      />
    </div>
  );
}
