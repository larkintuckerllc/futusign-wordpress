import React from 'react';
import styles from './index.scss';
import offline from './offline.png';

export default () => (
  <div
    id={styles.root}
  >
    <img
      src={offline}
      alt="offline"
      width="150"
      height="150"
    />
  </div>
);
