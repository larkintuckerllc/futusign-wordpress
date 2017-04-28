import React, { Component, PropTypes } from 'react';
import { SLIDE_DECKS } from '../../../../strings';

class PlayerSlideDecks extends Component {
  constructor(props) {
    super(props);
    this.slideDeckIndex = null;
    this.playSlideDeck = this.playSlideDeck.bind(this);
  }
  componentWillReceiveProps(upProps) {
    const {
      currentlyIsPlaying,
      currentlyPlaying,
      nextPlaying,
      setNextIsReady,
    } = this.props;
    const upNextPlaying = upProps.nextPlaying;
    const upCurrentlyIsPlaying = upProps.currentlyIsPlaying;
    // GETTING READY TO PLAY
    if (
      nextPlaying !== SLIDE_DECKS &&
      upNextPlaying === SLIDE_DECKS
    ) {
      this.slideDeckIndex = 0;
      // TODO: WORRY ABOUT CANCELING
      window.setTimeout(() => setNextIsReady(true), 1000);
    }
    // START PLAYING
    if (
      currentlyPlaying === SLIDE_DECKS &&
      !currentlyIsPlaying &&
      upCurrentlyIsPlaying
    ) {
      this.playSlideDeck();
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  playSlideDeck() {
    const { setCurrentlyIsPlaying, slideDecks } = this.props;
    const slideDeck = slideDecks[this.slideDeckIndex];
    window.console.log(slideDeck);
    if (this.slideDeckIndex < slideDecks.length - 1) {
      this.slideDeckIndex += 1;
      // TODO: WORRY ABOUT CANCELING
      window.setTimeout(this.playSlideDeck, 5000);
    } else {
      setCurrentlyIsPlaying(false);
    }
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
  slideDecks: PropTypes.array.isRequired,
};
export default PlayerSlideDecks;
