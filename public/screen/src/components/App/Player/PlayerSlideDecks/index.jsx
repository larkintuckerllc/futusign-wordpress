import React, { Component, PropTypes } from 'react';
import { SLIDE_DECKS } from '../../../../strings';

class PlayerSlideDecks extends Component {
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
      nextPlaying !== SLIDE_DECKS &&
      upNextPlaying === SLIDE_DECKS
    ) {
      // TODO: WORRY ABOUT CANCELING
      window.setTimeout(() => setNextIsReady(true), 1000);
    }
    // START PLAYING
    if (
      currentlyPlaying === SLIDE_DECKS &&
      !currentlyIsPlaying &&
      upCurrentlyIsPlaying
    ) {
      // TODO: WORRY ABOUT CANCELING
      window.setTimeout(() => setCurrentlyIsPlaying(false), 5000);
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return <div>Player Slide Decks</div>;
  }
}
PlayerSlideDecks.propTypes = {
  currentlyIsPlaying: PropTypes.bool.isRequired,
  currentlyPlaying: PropTypes.string,
  nextPlaying: PropTypes.string,
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
  setNextIsReady: PropTypes.func.isRequired,
};
export default PlayerSlideDecks;
