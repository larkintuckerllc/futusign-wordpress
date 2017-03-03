import React, { Component, PropTypes } from 'react';
import styles from './index.scss';
import loading from './loading.png';

class PlayerLoading extends Component {
  componentDidMount() {
    const { done } = this.props;
    window.setTimeout(() => {
      document.getElementById('futusign_cover').style.opacity = 1;
    }, 1000);
    window.setTimeout(done, 2000);
  }
  render() {
    return (
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
  }
}
PlayerLoading.propTypes = {
  done: PropTypes.func.isRequired,
};
export default PlayerLoading;
