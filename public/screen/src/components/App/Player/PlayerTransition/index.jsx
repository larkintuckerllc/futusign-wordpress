import { Component, PropTypes } from 'react';
import { TRANSITION } from '../../../../strings';

class PlayerTransition extends Component {
  constructor(props) {
    super(props);
    this.readyTimeout = null;
    this.stopTimeout = null;
  }
  componentWillReceiveProps(upProps) {
    const {
      currentlyIsPlaying,
      currentlyPlaying,
      nextPlaying,
      setCurrentlyIsPlaying,
      setNextIsReady,
    } = this.props;
    const upNextPlaying = upProps.nextPlaying;
    const upCurrentlyIsPlaying = upProps.currentlyIsPlaying;
    // GETTING READY TO PLAY
    if (
      nextPlaying !== TRANSITION &&
      upNextPlaying === TRANSITION
    ) {
      this.readyTimeout = window.setTimeout(() => setNextIsReady(true), 0);
    }
    // START PLAYING
    if (
      currentlyPlaying === TRANSITION &&
      !currentlyIsPlaying &&
      upCurrentlyIsPlaying
    ) {
      this.stopTimeout = window.setTimeout(() => setCurrentlyIsPlaying(false), 0);
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    window.clearTimeout(this.readyTimeout);
    window.clearTimeout(this.stopTimeout);
  }
  render() {
    return null;
  }
}
PlayerTransition.propTypes = {
  currentlyIsPlaying: PropTypes.bool.isRequired,
  currentlyPlaying: PropTypes.string,
  nextPlaying: PropTypes.string,
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
  setNextIsReady: PropTypes.func.isRequired,
};
export default PlayerTransition;
