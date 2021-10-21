import { shallow, mount } from 'enzyme';
import React from 'react';

import CategoriesTable from './CategoriesTable.js';

describe('CategoriesTable', () => {
  it('renders', () => {
    const wrapper = shallow(<CategoriesTable />);

    expect(wrapper.exists()).toBe(true);
  });

  it('shows headings', () => {
    const wrapper = mount(<CategoriesTable />);

    expect(wrapper.findWhere(n => n.contains('Categories')));
    expect(wrapper.findWhere(n => n.contains('Actions')));
  });

  it('shows add category button', () => {
    const wrapper = mount(<CategoriesTable />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Add new category')
      )
    );
  });
});
