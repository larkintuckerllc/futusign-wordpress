import { Component, PropTypes } from 'react';
import { YOUTUBE_VIDEOS } from '../../../../strings';

const URL_REGEX = /^https:\/\/youtu\.be\/(.*)/;
const VIDEO_DELAY = 2;
class PlayerYoutubeVideos extends Component {
  constructor(props) {
    super(props);
    this.readyTimeout = null;
    this.stopTimeout = null;
    this.videoIds = null;
    this.videoIndex = null;
    this.numberOfVideos = null;
    this.handleYoutubeStateChange = this.handleYoutubeStateChange.bind(this);
    this.handleYoutubeError = this.handleYoutubeError.bind(this);
    this.validVideos = this.validVideos.bind(this);
    this.futusignYoutubeEl = window.document.getElementById('futusign_youtube');
    this.futusignCoverEl = window.document.getElementById('futusign_cover');
  }
  componentDidMount() {
    window.futusignYoutubeStateChange.addEventListener(this.handleYoutubeStateChange);
    window.futusignYoutubeError.addEventListener(this.handleYoutubeError);
  }
  componentWillReceiveProps(upProps) {
    const {
      currentlyIsPlaying,
      currentlyPlaying,
      nextPlaying,
      setBadPlaying,
      setOfflinePlaying,
      setNextIsReady,
      youtubeVideos,
    } = this.props;
    const upNextPlaying = upProps.nextPlaying;
    const upCurrentlyIsPlaying = upProps.currentlyIsPlaying;
    // const upCurrentlyPlaying = upProps.currentlyPlaying;
    // GETTING READY TO PLAY
    if (
      nextPlaying !== YOUTUBE_VIDEOS &&
      upNextPlaying === YOUTUBE_VIDEOS
    ) {
      // YOUTUBE PLAYING NOT READY
      if (window.futusignYoutubePlayer === undefined) {
        this.readyTimeout = window.setTimeout(() => {
          if (window.futusignYoutubePlayer === undefined) {
            setOfflinePlaying(true);
            return;
          }
          if (!this.validVideos()) {
            setBadPlaying(true);
            return;
          }
          // TODO: CLEARTIMEOUT
          window.setTimeout(() => setNextIsReady(true), 1000);
        }, 5000);
        return;
      }
      // INVALID VIDEOS
      if (!this.validVideos()) {
        // TODO: CLEARTIMEOUT
        window.setTimeout(() => setBadPlaying(true), 0);
        return;
      }
      // READY
      // TODO: CLEARTIMEOUT
      window.setTimeout(() => setNextIsReady(true), 1000);
    }
    // START PLAYING
    if (
      currentlyPlaying === YOUTUBE_VIDEOS &&
      !currentlyIsPlaying &&
      upCurrentlyIsPlaying
    ) {
      this.videoIndex = 0;
      this.futusignCoverEl.style.visibility = 'visible';
      window.futusignYoutubePlayer.cueVideoById(
        this.videoIds[this.videoIndex],
        0,
        youtubeVideos[this.videoIndex].suggestedQuality
      );
      this.futusignYoutubeEl.style.visibility = 'visible';
      window.setTimeout(() => {
        this.futusignCoverEl.style.visibility = 'hidden';
      }, VIDEO_DELAY * 1000);
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    // HANDLE STOPPING VIDEO
    // ADD ANIMATION TO COVER
    window.futusignYoutubeStateChange.removeEventListener(this.handleYoutubeStateChange);
    window.futusignYoutubeError.removeEventListener(this.handleYoutubeError);
    window.clearTimeout(this.readyTimeout);
    window.clearTimeout(this.stopTimeout);
  }
  handleYoutubeStateChange(event) {
    const { setCurrentlyIsPlaying, youtubeVideos } = this.props;
    switch (event.detail) {
      case window.YT.PlayerState.CUED:
        window.futusignYoutubePlayer.playVideo();
        break;
      case window.YT.PlayerState.ENDED:
        if (this.videoIndex >= this.numberOfVideos - 1) {
          this.futusignYoutubeEl.style.visibility = 'hidden';
          setCurrentlyIsPlaying(false);
          return;
        }
        this.videoIndex += 1;
        this.futusignCoverEl.style.visibility = 'visible';
        window.futusignYoutubePlayer.cueVideoById(
          this.videoIds[this.videoIndex],
          0,
          youtubeVideos[this.videoIndex].suggestedQuality
        );
        this.futusignYoutubeEl.style.visibility = 'visible';
        window.setTimeout(() => {
          this.futusignCoverEl.style.visibility = 'hidden';
        }, VIDEO_DELAY * 1000);
        break;
      default:
    }
  }
  handleYoutubeError() {
    const { setOfflinePlaying } = this.props;
    setOfflinePlaying(true);
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
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
  setNextIsReady: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
  youtubeVideos: PropTypes.array.isRequired,
};
export default PlayerYoutubeVideos;
