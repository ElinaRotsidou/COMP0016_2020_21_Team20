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

import { AlertDialog, CustomTable } from '..';
import useSWR from '../../lib/swr';
import { platform } from 'chart.js';

const useQuestions = () => {
  const { data, error } = useSWR('/api/questions?default_urls=1');

  if (data) {
    console.log(data);

    return {
      data: data ? data.likert_scale : [],
      error: error || data.error,
      message: data.message,
    };
  }

  return { data: null, error: error, message: error ? error.message : null };
};

var editedRow = null;
export default function Testing() {
  const [editing, setEditing] = useState(false);
  const [showNewQuestionDialog, setShowNewQuestionDialog] = useState(false);
  const [dialogText, setDialogText] = useState(null);

  const {
    data: questions,
    error: questionsError,
    message: questionsMessage,
  } = useQuestions();

  var newRow = {
    body: null,
    url: null,
    type: 'likert_scale',
    categories: null,
    platform: null,
  };

  if (questionsError) {
    Alert.error(
      `Error: ${questionsMessage}. Please reload/try again later or the contact system administrator`,
      0
    );
  }

  const updateQuestion = async () => {
    const res = await fetch('/api/questions/' + editedRow.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: editedRow.body, url: editedRow.url }),
    }).then(res => res.json());

    if (res.error) {
      Alert.error(res.message, 0);
    } else {
      setEditing(null);
      // Refetch to ensure no stale data
      mutate('/api/questions?default_urls=1');
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
      // Refetch to ensure no stale data
      mutate('/api/questions?default_urls=1');
      Alert.success('Question successfully deleted', 3000);
    }
  };

  const addNewQuestion = async () => {
    if (!newRow.body || !newRow.url || !newRow.categories || !newRow.platform) {
      setDialogText(
        <div className={styles.alertText}>*Please fill in each field</div>
      );
    } else {
      const res = await fetch('/api/questions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: newRow.body,
          url: newRow.url,
          type: newRow.type,
          categories: newRow.categories,
          platform: newRow.platform,
        }),
      }).then(res => res.json());

      if (res.error) {
        Alert.error(res.message, 0);
      } else {
        setShowNewQuestionDialog(false);
        newRow = {
          body: null,
          url: null,
          type: 'likert_scale',
          categories: null,
          platform: null,
        };
        // Refetch to ensure no stale data
        mutate('/api/questions?default_urls=1');
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
            onClick={() => updateQuestion()}>
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
              mutate('/api/questions?default_urls=1');
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
            appearance="primary"
            onClick={() => setEditing(i)}>
            <Icon icon="pencil" />
          </Button>
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
            Delete
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
            <br />
            <label>Url:</label>
            <br />
            <Input
              id="urlText"
              className={styles.input}
              onChange={value => (newRow.url = value)}
            />
            <br />

            <label>Category:</label>
            <br />
            <Input
              id="categoriesText"
              className={styles.input}
              onChange={value => (newRow.categories = value)}
            />
            <br />

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
    </div>
  );
}
