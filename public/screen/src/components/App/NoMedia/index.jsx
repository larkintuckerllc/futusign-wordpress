import React from 'react';
import styles from './index.scss';
import noMedia from './noMedia.png';

export default () => (
  <div
    id={styles.root}
  >
    <img
      src={noMedia}
      alt="no media"
      width="150"
      height="150"
    />
  </div>
);
