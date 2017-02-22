import React from 'react';
import styles from './index.scss';
import noSlideDecks from './noSlideDecks.png';

export default () => (
  <div
    id={styles.root}
  >
    <img
      src={noSlideDecks}
      alt="no slide decks"
      width="150"
      height="150"
    />
  </div>
);
