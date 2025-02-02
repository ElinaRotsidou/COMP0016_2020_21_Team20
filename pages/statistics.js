import querystring from 'querystring';
import { useState } from 'react';
import { Alert } from 'rsuite';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import PropTypes from 'prop-types';

import styles from './statistics.module.css';

import {
  LineChart,
  Header,
  Filters,
  LoginMessage,
  NoAccess,
} from '../components';

import useSWR from '../lib/swr';
import { Roles, Visualisations } from '../lib/constants';

const DEFAULT_DATE_OFFSET = 60 * 60 * 24 * 30 * 1000; // 30 days ago;

const generateQueryParams = ({
  start = new Date().getTime() - DEFAULT_DATE_OFFSET,
  end = new Date().getTime(),
  isMentoringSession = null,
  dataToDisplayOverride,
} = {}) => {
  const query = { from: start, to: end };

  if (isMentoringSession === true) {
    query.only_is_mentoring_session = '1';
  } else if (isMentoringSession === false) {
    query.only_not_mentoring_session = '1';
  }

  if (dataToDisplayOverride) {
    query[dataToDisplayOverride.key] = dataToDisplayOverride.value;
  }

  return querystring.stringify(query);
};

export async function getServerSideProps(context) {
  return { props: { session: await getSession(context) } };
}

/**
 * The statistics page allows users to visualise responses submitted in the SelfReporting form.
 * If the user is not logged in, they are prompted to login.
 *
 * It is accessible to clinicians, department managers, hospitals, and health boards.
 * Any other users do not have access to this page.
 *
 * The Statistics page shows different filters based on their user type, which is explained
 * in the Filters component.
 *
 * This page uses the /api/responses endpoint to fetch the relevant data.
 *
 * @param session the user's session object to decide what to display
 * @param toggleTheme the global function to toggle the current theme
 */

function Statistics({ session, toggleTheme }) {
  const [isMentoringSession, setIsMentoringSession] = useState(null);
  const [dataToDisplayOverride, setDataToDisplayOverride] = useState(null);
  const [visualisationType, setVisualisationType] = useState(
    Visualisations.LINE_CHART
  );
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getTime() - DEFAULT_DATE_OFFSET),
    end: new Date(),
  });

  // When the state is updated, this will re-fetch from the API with the newly required query parameters
  const { data, error } = useSWR(
    `/api/responses?${generateQueryParams({
      start: dateRange.start.getTime(),
      end: dateRange.end.getTime(),
      isMentoringSession,
      dataToDisplayOverride,
    })}`
  );

  var localData, localError, localMessage;
  if (data) {
    localData = data;
    localError = error || data.error;
    localMessage = data.message;
  } else {
    localData = null;
    localError = error;
    localMessage = error ? error.message : null;
  }

  if (localError) {
    Alert.error(
      "Error: '" +
        localMessage +
        "'. Please reload/try again later or the contact system administrator",
      0
    );
  }

  if (!session) {
    return (
      <div>
        <Header session={session} toggleTheme={toggleTheme} />
        <LoginMessage />
      </div>
    );
  }

  if (
    !session.user.roles.includes(Roles.USER_TYPE_ADMIN) &&
    !session.user.roles.includes(Roles.USER_TYPE_USER)
  ) {
    return (
      <div>
        <Header session={session} toggleTheme={toggleTheme} />
        <NoAccess />
      </div>
    );
  }

  const dataToSend =
    !localError && localData
      ? localData.responses.map(d => ({
          is_mentoring_session: d.is_mentoring_session,
          timestamp: d.timestamp,
          scores: d.scores.map(s => ({
            score: s.score,
            standardName: 'question',
            color: '#2f5596',
          })),
        }))
      : null;

  return (
    <div>
      <Head>
        <title>Statistics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header session={session} toggleTheme={toggleTheme} />

      <div className={styles.content}>
        <div className={styles.filters}>
          <Filters
            session={session}
            dateRange={dateRange}
            setDateRange={setDateRange}
            visualisationType={visualisationType}
            setVisualisationType={setVisualisationType}
            isMentoringSession={isMentoringSession}
            setIsMentoringSession={setIsMentoringSession}
            dataToDisplayOverride={dataToDisplayOverride}
            setDataToDisplayOverride={setDataToDisplayOverride}
          />
        </div>

        <div className={styles.graph}>
          {visualisationType === Visualisations.LINE_CHART ? (
            <LineChart data={dataToSend} />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
}

Statistics.propTypes = {
  session: PropTypes.object.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Statistics;
