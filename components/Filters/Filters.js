import { SelectPicker, DateRangePicker, Icon } from 'rsuite';
import { useState } from 'react';
import PropTypes from 'prop-types';

import { Roles, Visualisations } from '../../lib/constants';

const subtractDays = days => {
  const now = new Date().getTime();
  return new Date(now - days * 24 * 60 * 60 * 1000);
};

export function Filters({ session, ...props }) {
  const [platforms, setPlatforms] = useState([]);

  const renderExtraFilters = () => {
    if (session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      return (
        <>
          <p>Group</p>
          <SelectPicker
            value={
              props.dataToDisplayOverride === null
                ? 'platform'
                : `${props.dataToDisplayOverride.key}-${props.dataToDisplayOverride.value}`
            }
            onOpen={() =>
              fetch('/api/platforms')
                .then(res => res.json())
                .then(res => setPlatforms(res))
            }
            onChange={value => {
              if (value === 'platform') {
                props.setDataToDisplayOverride(null);
              } else {
                const split = value.split('-');
                props.setDataToDisplayOverride({
                  key: split[0],
                  value: split[1],
                });
              }
            }}
            searchable={true}
            placeholder="Select"
            cleanable={false}
            block={true}
            data={[
              {
                label: 'My Platforms',
                value: 'platform',
                type: 'Platform',
              },
              ...platforms.map(p => ({
                label: p.name,
                value: `platform_id-${p.id}`,
                type: 'Platform',
              })),
            ]}
            groupBy="type"
            renderMenu={menu =>
              platforms.length ? menu : <Icon icon="spinner" spin />
            }
          />
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p>
            Each line represents a question that is in the chosen database.
            <p>
              Each dot accross the line represents the score of that questions'
              response a user made based on the scale that is in place (0-6)
            </p>
          </p>
        </>
      );
    }

    return <span />;
  };

  const getMentoringValue = () => {
    if (props.isMentoringSession === true) return 'yes';
    else if (props.isMentoringSession === false) return 'no';
    else return 'any';
  };

  return (
    <div>
      <p>Date Range</p>
      <DateRangePicker
        aria-label="Date Range"
        aria-expanded="false"
        showOneCalendar
        onChange={([start, end]) => props.setDateRange({ start, end })}
        value={[props.dateRange.start, props.dateRange.end]}
        isoWeek={true}
        cleanable={false}
        block={true}
        disabledDate={DateRangePicker.afterToday()}
        ranges={[
          { label: 'Last 7 days', value: [subtractDays(7), new Date()] },
          { label: 'Last 30 days', value: [subtractDays(30), new Date()] },
          { label: 'Last year', value: [subtractDays(365), new Date()] },
        ]}
      />

      <p>Visualisation</p>
      <SelectPicker
        aria-label="Visualisation type filter"
        aria-expanded="false"
        value={props.visualisationType}
        onChange={value => props.setVisualisationType(value)}
        searchable={false}
        placeholder="Select"
        cleanable={false}
        block={true}
        data={[
          {
            label: <text id="lineChart">Line Chart</text>,
            value: Visualisations.LINE_CHART,
          },
        ]}
      />

      <p>Mentoring?</p>
      <SelectPicker
        aria-label="Mentoring session filter"
        aria-expanded="false"
        value={getMentoringValue()}
        onChange={value => {
          if (value === 'yes') props.setIsMentoringSession(true);
          else if (value === 'no') props.setIsMentoringSession(false);
          else props.setIsMentoringSession(null);
        }}
        searchable={false}
        placeholder="Select"
        cleanable={false}
        block={true}
        data={[
          { label: 'Any', value: 'any' },
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
      />

      {props.isMentoringSession === true ||
        (props.isMentoringSession === null && (
          <i>Triangles represent a mentoring session point</i>
        ))}

      {renderExtraFilters()}
    </div>
  );
}

Filters.propTypes = {
  /** The user's session object to decide what to display */
  session: PropTypes.object,

  /** Controlled value representing the selected date range, with `start` and `end` properties containing Date instances */
  dateRange: PropTypes.object.isRequired,
  /** Controlled value representing if the user has selected mentoring sessions to be shown */
  isMentoringSession: PropTypes.bool,
  /** Controlled value representing which visualisation type the user has selected */
  visualisationType: PropTypes.oneOf(Object.keys(Visualisations)).isRequired,
  /** Controlled value representing if there is any data entity to override */
  dataToDisplayOverride: PropTypes.object,

  /** Callback function to be called when the mentoring session filter is toggled */
  setIsMentoringSession: PropTypes.func.isRequired,
  /** Callback function to be called when the overriden group filter is toggled */
  setDataToDisplayOverride: PropTypes.func,
  /** Callback function to be called when the date range filter is changed */
  setDateRange: PropTypes.func,
  /** Callback function to be called when the visualisation type filter is toggled */
  setVisualisationType: PropTypes.func,
};

export default Filters;
