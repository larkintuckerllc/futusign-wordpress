import React, { PropTypes } from 'react';
import styles from './index.scss';

const Overlay = ({ overlay, ovWidgets }) => {
  let upperLeft = null;
  if (overlay.upperLeft !== null) {
    const widget = ovWidgets.find(o => o.id === overlay.upperLeft);
    if (widget !== undefined) {
      upperLeft = `${widget.url}?position=upper-left`;
    }
  }
  let upperMiddle = null;
  if (overlay.upperMiddle !== null) {
    const widget = ovWidgets.find(o => o.id === overlay.upperMiddle);
    if (widget !== undefined) {
      upperMiddle = `${widget.url}?position=upper-middle`;
    }
  }
  let upperRight = null;
  if (overlay.upperRight !== null) {
    const widget = ovWidgets.find(o => o.id === overlay.upperRight);
    if (widget !== undefined) {
      upperRight = `${widget.url}?position=upper-right`;
    }
  }
  let middleLeft = null;
  if (overlay.middleLeft !== null) {
    const widget = ovWidgets.find(o => o.id === overlay.middleLeft);
    if (widget !== undefined) {
      middleLeft = `${widget.url}?position=middle-left`;
    }
  }
  let middleRight = null;
  if (overlay.middleRight !== null) {
    const widget = ovWidgets.find(o => o.id === overlay.middleRight);
    if (widget !== undefined) {
      middleRight = `${widget.url}?position=middle-right`;
    }
  }
  let lowerLeft = null;
  if (overlay.lowerLeft !== null) {
    const widget = ovWidgets.find(o => o.id === overlay.lowerLeft);
    if (widget !== undefined) {
      lowerLeft = `${widget.url}?position=lower-left`;
    }
  }
  let lowerMiddle = null;
  if (overlay.lowerMiddle !== null) {
    const widget = ovWidgets.find(o => o.id === overlay.lowerMiddle);
    if (widget !== undefined) {
      lowerMiddle = `${widget.url}?position=lower-middle`;
    }
  }
  let lowerRight = null;
  if (overlay.lowerRight !== null) {
    const widget = ovWidgets.find(o => o.id === overlay.lowerRight);
    if (widget !== undefined) {
      lowerRight = `${widget.url}?position=lower-right`;
    }
  }
  return (
    <table id={styles.root}>
      <tbody>
        <tr>
          <td>
            {upperLeft !== null && (
              <iframe
                frameBorder="0"
                scrolling="no"
                className={styles.rootWidget}
                src={upperLeft}
              />
            )}
          </td>
          <td>
            {upperMiddle !== null && (
              <iframe
                frameBorder="0"
                className={styles.rootWidget}
                src={upperMiddle}
              />
            )}
          </td>
          <td>
            {upperRight !== null && (
              <iframe
                frameBorder="0"
                scrolling="no"
                className={styles.rootWidget}
                src={upperRight}
              />
            )}
          </td>
        </tr>
        <tr>
          <td>
            {middleLeft !== null && (
              <iframe
                frameBorder="0"
                scrolling="no"
                className={styles.rootWidget}
                src={middleLeft}
              />
            )}
          </td>
          <td />
          <td>
            {middleRight !== null && (
              <iframe
                frameBorder="0"
                scrolling="no"
                className={styles.rootWidget}
                src={middleRight}
              />
            )}
          </td>
        </tr>
        <tr>
          <td>
            {lowerLeft !== null && (
              <iframe
                frameBorder="0"
                scrolling="no"
                className={styles.rootWidget}
                src={lowerLeft}
              />
            )}
          </td>
          <td>
            {lowerMiddle !== null && (
              <iframe
                frameBorder="0"
                scrolling="no"
                className={styles.rootWidget}
                src={lowerMiddle}
              />
            )}
          </td>
          <td>
            {lowerRight !== null && (
              <iframe
                frameBorder="0"
                scrolling="no"
                className={styles.rootWidget}
                src={lowerRight}
              />
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
Overlay.propTypes = {
  overlay: PropTypes.object.isRequired,
  ovWidgets: PropTypes.array.isRequired,
};
export default Overlay;
