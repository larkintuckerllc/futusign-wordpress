import React, { Component, PropTypes } from 'react';
import styles from './index.scss';

class Overlay extends Component {
  componentDidMount() {
  }
  render() {
    const { overlay, ovWidgets } = this.props;
    let upperLeft = null;
    if (overlay.upperLeft !== null) {
      const widget = ovWidgets.find(o => o.id === overlay.upperLeft);
      if (widget !== undefined) {
        upperLeft = widget.url;
      }
    }
    window.console.log('RENDER');
    window.console.log(upperLeft);
    return (
      <table id={styles.root}>
        <tbody>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
          <tr>
            <td>4</td>
            <td>5</td>
            <td>6</td>
          </tr>
          <tr>
            <td>7</td>
            <td>8</td>
            <td>9</td>
          </tr>
        </tbody>
      </table>
    );
  }
}
Overlay.propTypes = {
  overlay: PropTypes.object.isRequired,
  ovWidgets: PropTypes.array.isRequired,
};
export default Overlay;
