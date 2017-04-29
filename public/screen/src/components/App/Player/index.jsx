import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LOADING, SLIDE_DECKS, YOUTUBE_VIDEOS } from '../../../strings';
import * as fromCurrentlyPlaying from '../../../ducks/currentlyPlaying';
import * as fromCurrentlyIsPlaying from '../../../ducks/currentlyIsPlaying';
import * as fromNextPlaying from '../../../ducks/nextPlaying';
import * as fromNextIsReady from '../../../ducks/nextIsReady';
import PlayerLoading from './PlayerLoading';
import PlayerSlideDecks from './PlayerSlideDecks';
import PlayerYoutubeVideos from './PlayerYoutubeVideos';

class Player extends Component {
  componentWillReceiveProps(upProps) {
    const {
      currentlyIsPlaying,
      currentlyPlaying,
      nextIsReady,
      nextPlaying,
      setCurrentlyIsPlaying,
      setCurrentlyPlaying,
      setNextIsReady,
      setNextPlaying,
    } = this.props;
    const upCurrentlyIsPlaying = upProps.currentlyIsPlaying;
    const upNextIsReady = upProps.nextIsReady;
    // TRIGGER NEXT LOAD
    if (!currentlyIsPlaying && upCurrentlyIsPlaying) {
      window.setTimeout(() => {
        let player;
        if (currentlyPlaying === LOADING) {
          player = SLIDE_DECKS;
        }
        if (currentlyPlaying === SLIDE_DECKS) {
          player = YOUTUBE_VIDEOS;
        }
        if (currentlyPlaying === YOUTUBE_VIDEOS) {
          player = SLIDE_DECKS;
        }
        setNextIsReady(false);
        setNextPlaying(player);
      }, 0);
    }
    // TRIGGER PLAYING
    if (
      (currentlyIsPlaying && !upCurrentlyIsPlaying && nextIsReady) ||
      (!nextIsReady && upNextIsReady && !currentlyIsPlaying)
    ) {
      window.setTimeout(() => {
        setCurrentlyPlaying(nextPlaying);
        setCurrentlyIsPlaying(true);
      }, 0);
    }
  }
  render() {
    const {
      currentlyIsPlaying,
      currentlyPlaying,
      nextPlaying,
      setBadPlaying,
      setCurrentlyIsPlaying,
      setNextIsReady,
      slideDecks,
    } = this.props;
    return (
      <div>
        <PlayerLoading
          currentlyIsPlaying={currentlyIsPlaying}
          currentlyPlaying={currentlyPlaying}
          setCurrentlyIsPlaying={setCurrentlyIsPlaying}
        />
        <PlayerSlideDecks
          currentlyIsPlaying={currentlyIsPlaying}
          currentlyPlaying={currentlyPlaying}
          nextPlaying={nextPlaying}
          setBadPlaying={setBadPlaying}
          setCurrentlyIsPlaying={setCurrentlyIsPlaying}
          setNextIsReady={setNextIsReady}
          slideDecks={slideDecks}
        />
        <PlayerYoutubeVideos
          currentlyIsPlaying={currentlyIsPlaying}
          currentlyPlaying={currentlyPlaying}
          nextPlaying={nextPlaying}
          setCurrentlyIsPlaying={setCurrentlyIsPlaying}
          setNextIsReady={setNextIsReady}
        />
      </div>
    );
  }
}
Player.propTypes = {
  currentlyIsPlaying: PropTypes.bool.isRequired,
  currentlyPlaying: PropTypes.string,
  nextIsReady: PropTypes.bool.isRequired,
  nextPlaying: PropTypes.string,
  setBadPlaying: PropTypes.func.isRequired,
  setCurrentlyPlaying: PropTypes.func.isRequired,
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
  setNextIsReady: PropTypes.func.isRequired,
  setNextPlaying: PropTypes.func.isRequired,
  slideDecks: PropTypes.array.isRequired,
};
export default connect(
  state => ({
    currentlyIsPlaying: fromCurrentlyIsPlaying.getCurrentlyIsPlaying(state),
    currentlyPlaying: fromCurrentlyPlaying.getCurrentlyPlaying(state),
    nextIsReady: fromNextIsReady.getNextIsReady(state),
    nextPlaying: fromNextPlaying.getNextPlaying(state),
  }), {
    setCurrentlyPlaying: fromCurrentlyPlaying.setCurrentlyPlaying,
    setCurrentlyIsPlaying: fromCurrentlyIsPlaying.setCurrentlyIsPlaying,
    setNextIsReady: fromNextIsReady.setNextIsReady,
    setNextPlaying: fromNextPlaying.setNextPlaying,
  }
)(Player);
