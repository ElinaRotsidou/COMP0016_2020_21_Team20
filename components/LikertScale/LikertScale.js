import { useState } from 'react';
import { Radio, RadioGroup } from 'rsuite';

import PropTypes from 'prop-types';
import styles from './LikertScale.module.css';

const options = {
  'Strongly Disagree (0)': 0,
  'Somewhat Disagree (1)': 1,
  'Disagree (2)': 2,
  'Neutral (3)': 3,
  'Agree (4)': 4,
  'Somewhat Agree (5)': 5,
  'Strongly Agree (6)': 6,
};

function LikertScale(props) {
  const [value, setValue] = useState(null);

  const updateValue = value => {
    setValue(value);
    props.onChange(value);
  };

  const id = props.id || 'likert-scale';

  return (
    <RadioGroup
      id={id}
      className={styles.likertScaleWrapper}
      value={value}
      inline
      onChange={score => updateValue(score)}
      appearance="picker">
      {Object.entries(options).map(([text, score], i) => {
        return (
          <Radio
            inline
            key={i}
            className={styles.likertScale}
            value={score}
            title={text}>
            {value === score ? (
              <strong id={'q' + id.toString() + 'a' + score.toString()}>
                {text}
              </strong>
            ) : (
              <text id={'q' + id.toString() + 'a' + score.toString()}>
                {text}
              </text>
            )}
          </Radio>
        );
      })}
    </RadioGroup>
  );
}

LikertScale.propTypes = {
  /** What function a likert scale click triggers */
  onChange: PropTypes.func.isRequired,
  /** The id of the LikertScale question */
  id: PropTypes.string,
};

export default LikertScale;
