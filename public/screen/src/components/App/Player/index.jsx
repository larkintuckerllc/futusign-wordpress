import React, { Component, PropTypes } from 'react';
import { SLIDE_DECKS, YOUTUBE_VIDEOS } from '../../../ducks/currentlyPlaying';
import PlayerLoading from './PlayerLoading';
import PlayerSlideDecks from './PlayerSlideDecks';
import PlayerYoutubeVideos from './PlayerYoutubeVideos';
import styles from './index.scss';

class Player extends Component {
  componentWillUnmount() {
    document.getElementById('futusign_cover').style.opacity = 0;
  }
  render() {
    const {
      currentlyPlaying,
      setBadPlaying,
      setCurrentlyPlaying,
      setOfflinePlaying,
      slideDecks,
      youtubeVideos,
    } = this.props;
    let player;
    switch (currentlyPlaying) {
      case SLIDE_DECKS:
        player = (
          <PlayerSlideDecks
            loop={youtubeVideos.length === 0}
            setBadPlaying={setBadPlaying}
            setOfflinePlaying={setOfflinePlaying}
            slideDecks={slideDecks}
            done={() => {
              setCurrentlyPlaying(YOUTUBE_VIDEOS);
            }}
          />
        );
        break;
      case YOUTUBE_VIDEOS:
        player = (
          <PlayerYoutubeVideos
            loop={slideDecks.length === 0}
            setBadPlaying={setBadPlaying}
            setOfflinePlaying={setOfflinePlaying}
            youtubeVideos={youtubeVideos}
            done={() => {
              setCurrentlyPlaying(SLIDE_DECKS);
            }}
          />
        );
        break;
      default:
        player = (
          <PlayerLoading
            done={() => {
              if (slideDecks.length !== 0) {
                setCurrentlyPlaying(SLIDE_DECKS);
              } else {
                setCurrentlyPlaying(YOUTUBE_VIDEOS);
              }
            }}
          />
        );
    }
    return (
      <div id={styles.root}>
        {player}
      </div>
    );
  }
}
Player.propTypes = {
  currentlyPlaying: PropTypes.string.isRequired,
  setBadPlaying: PropTypes.func.isRequired,
  setCurrentlyPlaying: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
  slideDecks: PropTypes.array.isRequired,
  youtubeVideos: PropTypes.array.isRequired,
};
export default Player;
