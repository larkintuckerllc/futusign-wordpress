import React from 'react';
import styles from './index.css';
import bad from './bad.png';

export default () => (
  <div
    id={styles.root}
  >
    <img
      src={bad}
      alt="bad"
      width="113"
      height="150"
    />
  </div>
);
