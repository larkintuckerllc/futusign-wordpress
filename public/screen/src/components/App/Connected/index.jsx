import React, { Component, PropTypes } from 'react';
import styles from './index.scss';

class Connected extends Component {
  componentDidMount() {
    // const { connected } = this.props;
  }
  render() {
    const { connected } = this.props;
    return (
      <div
        id={styles.root}
        style={{
          opacity: connected ? 0 : 1,
          borderColor: connected ? '#5cb85c' : '#d9534f',
        }}
      />
    );
  }
}
Connected.propTypes = {
  connected: PropTypes.bool.isRequired,
};
export default Connected;
