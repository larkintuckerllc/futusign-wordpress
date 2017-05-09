import React from 'react';
import styles from './index.scss';
import offline from './offline.png';

const PlayerImages = () => {
  const file = window.localStorage.getItem('futusign_image_file');
  return (
    <div
      id={styles.root}
      style={{ backgroundImage: `url(${file})` }}
    >
      <div
        id={styles.rootOffline}
        style={{ backgroundImage: `url(${offline})` }}
      />
    </div>
  );
};
export default PlayerImages;
