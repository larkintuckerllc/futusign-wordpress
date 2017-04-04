import React, { PropTypes } from 'react';
import styles from './index.scss';

const Connected = ({ connected }) => (
  <div
    id={styles.root}
    style={{
      opacity: connected ? 0 : 1,
      borderColor: connected ? '#5cb85c' : '#d9534f',
    }}
  />
);
Connected.propTypes = {
  connected: PropTypes.bool.isRequired,
};
export default Connected;
