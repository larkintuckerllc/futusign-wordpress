import React from 'react';
import styles from './index.scss';
import loading from './loading.png';

const Cover = () => (
  <div
    id={styles.root}
  >
    <img
      id={styles.rootSpinner}
      src={loading}
      alt="spinner"
      width="150"
      height="150"
    />
  </div>
);
export default Cover;
