import { Component, PropTypes } from 'react';
import { YOUTUBE_VIDEOS, TRANSITION, TRANSITION2 } from '../../../../strings';

const URL_REGEX = /^https:\/\/youtu\.be\/(.*)/;
const PLAYER_DELAY = 5;
const VIDEO_DELAY = 2;
class PlayerYoutubeVideos extends Component {
  constructor(props) {
    super(props);
    this.showing = false;
    this.readyTimeout = null;
    this.coverTimeout = null;
    this.videoIds = null;
    this.videoIndex = null;
    this.numberOfVideos = null;
    this.handleYoutubeStateChange = this.handleYoutubeStateChange.bind(this);
    this.handleYoutubeError = this.handleYoutubeError.bind(this);
    this.validVideos = this.validVideos.bind(this);
    this.futusignYoutubeEl = window.document.getElementById('futusign_youtube');
    window.futusignYoutubeStateChange.addEventListener(this.handleYoutubeStateChange);
    window.futusignYoutubeError.addEventListener(this.handleYoutubeError);
  }
  componentWillReceiveProps(upProps) {
    const {
      currentlyIsPlaying,
      currentlyPlaying,
      nextPlaying,
      setBadPlaying,
      setCover,
      setNextIsReady,
      youtubeVideos,
    } = this.props;
    const upNextPlaying = upProps.nextPlaying;
    const upCurrentlyIsPlaying = upProps.currentlyIsPlaying;
    const upCurrentlyPlaying = upProps.currentlyPlaying;
    // GETTING READY TO PLAY
    if (
      nextPlaying !== YOUTUBE_VIDEOS &&
      upNextPlaying === YOUTUBE_VIDEOS
    ) {
      // YOUTUBE PLAYING CHECK READY
      if (window.futusignYoutubePlayer === undefined) {
        this.readyTimeout = window.setTimeout(() => {
          if (window.futusignYoutubePlayer === undefined) {
            setBadPlaying(true);
            return;
          }
          if (!this.validVideos()) {
            setBadPlaying(true);
            return;
          }
          setNextIsReady(true);
        }, PLAYER_DELAY * 1000);
        return;
      }
      // CHECK VIDEOS VALID
      if (!this.validVideos()) {
        window.setTimeout(() => setBadPlaying(true), 0);
        return;
      }
      // READY
      window.setTimeout(() => setNextIsReady(true), 0);
    }
    // START PLAYING
    if (
      currentlyPlaying === YOUTUBE_VIDEOS &&
      !currentlyIsPlaying &&
      upCurrentlyIsPlaying
    ) {
      this.showing = true;
      this.videoIndex = 0;
      window.futusignYoutubePlayer.cueVideoById(
        this.videoIds[this.videoIndex],
        0,
        youtubeVideos[this.videoIndex].suggestedQuality
      );
      window.setTimeout(() => {
        setCover(true);
        this.futusignYoutubeEl.style.visibility = 'visible';
      }, 0);
      this.coverTimeout = window.setTimeout(() => setCover(false), VIDEO_DELAY * 1000);
    }
    // STOP PLAYING
    if (
      currentlyPlaying === YOUTUBE_VIDEOS &&
      upCurrentlyPlaying !== YOUTUBE_VIDEOS
    ) {
      if (window.futusignYoutubePlayer !== undefined) {
        window.futusignYoutubePlayer.pauseVideo();
      }
      this.futusignYoutubeEl.style.visibility = 'hidden';
      window.clearTimeout(this.readyTimeout);
      window.clearTimeout(this.coverTimeout);
      window.setTimeout(() => setCover(true), 0);
    }
    // STOP SHOWING
    if (
      this.showing &&
      upCurrentlyPlaying !== YOUTUBE_VIDEOS &&
      upCurrentlyPlaying !== TRANSITION &&
      upCurrentlyPlaying !== TRANSITION2
    ) {
      this.showing = false;
      window.setTimeout(() => setCover(false), 0);
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    const { setCover } = this.props;
    if (window.futusignYoutubePlayer !== undefined) {
      window.futusignYoutubePlayer.pauseVideo();
    }
    this.futusignYoutubeEl.style.visibility = 'hidden';
    setCover(false);
    window.clearTimeout(this.readyTimeout);
    window.clearTimeout(this.coverTimeout);
    window.futusignYoutubeStateChange.removeEventListener(this.handleYoutubeStateChange);
    window.futusignYoutubeError.removeEventListener(this.handleYoutubeError);
  }
  handleYoutubeStateChange(event) {
    const { setCover, setCurrentlyIsPlaying, youtubeVideos } = this.props;
    switch (event.detail) {
      case window.YT.PlayerState.CUED:
        window.futusignYoutubePlayer.playVideo();
        break;
      case window.YT.PlayerState.ENDED:
        if (this.videoIndex >= this.numberOfVideos - 1) {
          this.futusignYoutubeEl.style.visibility = 'hidden';
          setCurrentlyIsPlaying(false);
          window.setTimeout(() => setCover(true), 0);
          return;
        }
        this.videoIndex += 1;
        window.futusignYoutubePlayer.cueVideoById(
          this.videoIds[this.videoIndex],
          0,
          youtubeVideos[this.videoIndex].suggestedQuality
        );
        window.setTimeout(() => setCover(true), 0);
        this.coverTimeout = window.setTimeout(() => setCover(false), VIDEO_DELAY * 1000);
        break;
      default:
    }
  }
  handleYoutubeError() {
    const { setBadPlaying } = this.props;
    setBadPlaying(true);
  }
  validVideos() {
    const { youtubeVideos } = this.props;
    this.videoIds = [];
    this.numberOfVideos = youtubeVideos.length;
    let valid = true;
    for (let i = 0; i < this.numberOfVideos; i += 1) {
      const url = youtubeVideos[i].url;
      const match = URL_REGEX.exec(url);
      if (match === null) {
        valid = false;
      } else {
        this.videoIds.push(match[1]);
      }
    }
    return valid;
  }
  render() {
    return null;
  }
}
PlayerYoutubeVideos.propTypes = {
  currentlyIsPlaying: PropTypes.bool.isRequired,
  currentlyPlaying: PropTypes.string,
  nextPlaying: PropTypes.string,
  setBadPlaying: PropTypes.func.isRequired,
  setCover: PropTypes.func.isRequired,
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
  setNextIsReady: PropTypes.func.isRequired,
  youtubeVideos: PropTypes.array.isRequired,
};
export default PlayerYoutubeVideos;
