import React from 'react';
import { Line } from 'react-chartjs-2';
import { Loader, Message } from 'rsuite';
import PropTypes from 'prop-types';

import styles from './linechart.module.css';

const MENTORING_SESSION_POINT_COLOR = 'red';

const baseProperties = {
  fill: false,
  lineTension: 0.1,
  pointBackgroundColor: '#fff',
};

let numberOfScores = 0;

const formatData = data => {
  const formData = {
    labels: data.map(d => new Date(d.timestamp)),
    datasets: [],
  };

  numberOfScores = data[0].scores.length;
  for (let i = 0; i < numberOfScores; i++) {
    const thisData = data.map(d => d.scores[i]);
    const sData = Object.assign({}, baseProperties);
    sData.borderColor = thisData[0].color;
    sData.label = thisData[0].standardName;

    const isMentoringSessions = data.map(d => d.is_mentoring_session);
    sData.pointBackgroundColor = [];
    sData.pointBorderColor = [];
    sData.pointBorderWidth = [];
    sData.pointStyle = [];
    isMentoringSessions.forEach(isMentoringSession => {
      if (isMentoringSession) {
        sData.pointBackgroundColor.push(MENTORING_SESSION_POINT_COLOR);
        sData.pointBorderColor.push(MENTORING_SESSION_POINT_COLOR);
        sData.pointStyle.push('triangle');
        sData.pointBorderWidth.push(4);
      } else {
        sData.pointBackgroundColor.push('white');
        sData.pointBorderColor.push(thisData[0].color);
        sData.pointBorderWidth.push(2);
        sData.pointStyle.push('circle');
      }
    });
    sData.data = thisData.map(s => s.score);
    formData.datasets.push(sData);
  }

  return formData;
};

const legendClickHandler = function (e, legendItem) {
  const chart = this.chart;

  if (legendItem.datasetIndex !== numberOfScores) {
    const index = legendItem.datasetIndex;
    const meta = chart.getDatasetMeta(index);

    meta.hidden =
      meta.hidden === null ? !chart.data.datasets[index].hidden : null;
  } else {
    for (let i = 0; i < numberOfScores; i++) {
      const meta = chart.getDatasetMeta(i);
      meta.hidden =
        meta.hidden === null ? !chart.data.datasets[i].hidden : null;
    }
  }

  chart.update();
};

function LineChart({ data } = {}) {
  const isDarkTheme = () => {
    if (typeof document === 'undefined') return false;
    return document.body.dataset.theme === 'dark';
  };

  if (data === null) {
    return (
      <Loader className={styles.loading} size="lg" content="Loading data..." />
    );
  } else if (data.length) {
    return (
      <>
        <h2 className={styles.title}>Self-reporting over time</h2>
        <p className={styles.legend}>
          Click on the legend to toggle responses.
        </p>
        <Line
          data={formatData(data)}
          options={{
            tooltips: {
              callbacks: {
                title: tooltip => new Date(tooltip[0].label).toDateString(),
                afterTitle: (tooltip, data) =>
                  data.datasets[tooltip[0].datasetIndex].pointBackgroundColor[
                    tooltip[0].index
                  ] === MENTORING_SESSION_POINT_COLOR && 'Mentoring session',
                labelColor: (tooltip, data) => {
                  return {
                    borderColor:
                      data.legend.legendItems[tooltip.datasetIndex].fillStyle,
                    backgroundColor:
                      data.legend.legendItems[tooltip.datasetIndex].fillStyle,
                  };
                },
              },
            },
            scales: {
              xAxes: [
                {
                  ticks: { maxRotation: 0, fontColor: 'darkgray' },
                  type: 'time',
                  time: { unit: 'day' },
                  gridLines: {
                    color: isDarkTheme()
                      ? 'rgba(220, 220, 220, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)',
                  },
                },
              ],
              yAxes: [
                {
                  ticks: { fontColor: 'darkgray' },
                  gridLines: {
                    color: isDarkTheme()
                      ? 'rgba(220, 220, 220, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)',
                  },
                },
              ],
            },
            legend: {
              labels: { fontColor: isDarkTheme() ? '#9C9C9D' : '#666' },
              onClick: legendClickHandler, // To add 'invert selection' option to legend
            },
          }}
        />
      </>
    );
  }

  return (
    <Message
      className={styles.message}
      type="info"
      title="No results found"
      description={
        <p>Please try setting a broader date range and/or filter.</p>
      }
    />
  );
}

LineChart.propTypes = {
  /** Array containing objects consisting of: isMentoringSession, scores array and timestamp */
  data: PropTypes.array,
};

export default LineChart;
