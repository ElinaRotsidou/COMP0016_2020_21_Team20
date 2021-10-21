import { shallow, mount } from 'enzyme';
import React from 'react';

import Filters from './Filters.js';
import { Roles } from '../../lib/constants';

describe('Filters', () => {
  it('renders', () => {
    const wrapper = shallow(
      <Filters
        session={{ user: { roles: Roles.USER_TYPE_USER } }}
        dateRange={new Date()}
      />
    );

    expect(wrapper.exists()).toBe(true);
  });

  it('shows correct filters for user type', () => {
    const wrapper = mount(
      <Filters
        session={{ user: { roles: Roles.USER_TYPE_USER } }}
        dateRange={new Date()}
      />
    );

    expect(wrapper.findWhere(n => n.contains('Date Range')).exists()).toBe(
      true
    );
    expect(wrapper.findWhere(n => n.contains('Visualisation')).exists()).toBe(
      true
    );
    expect(wrapper.findWhere(n => n.contains('Mentoring?')).exists()).toBe(
      true
    );
  });

  it('shows correct filters for admin type', () => {
    const wrapper = mount(
      <Filters
        session={{ user: { roles: Roles.USER_TYPE_ADMIN } }}
        dateRange={new Date()}
      />
    );

    expect(wrapper.findWhere(n => n.contains('Date Range')).exists()).toBe(
      true
    );
    expect(wrapper.findWhere(n => n.contains('Visualisation')).exists()).toBe(
      true
    );
    expect(wrapper.findWhere(n => n.contains('Mentoring?')).exists()).toBe(
      true
    );
    expect(wrapper.findWhere(n => n.contains('Group')).exists()).toBe(true);
  });
});
