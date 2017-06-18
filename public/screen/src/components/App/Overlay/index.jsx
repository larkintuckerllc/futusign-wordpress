import React, { PropTypes } from 'react';
import styles from './index.scss';

const Overlay = ({ overlay, ovWidgets }) => {
  let upper = null;
  if (overlay.upper !== null) {
    const widget = ovWidgets.find(o => o.id === overlay.upper);
    if (widget !== undefined) {
      upper = `${widget.url}?position=upper`;
    }
  }
  let middleRow = null;
  if (overlay.middleRow !== null) {
    const widget = ovWidgets.find(o => o.id === overlay.middleRow);
    if (widget !== undefined) {
      middleRow = `${widget.url}?position=middle-row`;
    }
  }
  let lower = null;
  if (overlay.lower !== null) {
    const widget = ovWidgets.find(o => o.id === overlay.lower);
    if (widget !== undefined) {
      lower = `${widget.url}?position=lower`;
    }
  }
  let left = null;
  if (overlay.left !== null) {
    const widget = ovWidgets.find(o => o.id === overlay.left);
    if (widget !== undefined) {
      left = `${widget.url}?position=left`;
    }
  }
  let middleColumn = null;
  if (overlay.middleColumn !== null) {
    const widget = ovWidgets.find(o => o.id === overlay.middleColumn);
    if (widget !== undefined) {
      middleColumn = `${widget.url}?position=middle-column`;
    }
  }
  let right = null;
  if (overlay.right !== null) {
    const widget = ovWidgets.find(o => o.id === overlay.right);
    if (widget !== undefined) {
      right = `${widget.url}?position=right`;
    }
  }
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
  let middleMiddle = null;
  if (overlay.middleMiddle !== null) {
    const widget = ovWidgets.find(o => o.id === overlay.middleMiddle);
    if (widget !== undefined) {
      middleMiddle = `${widget.url}?position=middle-middle`;
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
    <div>
      <table id={styles.rootCourseRow} className={styles.rootGrid}>
        <tbody>
          <tr>
            <td>
              {upper !== null && (
                <iframe
                  frameBorder="0"
                  scrolling="no"
                  className={styles.rootGridWidget}
                  src={upper}
                />
              )}
            </td>
          </tr>
          <tr>
            <td>
              {middleRow !== null && (
                <iframe
                  frameBorder="0"
                  scrolling="no"
                  className={styles.rootGridWidget}
                  src={middleRow}
                />
              )}
            </td>
          </tr>
          <tr>
            <td>
              {lower !== null && (
                <iframe
                  frameBorder="0"
                  scrolling="no"
                  className={styles.rootGridWidget}
                  src={lower}
                />
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <table id={styles.rootCourseColumn} className={styles.rootGrid}>
        <tbody>
          <tr>
            <td>
              {left !== null && (
                <iframe
                  frameBorder="0"
                  scrolling="no"
                  className={styles.rootGridWidget}
                  src={left}
                />
              )}
            </td>
            <td>
              {middleColumn !== null && (
                <iframe
                  frameBorder="0"
                  scrolling="no"
                  className={styles.rootGridWidget}
                  src={middleColumn}
                />
              )}
            </td>
            <td>
              {right !== null && (
                <iframe
                  frameBorder="0"
                  scrolling="no"
                  className={styles.rootGridWidget}
                  src={right}
                />
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <table id={styles.rootFine} className={styles.rootGrid}>
        <tbody>
          <tr>
            <td>
              {upperLeft !== null && (
                <iframe
                  frameBorder="0"
                  scrolling="no"
                  className={styles.rootGridWidget}
                  src={upperLeft}
                />
              )}
            </td>
            <td>
              {upperMiddle !== null && (
                <iframe
                  frameBorder="0"
                  scrolling="no"
                  className={styles.rootGridWidget}
                  src={upperMiddle}
                />
              )}
            </td>
            <td>
              {upperRight !== null && (
                <iframe
                  frameBorder="0"
                  scrolling="no"
                  className={styles.rootGridWidget}
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
                  className={styles.rootGridWidget}
                  src={middleLeft}
                />
              )}
            </td>
            <td>
              {middleMiddle !== null && (
                <iframe
                  frameBorder="0"
                  scrolling="no"
                  className={styles.rootGridWidget}
                  src={middleMiddle}
                />
              )}
            </td>
            <td>
              {middleRight !== null && (
                <iframe
                  frameBorder="0"
                  scrolling="no"
                  className={styles.rootGridWidget}
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
                  className={styles.rootGridWidget}
                  src={lowerLeft}
                />
              )}
            </td>
            <td>
              {lowerMiddle !== null && (
                <iframe
                  frameBorder="0"
                  scrolling="no"
                  className={styles.rootGridWidget}
                  src={lowerMiddle}
                />
              )}
            </td>
            <td>
              {lowerRight !== null && (
                <iframe
                  frameBorder="0"
                  scrolling="no"
                  className={styles.rootGridWidget}
                  src={lowerRight}
                />
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
Overlay.propTypes = {
  overlay: PropTypes.object.isRequired,
  ovWidgets: PropTypes.array.isRequired,
};
export default Overlay;
