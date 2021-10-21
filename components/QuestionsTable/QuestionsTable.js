import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Icon, Input, Alert } from 'rsuite';
import { mutate } from 'swr';

import styles from './QuestionsTable.module.css';
import Link from 'next/link';

import { AlertDialog, CustomTable } from '../';
import useSWR from '../../lib/swr';
import { platform } from 'chart.js';

const columns = [
  {
    id: 'question',
    label: 'Question body',
    width: 'auto%',
    render: (edited, row, host, i) => {
      if (edited) {
        const buffer = {};
        Object.assign(buffer, row);
        editedRow = buffer;
        return (
          <Input
            id={'questionInput' + i}
            className={styles.input}
            defaultValue={row.body}
            onChange={value => (editedRow.body = value)}
          />
        );
      } else {
        // Else just display body
        return <div id={'question' + i}>{row.body}</div>;
      }
    },
  },

  { id: 'actions', label: 'Actions', width: 'auto' },
];

const useQuestions = () => {
  const router = useRouter();
  var catid = router.query.category_id;

  var platid = router.query.platform_id;

  const { data, error } = useSWR('/api/questions?id=' + catid);

  if (data) {
    return { data: data, error: error || data.error, message: data.message };
  }
  return { data: null, error: error, message: error ? error.message : null };
};

var editedRow = null;
export default function QuestionsTable() {
  const router = useRouter();
  var catid = router.query.category_id;
  var platid = router.query.platform_id;

  const [editing, setEditing] = useState(false);
  const [showNewQuestionDialog, setShowNewQuestionDialog] = useState(false);
  const [dialogText, setDialogText] = useState(null);

  const { data: data, error: error, message: message } = useQuestions();

  var newRow = { body: null, type: 'likert_scale', categories: null };

  if (error) {
    Alert.error(
      `Error: ${message}. Please reload/try again later or the contact system administrator`,
      0
    );
  }

  const updateQuestion = async () => {
    const res = await fetch('/api/questions/' + editedRow.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: editedRow.body }),
    }).then(res => res.json());

    if (res.error) {
      Alert.error(res.message, 0);
    } else {
      setEditing(null);
      mutate('/api/questions?id=' + catid);
      Alert.success('Question successfully updated', 3000);
    }
  };

  const deleteQuestion = async id => {
    const res = await fetch('/api/questions/' + id, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());

    if (res.error) {
      Alert.error(res.message, 0);
    } else {
      mutate('/api/questions?id=' + catid);
      Alert.success('Question successfully deleted', 3000);
    }
  };

  const addNewQuestion = async () => {
    if (!newRow.body) {
      setDialogText(
        <div className={styles.alertText}>*Please fill in each field</div>
      );
    } else {
      const res = await fetch('/api/questions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: newRow.body,
          type: newRow.type,
          category_id: router.query.category_id,
        }),
      }).then(res => res.json());

      if (res.error) {
        Alert.error(res.message, 0);
      } else {
        setShowNewQuestionDialog(false);
        newRow = { body: null, type: 'likert_scale' };
        mutate('/api/questions?id=' + catid);
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
            onClick={() => {
              mutate('/api/questions?id=' + catid);
              updateQuestion();
            }}>
            <Icon icon="save" />
          </Button>
          <Button
            aria-label={'Cancel'}
            color="red"
            onClick={() => {
              editedRow = null;
              setEditing(null);
              mutate('/api/questions?id=' + catid);
            }}>
            <Icon icon="close" />
          </Button>
        </div>
      );
    } else {
      return (
        <div className={styles.actionButtons}>
          <Button
            aria-label={'Edit Question'}
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
                window.confirm('Are you sure you want to delete this question?')
              ) {
                await deleteQuestion(row.id);
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
        open={showNewQuestionDialog}
        setOpen={setShowNewQuestionDialog}
        title="Please fill in the information of the new question:"
        text={dialogText}
        content={[
          <div key="alertdialog-new-question">
            <label>Body:</label>
            <Input
              id="bodyText"
              className={styles.input}
              onChange={value => (newRow.body = value)}
            />
          </div>,
        ]}
        actions={[
          <Button
            key="alertdialog-edit"
            color="red"
            onClick={() => setShowNewQuestionDialog(false)}>
            Cancel
          </Button>,
          <Button
            id="addQuestion"
            key="alertdialog-confirm"
            onClick={() => addNewQuestion()}
            appearance="primary">
            Add
          </Button>,
        ]}
      />

      <Button
        id="addNewQuestion"
        className={styles.buttons}
        appearance="primary"
        onClick={() => {
          setDialogText(null);
          setShowNewQuestionDialog(true);
        }}>
        <div>Add new question</div>
      </Button>

      <div>
        <Button float="right" appearance="ghost" onClick={() => router.back()}>
          Back
        </Button>
        <CustomTable
          data={data}
          columns={columns}
          renderActionCells={renderActionCells}
          editing={editing}
        />
      </div>
    </div>
  );
}
