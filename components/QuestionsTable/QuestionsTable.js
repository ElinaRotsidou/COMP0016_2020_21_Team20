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

import styles from './QuestionsTable.module.css';

import { AlertDialog, CustomTable } from '../';
import useSWR from '../../lib/swr';
import { platform } from 'chart.js';

const columns = [
  {
    id: 'question',
    label: 'Question body',
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
            id={'questionInput' + i}
            className={styles.input}
            // key={row.categories.name}
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
  // {
  //   id: 'category',
  //   label: 'Category',
  //   width: 'auto',
  //   render: (edited, row) => row.categories.name,
  // },

  // {
  //   id: 'url',
  //   label: 'Training URL',
  //   width: 'auto',
  //   render: (edited, row) => {
  //     if (edited) {

  //       // If this url is being edited then it needs to be an input box
  //       // Copy all the info about the row being currently edited

  //       const buffer = {};
  //       Object.assign(buffer, row);
  //       editedRow = buffer;
  //       return (
  //         <Input
  //           className={styles.input}
  //           key={row.categories.name}
  //           defaultValue={row.url}
  //           onChange={value => (editedRow.url = value)}
  //         />
  //       );
  //     } else {
  // Else just display URL as link
  //       return (
  //         <a href={row.url} target="_blank" rel="noopener noreferrer">
  //           {row.url}
  //         </a>
  //       );
  //     }
  //   },
  // },
  { id: 'actions', label: 'Actions', width: 'auto' },
];

const useQuestions = () => {
  const { data, error } = useSWR('/api/questions?default_urls=1');

  if (data) {
    return {
      data: data ? data.likert_scale : [],
      error: error || data.error,
      message: data.message,
    };
  }

  return { data: null, error: error, message: error ? error.message : null };
};

// const useStandards = () => {
//   const { data, error } = useSWR('/api/standards');

//   if (data) {
//     return { data: data, error: error || data.error, message: data.message };
//   }

//   return { data: null, error: error, message: error ? error.message : null };
// };

var editedRow = null;
export default function QuestionsTable() {
  const [editing, setEditing] = useState(false);
  const [showNewQuestionDialog, setShowNewQuestionDialog] = useState(false);
  const [showNewPlatformDialog, setShowNewPlatformDialog] = useState(false);
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [dialogText, setDialogText] = useState(null);

  const {
    data: questions,
    error: questionsError,
    message: questionsMessage,
  } = useQuestions();

  // const {
  //   data: standards,
  //   error: standardsError,
  //   message: standardsMessage,
  // } = useStandards();

  var newRow = { body: null, type: 'likert_scale', categories: null };

  if (questionsError) {
    Alert.error(
      `Error: ${questionsMessage}. Please reload/try again later or the contact system administrator`,
      0
    );
  }

  // if (standardsError) {
  //   Alert.error(
  //     `Error: ${standardsMessage}. Please reload/try again later or the contact system administrator`,
  //     0
  //   );
  // }

  const updateQuestion = async () => {
    // console.log('dame' + editedRow);
    // console.log(editedRow);
    const res = await fetch('/api/questions/' + editedRow.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: editedRow.body }),
    }).then(res => res.json());

    if (res.error) {
      Alert.error(res.message, 0);
    } else {
      setEditing(null);
      // Refetch to ensure no stale data
      // mutate('/api/questions?default_urls=1');
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
      // mutate('/api/questions?default_urls=1');
      Alert.success('Question successfully deleted', 3000);
    }
  };

  const addNewQuestion = async () => {
    if (!newRow.body || !newRow.categories) {
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
          categories: newRow.categories,
        }),
      }).then(res => res.json());

      if (res.error) {
        Alert.error(res.message, 0);
      } else {
        setShowNewQuestionDialog(false);
        newRow = { body: null, type: 'likert_scale', categories: null };

        // Refetch to ensure no stale data
        mutate('/api/questions?default_urls=1');
        Alert.success('New question successfully added', 3000);
      }
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

  const addNewCategory = async () => {
    if (!newRow.type || !newRow.platform) {
      setDialogText(
        <div className={styles.alertText}>*Please fill in each field</div>
      );
    } else {
      const res = await fetch('/api/categories/', {
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
    console.log('hi');
    console.log(row);
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
            {/* <label>Standard:</label>
              <br />
              <Input
                id="StandardText"
                className={styles.input}
                onChange={value => (newRow.standard = value)}
              /> */}
            {/* <SelectPicker
                defaultValue={newRow.standard}
                onChange={value => (newRow.standard = value)}
                placeholder={<text id="chooseStandard">Choose Standard</text>}
                data={standards.map(standard => ({
                  label: (
                    <text id={'standard' + standard.id}>{standard.name}</text>
                  ),
                  value: standard.id,
                }))}
              /> */}
            <br />
            {/* <label>Url:</label>
              <br />
              <Input
                id="urlText"
                className={styles.input}
                onChange={value => (newRow.url = value)}
              />
              <br /> */}

            <label>Category:</label>
            <br />
            <Input
              id="categoriesText"
              className={styles.input}
              onChange={value => (newRow.categories = value)}
            />
            <br />
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
        id="addNewQuestion"
        className={styles.buttons}
        appearance="primary"
        onClick={() => {
          setDialogText(null);
          setShowNewQuestionDialog(true);
        }}>
        <div>Add new question</div>
      </Button>
      {/* <Button
        id="addNewPlatform"
        className={styles.buttons}
        appearance="primary"
        onClick={() => {
          setDialogText(null);
          setShowNewPlatformDialog(true);
        }}>
        <div>Add new Platform</div>
      </Button>
      <Button
        id="addNewCategory"
        className={styles.buttons}
        appearance="primary"
        onClick={() => {
          setDialogText(null);
          setShowNewCategoryDialog(true);
        }}>
        <div>Add new Category</div>
      </Button> */}

      <CustomTable
        data={questions}
        columns={columns}
        renderActionCells={renderActionCells}
        editing={editing}
      />
    </div>
  );
}
