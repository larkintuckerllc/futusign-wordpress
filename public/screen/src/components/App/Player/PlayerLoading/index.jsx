import React, { Component, PropTypes } from 'react';
import { LOADING } from '../../../../strings';

class PlayerLoading extends Component {
  componentWillReceiveProps(upProps) {
    const { currentlyIsPlaying, currentlyPlaying, setCurrentlyIsPlaying } = this.props;
    const upCurrentlyIsPlaying = upProps.currentlyIsPlaying;
    if (
      currentlyPlaying === LOADING &&
      !currentlyIsPlaying &&
      upCurrentlyIsPlaying
    ) {
      // TODO: WORRY ABOUT CANCELING
      window.setTimeout(() => setCurrentlyIsPlaying(false), 5000);
    }
  }
  shouldComponentUpdate(upProps) {
    const { currentlyPlaying } = this.props;
    const upCurrentlyPlaying = upProps.currentlyPlaying;
    if (currentlyPlaying !== upCurrentlyPlaying) return true;
    return false;
  }
  render() {
    const { currentlyPlaying } = this.props;
    if (currentlyPlaying === LOADING) {
      window.console.log('SHOW SPINNER');
    }
    return <div>Player Loading</div>;
  }
}
PlayerLoading.propTypes = {
  currentlyIsPlaying: PropTypes.bool.isRequired,
  currentlyPlaying: PropTypes.string,
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
};
export default PlayerLoading;
