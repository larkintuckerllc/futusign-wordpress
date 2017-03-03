import React, { Component, PropTypes } from 'react';
import styles from './index.scss';
import loading from './loading.png';

class PlayerLoading extends Component {
  componentDidMount() {
    const { done } = this.props;
    document.getElementById('futusign_cover').style.opacity = 0;
    this.coverTimeout = window.setTimeout(() => {
      document.getElementById('futusign_cover').style.opacity = 1;
      this.coverTimeout = window.setTimeout(done, 1000);
    }, 3000);
  }
  componentWillUnmount() {
    window.clearTimeout(this.coverTimeout);
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
