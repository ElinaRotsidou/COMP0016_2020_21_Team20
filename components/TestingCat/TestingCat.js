import { useState } from 'react';
import { useRouter } from 'next/router';
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
      if (edited) {
        // If this question is being edited then it needs to be an input box
        // Copy all the info about the row being currently edited
        const buffer = {};
        Object.assign(buffer, row);
        editedRow = buffer;
        return (
          <Input
            id={'category' + i}
            className={styles.input}
            defaultValue={row.type}
            onChange={value => (editedRow.type = value)}
          />
        );
      } else {
        return <div id={'category' + i}>{row.type}</div>;
      }
    },
  },

  { id: 'actions', label: 'Actions', width: 'auto' },
];

const useCategories = () => {
  const router = useRouter();
  var platid = router.query.platform_id;
  console.log(platid);

  const { data, error } = useSWR('/api/categories?id=' + platid);

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

  var newRow = { type: null, platforms: null };

  if (error) {
    Alert.error(
      `Error: ${message}. Please reload/try again later or the contact system administrator`,
      0
    );
  }

  const updateCategory = async () => {
    const res = await fetch('/api/categories/' + editedRow.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: editedRow.type }),
    }).then(res => res.json());

    if (res.error) {
      Alert.error(res.message, 0);
    } else {
      setEditing(null);
      // Refetch to ensure no stale data
      mutate('/api/categories');
      Alert.success('Question successfully updated', 3000);
    }
  };

  const deleteCategory = async id => {
    const res = await fetch('/api/categories' + id, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());

    if (res.error) {
      Alert.error(res.message, 0);
    } else {
      // Refetch to ensure no stale data
      mutate('/api/categories');
      Alert.success('Category successfully deleted', 3000);
    }
  };

  const addNewCategory = async () => {
    if (!newRow.type || !newRow.platforms) {
      setDialogText(
        <div className={styles.alertText}>*Please fill in each field</div>
      );
    } else {
      const res = await fetch('/api/categories/?platforms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newRow.type,
          platforms: newRow.platforms,
        }),
      }).then(res => res.json());

      if (res.error) {
        Alert.error(res.message, 0);
      } else {
        setShowNewCategoryDialog(false);
        newRow = { type: null, platforms: null };

        // Refetch to ensure no stale data
        mutate('/api/categories');
        Alert.success('New question successfully added', 3000);
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
            onClick={() => updateCategory()}>
            <Icon icon="save" />
          </Button>
          <Button
            aria-label={'Cancel'}
            color="red"
            onClick={() => {
              // No row is being edited so reset this value
              editedRow = null;
              setEditing(null);
              // Refetch to ensure no stale data
              mutate('/api/categories');
            }}>
            <Icon icon="close" />
          </Button>
        </div>
      );
    } else
      return (
        <div className={styles.actionButtons}>
          <Link href={{ pathname: '/ADMIN', query: { category_id: '5' } }}>
            <Button float="right" color="orange">
              <Icon icon="eye" />
            </Button>
          </Link>
          <Button
            aria-label={'Edit Category'}
            id={'edit' + i}
            // appearance="subtle"
            color="green"
            onClick={() => setEditing(i)}>
            <Icon icon="pencil" />
          </Button>
          <Button
            id={'delete' + i}
            color="red"
            onClick={async () => {
              if (
                window.confirm(
                  'Are you sure you want to delete this category?. Deleting a category cannot be undone.'
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
              onChange={value => (newRow.platforms = value)}
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
        editing={editing}
      />
    </div>
  );
}
