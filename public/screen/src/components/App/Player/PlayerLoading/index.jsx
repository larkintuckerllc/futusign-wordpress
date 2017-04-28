import React, { Component, PropTypes } from 'react';
import { LOADING } from '../../../../strings';
import styles from './index.scss';
import loading from './loading.png';

class PlayerLoading extends Component {
  constructor(props) {
    super(props);
    this.stopTimeout = null;
  }
  componentWillReceiveProps(upProps) {
    const { currentlyIsPlaying, currentlyPlaying, setCurrentlyIsPlaying } = this.props;
    const upCurrentlyIsPlaying = upProps.currentlyIsPlaying;
    if (
      currentlyPlaying === LOADING &&
      !currentlyIsPlaying &&
      upCurrentlyIsPlaying
    ) {
      this.stopTimeout = window.setTimeout(() => setCurrentlyIsPlaying(false), 5000);
    }
  }
  shouldComponentUpdate(upProps) {
    const { currentlyPlaying } = this.props;
    const upCurrentlyPlaying = upProps.currentlyPlaying;
    if (currentlyPlaying !== upCurrentlyPlaying) return true;
    return false;
  }
  componentWillUnmount() {
    window.clearTimeout(this.stopTimeout);
  }
  render() {
    const { currentlyPlaying } = this.props;
    return (
      <div
        id={styles.root}
      >
        {currentlyPlaying === LOADING &&
          <img
            id={styles.rootSpinner}
            src={loading}
            alt="spinner"
            width="150"
            height="150"
          />
        }
      </div>
    );
  }
}
PlayerLoading.propTypes = {
  currentlyIsPlaying: PropTypes.bool.isRequired,
  currentlyPlaying: PropTypes.string,
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
};
export default PlayerLoading;
