import React, { Component, PropTypes } from 'react';
import { getFile } from '../../../../util/rest';
import styles from './index.scss';

// TODO: WORK IN DURATION
// TODO: PROBLEM WHEN UPDATING
class PlayerImages extends Component {
  constructor() {
    super();
    this.renderImage = this.renderImage.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.futusignCoverEl = document.getElementById('futusign_cover');
  }
  componentDidMount() {
    this.rootOddEl = document.getElementById(styles.rootDivOdd);
    this.rootEvenEl = document.getElementById(styles.rootDivEven);
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
  showRendered() {
    const renderEl = this.iList % 2 ? this.rootEvenEl : this.rootOddEl;
    const renderedEl = this.iList % 2 ? this.rootOddEl : this.rootEvenEl;
    renderEl.style.display = 'none';
    renderedEl.style.display = 'block';
    this.futusignCoverEl.style.opacity = 0;
    this.coverTimeout = window.setTimeout(() => {
      this.futusignCoverEl.style.opacity = 1;
    }, (this.imageDuration - 1) * 1000);
  }
  handleFile(file) {
    const { done, images } = this.props;
    const renderEl = this.iList % 2 ? this.rootEvenEl : this.rootOddEl;
    this.showRendered();
    renderEl.style.backgroundImage = `url(${file})`;
    if (this.iList < images.length - 1) {
      this.iList += 1;
      this.renderTimeout = window.setTimeout(this.renderImage, this.imageDuration * 1000);
      this.imageDuration = 5; // TODO: FIX
    } else {
      this.renderTimeout = window.setTimeout(() => {
        this.iList += 1;
        this.imageDuration = 5;
        this.showRendered();
        this.renderTimeout = window.setTimeout(() => {
          done();
        }, this.imageDuration * 1000);
      }, this.imageDuration * 1000);
    }
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
        <div id={styles.rootDivOdd} className={styles.rootDiv} />
        <div id={styles.rootDivEven} className={styles.rootDiv} />
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
