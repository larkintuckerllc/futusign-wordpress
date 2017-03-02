import React, { Component, PropTypes } from 'react';

class PlayerYoutubeVideos extends Component {
  componentDidMount() {
    const { done } = this.props;
    this.futusignYoutubeEl = window.document.getElementById('futusign_youtube');
    this.futusignYoutubeEl.style.visibility = 'visible';
    this.doneTimeout = window.setTimeout(done, 10000);
  }
  componentWillUnmount() {
    window.clearTimeout(this.doneTimeout);
    this.futusignYoutubeEl.style.visibility = 'hidden';
  }
  render() {
    return (
      <div />
    );
  }
}
PlayerYoutubeVideos.propTypes = {
  done: PropTypes.func.isRequired,
};
export default PlayerYoutubeVideos;
