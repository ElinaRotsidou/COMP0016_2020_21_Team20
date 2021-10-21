import { shallow, mount } from 'enzyme';
import React from 'react';

import LikertScaleQuestion from './LikertScaleQuestion.js';

describe('LikertScaleQuestion', () => {
  it('renders', () => {
    const wrapper = shallow(
      <LikertScaleQuestion
        onChange={() => null}
        questionNumber={1}
        questionCategory={1}
        question="This is a good test question?"
        showError={false}
      />
    );

    expect(wrapper.exists()).toBe(true);
  });

  it('displays question', () => {
    const testQuestion = 'This is a good test question?';
    const testNumber = 1;
    const testCategory = 1;
    const wrapper = mount(
      <LikertScaleQuestion
        onChange={() => null}
        questionNumber={testNumber}
        questionCategory={testCategory}
        question={testQuestion}
        showError={false}
      />
    );

    expect(
      wrapper.findWhere(n => n.contains(testNumber + '. ' + testQuestion))
    );
  });
});
