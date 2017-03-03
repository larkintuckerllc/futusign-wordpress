import React, { Component, PropTypes } from 'react';
import { BLANK, LOADING, SLIDE_DECKS, YOUTUBE_VIDEOS } from '../../../ducks/currentlyPlaying';
import PlayerBlank from './PlayerBlank';
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
      case LOADING:
        player = (
          <PlayerLoading
            done={() => {
              setCurrentlyPlaying(BLANK);
            }}
          />
        );
        break;
      case BLANK:
        player = (
          <PlayerBlank
            done={() => {
              if (slideDecks.length !== 0) {
                setCurrentlyPlaying(SLIDE_DECKS);
              } else {
                setCurrentlyPlaying(YOUTUBE_VIDEOS);
              }
            }}
          />
        );
        break;
      case SLIDE_DECKS:
        player = (
          <PlayerSlideDecks
            setCurrentlyPlaying={setCurrentlyPlaying}
            setBadPlaying={setBadPlaying}
            setOfflinePlaying={setOfflinePlaying}
            slideDecks={slideDecks}
            done={() => {
              if (youtubeVideos.length !== 0) {
                setCurrentlyPlaying(YOUTUBE_VIDEOS);
              } else {
                setCurrentlyPlaying(BLANK);
              }
            }}
          />
        );
        break;
      case YOUTUBE_VIDEOS:
        player = (
          <PlayerYoutubeVideos
            loop={slideDecks.length === 0}
            setCurrentlyPlaying={setCurrentlyPlaying}
            setBadPlaying={setBadPlaying}
            setOfflinePlaying={setOfflinePlaying}
            youtubeVideos={youtubeVideos}
            done={() => {
              setCurrentlyPlaying(BLANK);
            }}
          />
        );
        break;
      default:
        player = null;
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
