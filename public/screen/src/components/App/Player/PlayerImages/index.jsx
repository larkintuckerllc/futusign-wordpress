import React, { Component, PropTypes } from 'react';
import { getFile } from '../../../../util/rest';
import styles from './index.scss';

// TODO: WORK IN DURATION
class PlayerImages extends Component {
  constructor() {
    super();
    this.renderImage = this.renderImage.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.futusignCoverEl = document.getElementById('futusign_cover');
  }
  componentDidMount() {
    this.rootOddEl = document.getElementById(styles.rootOdd);
    this.rootEvenEl = document.getElementById(styles.rootEven);
    this.imageDuration = 1;
    this.iList = 0;
    this.renderImage();
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    window.clearTimeout(this.coverTimeout);
  }
  handleFile(file) {
    const renderEl = this.iList % 2 ? this.rootOddEl : this.rootEvenEl;
    const renderedEl = this.iList % 2 ? this.rootEvenEl : this.rootOddEl;
    renderEl.style.display = 'none';
    renderedEl.style.display = 'block';
    this.futusignCoverEl.style.opacity = 0;
    this.coverTimeout = window.setTimeout(() => {
      this.futusignCoverEl.style.opacity = 1;
    }, (this.slideDuration - 1) * 1000);
    // SET COVER
    // SET BACKGROUND
    // MOVE TO NEXT
  }
  renderImage() {
    const { images, resetPlaying, setOfflinePlaying } = this.props;
    getFile(images[this.iList].file)
    .then(
      this.handleFile,
      () => {
        setOfflinePlaying(true);
        resetPlaying();
      }
    );
  }
  render() {
    return (
      <div id={styles.root}>
        <div id={styles.rootOdd} />
        <div id={styles.rootEven} />
      </div>
    );
  }
}
PlayerImages.propTypes = {
  done: PropTypes.func.isRequired,
  resetPlaying: PropTypes.func.isRequired,
  setBadPlaying: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
};
export default PlayerImages;
