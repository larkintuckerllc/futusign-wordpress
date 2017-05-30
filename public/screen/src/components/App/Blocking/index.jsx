import React from 'react';
import styles from './index.scss';
import spinner from './spinner.png';

// TODO: PUT BAK SPINNER
export default () => (
  <div
    id={styles.root}
  >
    <img
      id={styles.rootSpinnerZ}
      src={spinner}
      alt="spinner"
      width="150"
      height="150"
    />
  </div>
);
