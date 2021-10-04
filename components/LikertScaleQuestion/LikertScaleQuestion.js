import PropTypes from 'prop-types';
import styles from './LikertScaleQuestion.module.css';

import { LikertScale, Info } from '..';

function LikertScaleQuestion(props) {
  return (
    <div className={styles.question}>
      <div className={styles.questionText}>
        <text id={'q' + props.questionNumber}>
          {props.questionNumber + '. ' + 'Category: ' + props.questionCategory}
        </text>
      </div>
      <div className={styles.questionText}>
        <text id={'q' + props.questionNumber}>{'    ' + props.question}</text>
      </div>

      {/* <text id={'q' + props.questionNumber}>
          {props.questionNumber + '. ' + props.question + '    ' + props.questionCategory}
        </text> */}
      {/* <Info url={props.questionCategpry} /> */}

      {props.showError && (
        <div className={styles.unAnsweredAlert}>*please choose an answer</div>
      )}

      <LikertScale
        id={props.questionNumber.toString()}
        onChange={value => props.onChange(value)}
      />
    </div>
  );
}

LikertScaleQuestion.propTypes = {
  /** What function a likert scale click triggers */
  onChange: PropTypes.func.isRequired,
  /** The question number of the question */
  questionNumber: PropTypes.number.isRequired,
  /** The training url for the question */
  questionCategory: PropTypes.string.isRequired,
  /** The text of the question */
  question: PropTypes.string.isRequired,
  /** Whether to show the unanswered error text */
  showError: PropTypes.bool.isRequired,
};

export default LikertScaleQuestion;
