import { shallow, mount } from 'enzyme';
import React from 'react';

import LeaveButton from './LeaveButton.js';

describe('LeaveButton', () => {
  it('renders', () => {
    const wrapper = shallow(<LeaveButton />);

    expect(wrapper.exists()).toBe(true);
  });

  it('displays text', () => {
    const wrapper = mount(<LeaveButton />);

    expect(wrapper.find('div').text()).toBe('Leave Platform');
  });

  it('click displays pop up', () => {
    const wrapper = mount(<LeaveButton />);

    wrapper.find('div').simulate('click');
    expect(
      wrapper.findWhere(n =>
        n.contains('Are you sure you want to leave your platform?')
      )
    );
  });
});
