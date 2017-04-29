import { Component, PropTypes } from 'react';
import { YOUTUBE_VIDEOS } from '../../../../strings';

const URL_REGEX = /^https:\/\/youtu\.be\/(.*)/;
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
    this.playVideo = this.playVideo.bind(this);
    this.futusignYoutubeEl = window.document.getElementById('futusign_youtube');
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
      setOfflinePlaying,
    } = this.props;
    const upNextPlaying = upProps.nextPlaying;
    const upCurrentlyIsPlaying = upProps.currentlyIsPlaying;
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
          this.cueFirstVideo();
        }, 5000);
        return;
      }
      this.cueFirstVideo();
    }
    // START PLAYING
    if (
      currentlyPlaying === YOUTUBE_VIDEOS &&
      !currentlyIsPlaying &&
      upCurrentlyIsPlaying
    ) {
      this.playVideo();
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    // HANDLE STOPPING VIDEO
    window.futusignYoutubeStateChange.removeEventListener(this.handleYoutubeStateChange);
    window.futusignYoutubeError.removeEventListener(this.handleYoutubeError);
    window.clearTimeout(this.readyTimeout);
    window.clearTimeout(this.stopTimeout);
  }
  playVideo() {
    window.futusignYoutubePlayer.playVideo();
    this.futusignYoutubeEl.style.visibility = 'visible';
  }
  handleYoutubeStateChange(event) {
    const { setCurrentlyIsPlaying, setNextIsReady, youtubeVideos } = this.props;
    switch (event.detail) {
      case window.YT.PlayerState.CUED:
        if (this.videoIndex === 0) {
          setNextIsReady(true);
          return;
        }
        window.futusignYoutubePlayer.playVideo();
        break;
      case window.YT.PlayerState.ENDED:
        if (this.videoIndex >= this.numberOfVideos - 1) {
          // TODO: NEED TO FIX TO HIDE WHEN NEXT IS READY
          // TODO: NEED TO WIPE OUT LAST VIDEO
          this.futusignYoutubeEl.style.visibility = 'hidden';
          setCurrentlyIsPlaying(false);
          return;
        }
        this.videoIndex += 1;
        window.futusignYoutubePlayer.cueVideoById(
          this.videoIds[this.videoIndex],
          0,
          youtubeVideos[this.videoIndex].suggestedQuality
        );
        break;
      default:
    }
  }
  handleYoutubeError() {
    const { setOfflinePlaying } = this.props;
    setOfflinePlaying(true);
  }
  cueFirstVideo() {
    const { setBadPlaying, youtubeVideos } = this.props;
    // CHECKING VALIDITY
    this.videoIds = [];
    this.numberOfVideos = youtubeVideos.length;
    let validVideos = true;
    for (let i = 0; i < this.numberOfVideos; i += 1) {
      const url = youtubeVideos[i].url;
      const match = URL_REGEX.exec(url);
      if (match === null) {
        validVideos = false;
      } else {
        this.videoIds.push(match[1]);
      }
    }
    if (!validVideos) {
      setBadPlaying(true);
      return;
    }
    // CUE FIRST VIDEO
    this.videoIndex = 0;
    window.futusignYoutubePlayer.cueVideoById(
      this.videoIds[this.videoIndex],
      0,
      youtubeVideos[this.videoIndex].suggestedQuality
    );
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
