import { Component, PropTypes } from 'react';
import { WEBS } from '../../../../strings';

class PlayerWebs extends Component {
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
    const upCurrentlyPlaying = upProps.currentlyPlaying;
    // GETTING READY TO PLAY
    if (
      nextPlaying !== WEBS &&
      upNextPlaying === WEBS
    ) {
      this.readyTimeout = window.setTimeout(() => setNextIsReady(true), 1000);
    }
    // START PLAYING
    if (
      currentlyPlaying === WEBS &&
      !currentlyIsPlaying &&
      upCurrentlyIsPlaying
    ) {
      this.stopTimeout = window.setTimeout(() => setCurrentlyIsPlaying(false), 5000);
    }
    // STOP SHOWING
    if (
      currentlyPlaying === WEBS &&
      upCurrentlyPlaying !== WEBS
    ) {
      window.console.log('STOP SHOWING');
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
PlayerWebs.propTypes = {
  currentlyIsPlaying: PropTypes.bool.isRequired,
  currentlyPlaying: PropTypes.string,
  nextPlaying: PropTypes.string,
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
  setNextIsReady: PropTypes.func.isRequired,
};
export default PlayerWebs;
