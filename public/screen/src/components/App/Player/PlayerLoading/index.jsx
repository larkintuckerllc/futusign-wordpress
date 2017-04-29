import { Component, PropTypes } from 'react';
import { LOADING } from '../../../../strings';

class PlayerLoading extends Component {
  constructor(props) {
    super(props);
    this.stopTimeout = null;
  }
  componentWillReceiveProps(upProps) {
    const {
      currentlyIsPlaying,
      currentlyPlaying,
      setCover,
      setCurrentlyIsPlaying,
    } = this.props;
    const upCurrentlyIsPlaying = upProps.currentlyIsPlaying;
    const upCurrentlyPlaying = upProps.currentlyPlaying;
    // START PLAYING
    if (
      currentlyPlaying === LOADING &&
      !currentlyIsPlaying &&
      upCurrentlyIsPlaying
    ) {
      window.setTimeout(() => setCover(true), 0);
      this.stopTimeout = window.setTimeout(() => setCurrentlyIsPlaying(false), 5000);
    }
    // STOP SHOWING
    if (
      currentlyPlaying === LOADING &&
      upCurrentlyPlaying !== LOADING
    ) {
      window.setTimeout(() => setCover(false), 0);
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    const { setCover } = this.props;
    setCover(false);
    window.clearTimeout(this.stopTimeout);
  }
  render() {
    return (
      null
    );
  }
}
PlayerLoading.propTypes = {
  currentlyIsPlaying: PropTypes.bool.isRequired,
  currentlyPlaying: PropTypes.string,
  setCover: PropTypes.func.isRequired,
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
};
export default PlayerLoading;
