import { mount } from 'enzyme';
import React from 'react';

import { Button, Icon } from 'rsuite';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import CustomTable from './CustomTable.js';

const wrapper = mount(
  <CustomTable
    host="example.com"
    data={['']}
    columns={[
      {
        id: 'platform',
        label: 'Platform Name',
        width: 'auto',
        render: () => null,
      },
      {
        id: 'url',
        label: 'Join URL',
        width: 'auto',
        render: () => null,
      },
      { id: 'actions', label: 'Actions', width: 'auto' },
    ]}
    renderActionCells={() => {
      return (
        <div>
          <Button color="red" onClick={() => null}>
            Delete
          </Button>
        </div>
      );
    }}
    editing={false}
  />
);

describe('CustomTable', () => {
  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('shows headings', () => {
    expect(wrapper.findWhere(n => n.contains('Platform Name')));
    expect(wrapper.findWhere(n => n.contains('Join URL')));
    expect(wrapper.findWhere(n => n.contains('Actions')));
  });

  it('shows actions', () => {
    expect(
      wrapper.findWhere(n => n.type() === 'Button' && n.contains('Delete'))
    );
  });
});
