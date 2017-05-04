import { Component, PropTypes } from 'react';
import { TEMPLATE, TRANSITION, TRANSITION2 } from '../../../../strings';

class PlayerTemplate extends Component {
  constructor(props) {
    super(props);
    this.showing = false;
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
      nextPlaying !== TEMPLATE &&
      upNextPlaying === TEMPLATE
    ) {
      this.readyTimeout = window.setTimeout(() => setNextIsReady(true), 1000);
    }
    // START PLAYING
    if (
      currentlyPlaying === TEMPLATE &&
      !currentlyIsPlaying &&
      upCurrentlyIsPlaying
    ) {
      this.showing = true;
      this.stopTimeout = window.setTimeout(() => setCurrentlyIsPlaying(false), 5000);
    }
    // STOP PLAYING
    if (
      currentlyPlaying === TEMPLATE &&
      upCurrentlyPlaying !== TEMPLATE
    ) {
      window.console.log('STOP PLAYING');
    }
    // STOP SHOWING
    if (
      this.showing &&
      upCurrentlyPlaying !== TEMPLATE &&
      upCurrentlyPlaying !== TRANSITION &&
      upCurrentlyPlaying !== TRANSITION2
    ) {
      this.showing = false;
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
PlayerTemplate.propTypes = {
  currentlyIsPlaying: PropTypes.bool.isRequired,
  currentlyPlaying: PropTypes.string,
  nextPlaying: PropTypes.string,
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
  setNextIsReady: PropTypes.func.isRequired,
};
export default PlayerTemplate;
