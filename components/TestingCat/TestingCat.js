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

import styles from './TestingCat.module.css';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { AlertDialog, CustomTable } from '..';
import useSWR from '../../lib/swr';
import { platform } from 'chart.js';

const columns = [
  {
    id: 'category',
    label: 'Categories',
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
      return <div id={'category' + i}>{row.type}</div>;
    },
  },

  { id: 'actions', label: 'Actions', width: 'auto' },
];

const useCategories = () => {
  const { data, error } = useSWR('/api/categories?platform_id=ID');

  if (data) {
    return { data: data, error: error || data.error, message: data.message };
  }
  return { data: null, error: error, message: error ? error.message : null };
};

var editedRow = null;
export default function Testing() {
  const [editing, setEditing] = useState(false);
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [dialogText, setDialogText] = useState(null);

  const { data: data, error: error, message: message } = useCategories();

  var newRow = { type: null, platform: null };

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

  const deleteCategory = async id => {
    const res = await fetch('/api/categories/?platform_id=ID' + id, {
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

  const addNewCategory = async () => {
    if (!newRow.type || !newRow.platform) {
      setDialogText(
        <div className={styles.alertText}>*Please fill in each field</div>
      );
    } else {
      const res = await fetch('/api/categories/?platform_id=ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newRow.type,
          platform: newRow.platform,
        }),
      }).then(res => res.json());

      if (res.error) {
        Alert.error(res.message, 0);
      } else {
        setShowNewCategoryDialog(false);
        newRow = { type: null };

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
        <Link href={{ pathname: '/ADMIN', data: 1 }}>
          <Button float="right" appearance="primary">
            <div>Click</div>
          </Button>
        </Link>
        <Button
          color="red"
          onClick={async () => {
            if (
              window.confirm(
                'Are you sure you want to delete this question?. Deleting a question cannot be undone.'
              )
            ) {
              await deleteCategory(row.id);
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
        open={showNewCategoryDialog}
        setOpen={setShowNewCategoryDialog}
        title="Please fill in the information of the new question:"
        text={dialogText}
        content={[
          <div key="alertdialog-new-category">
            <label>Name:</label>
            <Input
              id="bodyText"
              className={styles.input}
              onChange={value => (newRow.type = value)}
            />
            <label>Platform:</label>
            <br />
            <Input
              id="platformText"
              className={styles.input}
              onChange={value => (newRow.platform = value)}
            />
          </div>,
        ]}
        actions={[
          <Button
            key="alertdialog-edit"
            color="red"
            onClick={() => setShowNewCategoryDialog(false)}>
            Cancel
          </Button>,
          <Button
            id="addCategory"
            key="alertdialog-confirm"
            onClick={() => addNewCategory()}
            appearance="primary">
            Add
          </Button>,
        ]}
      />

      <Button
        id="addNewCategory"
        className={styles.buttons}
        appearance="primary"
        onClick={() => {
          setDialogText(null);
          setShowNewCategoryDialog(true);
        }}>
        <div>Add new Category</div>
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
