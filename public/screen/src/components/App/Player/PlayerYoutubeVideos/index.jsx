import React, { Component, PropTypes } from 'react';

const URL_REGEX = /^https:\/\/youtu\.be\/(.*)/;
class PlayerYoutubeVideos extends Component {
  constructor() {
    super();
    this.handleYoutubeEvents = this.handleYoutubeEvents.bind(this);
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
    window.futusignYoutubePlayer
    .cueVideoById(id, 0, 'large');
    window.futusignYoutubePlayer
    .playVideo();
    this.futusignYoutubeEl.style.visibility = 'visible';
  }
  componentWillUnmount() {
    window.futusignYoutubeEmitter.removeEventListener(this.handleYoutubeEvents);
    window.futusignYoutubePlayer
    .stopVideo();
    this.futusignYoutubeEl.style.visibility = 'hidden';
  }
  handleYoutubeEvents(event) {
    const { done } = this.props;
    if (event.detail === window.YT.PlayerState.ENDED) {
      done();
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
