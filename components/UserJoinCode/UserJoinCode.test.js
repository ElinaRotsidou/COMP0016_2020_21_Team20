import { shallow, mount } from 'enzyme';
import React from 'react';

import UserJoinCode from './UserJoinCode.js';

describe('UserJoinCode', () => {
  it('renders', () => {
    const wrapper = shallow(<UserJoinCode host="example.com" />);

    expect(wrapper.exists()).toBe(true);
  });

  it('has copy button', () => {
    const wrapper = mount(<UserJoinCode host="example.com" />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Copy to clipboard')
      )
    );
  });

  it('has re-generate URL button', () => {
    const wrapper = mount(<UserJoinCode host="example.com" />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Re-generate URL')
      )
    );
  });

  it('shows host', () => {
    const testHost = 'example.com';
    const wrapper = mount(<UserJoinCode host={testHost} />);

    expect(wrapper.findWhere(n => n.contains(testHost)));
  });
});
