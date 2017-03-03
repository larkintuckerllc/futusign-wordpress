import React, { Component, PropTypes } from 'react';

const URL_REGEX = /^https:\/\/youtu\.be\/(.*)/;
class PlayerYoutubeVideos extends Component {
  constructor() {
    super();
    this.handleYoutubeEvents = this.handleYoutubeEvents.bind(this);
    this.futusignCoverEl = document.getElementById('futusign_cover');
  }
  componentDidMount() {
    const { setBadPlaying, setOfflinePlaying, youtubeVideos } = this.props;
    this.futusignYoutubeEl = window.document.getElementById('futusign_youtube');
    if (window.futusignYoutubePlayer === undefined) {
      setOfflinePlaying(true);
      return;
    }
    // TODO: CONVERT TO LOOP
    const url = youtubeVideos[0].url;
    const match = URL_REGEX.exec(url);
    if (match === null) {
      setBadPlaying(true);
      return;
    }
    const id = match[1];
    window.futusignYoutubeEmitter.addEventListener(this.handleYoutubeEvents);
    window.futusignYoutubePlayer.cueVideoById(id, 0, 'large');
  }
  componentWillUnmount() {
    window.clearTimeout(this.coverTimeout);
    window.futusignYoutubeEmitter.removeEventListener(this.handleYoutubeEvents);
    window.futusignYoutubePlayer.stopVideo();
    this.futusignYoutubeEl.style.visibility = 'hidden';
  }
  handleYoutubeEvents(event) {
    const { done } = this.props;
    switch (event.detail) {
      case window.YT.PlayerState.CUED:
        window.futusignYoutubePlayer.playVideo();
        this.futusignYoutubeEl.style.visibility = 'visible';
        this.coverTimeout = window.setTimeout(() => {
          const duration = window.futusignYoutubePlayer.getDuration();
          this.futusignCoverEl.style.opacity = 0;
          if (duration >= 2) {
            this.coverTimeout = window.setTimeout(() => {
              this.futusignCoverEl.style.opacity = 1;
            }, (duration - 2) * 1000);
          }
        }, 1000);
        break;
      case window.YT.PlayerState.ENDED:
        done();
        break;
      default:
    }
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
  setOfflinePlaying: PropTypes.func.isRequired,
  youtubeVideos: PropTypes.array.isRequired,
};
export default PlayerYoutubeVideos;
