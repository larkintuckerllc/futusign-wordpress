import React from 'react';
import styles from './index.css';
import spinner from './spinner.png';

export default () => (
  <div
    id={styles.root}
  >
    <img
      id={styles.rootSpinner}
      src={spinner}
      alt="spinner"
      width="150"
      height="150"
    />
  </div>
);
