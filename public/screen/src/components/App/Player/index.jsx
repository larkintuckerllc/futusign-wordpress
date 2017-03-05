import React, { Component, PropTypes } from 'react';
import {
  BLANK,
  IMAGES,
  LOADING,
  SLIDE_DECKS,
  YOUTUBE_VIDEOS,
} from '../../../ducks/currentlyPlaying';
import PlayerBlank from './PlayerBlank';
import PlayerLoading from './PlayerLoading';
import PlayerSlideDecks from './PlayerSlideDecks';
import PlayerYoutubeVideos from './PlayerYoutubeVideos';
import PlayerImages from './PlayerImages';
import styles from './index.scss';

// TODO: RESET ORDER
const PLAY_ORDER = [
  BLANK,
  IMAGES,
  SLIDE_DECKS,
  YOUTUBE_VIDEOS,
];
class Player extends Component {
  constructor() {
    super();
    this.setNextPlaying = this.setNextPlaying.bind(this);
  }
  componentWillUnmount() {
    document.getElementById('futusign_cover').style.opacity = 0;
  }
  setNextPlaying() {
    const {
      currentlyPlaying,
      images,
      setCurrentlyPlaying,
      slideDecks,
      youtubeVideos,
    } = this.props;
    const currentlyPlayingIndex = PLAY_ORDER.indexOf(currentlyPlaying);
    const nextPlayingIndex = currentlyPlayingIndex < PLAY_ORDER.length - 1 ?
      currentlyPlayingIndex + 1 : 0;
    const nextPlaying = PLAY_ORDER[nextPlayingIndex];
    switch (nextPlaying) {
      case SLIDE_DECKS:
        if (slideDecks.length === 0) {
          this.setNextPlaying();
          return;
        }
        break;
      case IMAGES:
        if (images.length === 0) {
          this.setNextPlaying();
          return;
        }
        break;
      case YOUTUBE_VIDEOS:
        if (youtubeVideos.length === 0) {
          this.setNextPlaying();
          return;
        }
        break;
      default:
    }
    setCurrentlyPlaying(nextPlaying);
  }
  // TODO: REMOVE SETCURRENTLYPLAYING
  render() {
    const {
      currentlyPlaying,
      images,
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
              setCurrentlyPlaying(PLAY_ORDER[0]);
            }}
          />
        );
        break;
      case BLANK:
        player = (
          <PlayerBlank
            done={this.setNextPlaying}
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
            done={this.setNextPlaying}
          />
        );
        break;
      case IMAGES:
        player = (
          <PlayerImages
            setCurrentlyPlaying={setCurrentlyPlaying}
            setBadPlaying={setBadPlaying}
            setOfflinePlaying={setOfflinePlaying}
            images={images}
            done={this.setNextPlaying}
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
            done={this.setNextPlaying}
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
  images: PropTypes.array.isRequired,
  setBadPlaying: PropTypes.func.isRequired,
  setCurrentlyPlaying: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
  slideDecks: PropTypes.array.isRequired,
  youtubeVideos: PropTypes.array.isRequired,
};
export default Player;
