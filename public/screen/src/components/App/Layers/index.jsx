import React, { PropTypes } from 'react';
import styles from './index.scss';

const Layers = ({ layers }) => (
  <div id={styles.root}>
    {layers.map((o, i) => (
      <iframe
        key={i.toString()}
        src={o.url}
        frameBorder="0"
        style={{
          zIndex: i,
        }}
        className={styles.rootLayer}
      />
    ))}
  </div>
);
Layers.propTypes = {
  layers: PropTypes.array.isRequired,
};
export default Layers;
