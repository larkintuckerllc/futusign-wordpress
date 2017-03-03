import React, { Component, PropTypes } from 'react';
import { LOADING } from '../../../../ducks/currentlyPlaying';

const URL_REGEX = /^https:\/\/youtu\.be\/(.*)/;
class PlayerYoutubeVideos extends Component {
  constructor() {
    super();
    this.handleYoutubeStateChange = this.handleYoutubeStateChange.bind(this);
    this.handleYoutubeError = this.handleYoutubeError.bind(this);
    this.futusignCoverEl = document.getElementById('futusign_cover');
    this.futusignYoutubeEl = window.document.getElementById('futusign_youtube');
    this.started = false;
  }
  componentDidMount() {
    const { setBadPlaying, setCurrentlyPlaying, setOfflinePlaying, youtubeVideos } = this.props;
    if (window.futusignYoutubePlayer === undefined) {
      setOfflinePlaying(true);
      setCurrentlyPlaying(LOADING);
      return;
    }
    this.videoIds = [];
    this.numberVideos = youtubeVideos.length;
    let validVideos = true;
    for (let i = 0; i < this.numberVideos; i += 1) {
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
      setCurrentlyPlaying(LOADING);
      return;
    }
    this.started = true;
    this.iVideo = 0;
    window.futusignYoutubeStateChange.addEventListener(this.handleYoutubeStateChange);
    window.futusignYoutubeError.addEventListener(this.handleYoutubeError);
    window.futusignYoutubePlayer.cueVideoById(this.videoIds[this.iVideo], 0, 'large');
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    if (!this.started) return;
    window.clearTimeout(this.coverTimeout);
    window.futusignYoutubeStateChange.removeEventListener(this.handleYoutubeStateChange);
    window.futusignYoutubeError.removeEventListener(this.handleYoutubeError);
    window.futusignYoutubePlayer.stopVideo();
    this.futusignYoutubeEl.style.visibility = 'hidden';
  }
  handleYoutubeStateChange(event) {
    const { done } = this.props;
    switch (event.detail) {
      case window.YT.PlayerState.CUED:
        window.futusignYoutubePlayer.playVideo();
        this.futusignYoutubeEl.style.visibility = 'visible';
        this.coverTimeout = window.setTimeout(() => {
          const current = window.futusignYoutubePlayer.getCurrentTime();
          const duration = window.futusignYoutubePlayer.getDuration();
          const remaining = duration - current;
          this.futusignCoverEl.style.opacity = 0;
          if (remaining >= 1) {
            this.coverTimeout = window.setTimeout(() => {
              this.futusignCoverEl.style.opacity = 1;
            }, (remaining - 1) * 1000);
          }
        }, 1000);
        break;
      case window.YT.PlayerState.ENDED:
        if (this.iVideo < this.numberVideos - 1) {
          this.iVideo += 1;
          window.futusignYoutubePlayer.cueVideoById(this.videoIds[this.iVideo], 0, 'large');
        } else {
          done();
        }
        break;
      default:
    }
  }
  handleYoutubeError() {
    const { setOfflinePlaying, setCurrentlyPlaying } = this.props;
    setOfflinePlaying(true);
    setCurrentlyPlaying(LOADING);
  }
  render() {
    return (
      <div />
    );
  }
}
PlayerYoutubeVideos.propTypes = {
  done: PropTypes.func.isRequired,
  setBadPlaying: PropTypes.func.isRequired,
  setCurrentlyPlaying: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
  youtubeVideos: PropTypes.array.isRequired,
};
export default PlayerYoutubeVideos;
