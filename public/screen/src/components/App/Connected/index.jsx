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
          borderColor: connected ? 'green' : 'red',
        }}
      />
    );
  }
}
Connected.propTypes = {
  connected: PropTypes.bool.isRequired,
};
export default Connected;
