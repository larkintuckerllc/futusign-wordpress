import React, { Component, PropTypes } from 'react';
import { getFile } from '../../../../util/rest';
import { IMAGES } from '../../../../strings';
import styles from './index.scss';

class PlayerImages extends Component {
  constructor(props) {
    super(props);
    this.imageDuration = null;
    this.readyTimeout = null;
    this.stopTimeout = null;
    this.imageIndex = null;
    this.rootEvenEl = null;
    this.rootOddEl = null;
    this.mounted = true;
    this.even = true;
    this.loadImage = this.loadImage.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.playImage = this.playImage.bind(this);
  }
  componentDidMount() {
    this.rootEvenEl = document.getElementById(styles.rootEven);
    this.rootOddEl = document.getElementById(styles.rootOdd);
  }
  componentWillReceiveProps(upProps) {
    const {
      currentlyIsPlaying,
      currentlyPlaying,
      nextPlaying,
    } = this.props;
    const upNextPlaying = upProps.nextPlaying;
    const upCurrentlyIsPlaying = upProps.currentlyIsPlaying;
    const upCurrentlyPlaying = upProps.currentlyPlaying;
    // GETTING READY TO PLAY
    if (
      nextPlaying !== IMAGES &&
      upNextPlaying === IMAGES
    ) {
      this.imageIndex = 0;
      this.loadImage();
    }
    // START PLAYING
    if (
      currentlyPlaying === IMAGES &&
      !currentlyIsPlaying &&
      upCurrentlyIsPlaying
    ) {
      this.playImage();
    }
    // STOP SHOWING
    if (
      currentlyPlaying === IMAGES &&
      upCurrentlyPlaying !== IMAGES
    ) {
      // EXIT ON RELOAD
      window.clearTimeout(this.slideTimeout);
      window.clearTimeout(this.stopTimeout);
      // ALL EXITS
      this.rootEvenEl.style.display = 'none';
      this.rootOddEl.style.display = 'none';
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    window.clearTimeout(this.slideTimeout);
    window.clearTimeout(this.stopTimeout);
    this.mounted = false;
  }
  handleFile(file) {
    if (!this.mounted) { return; }
    const { setNextIsReady } = this.props;
    const renderEl = this.even ? this.rootEvenEl : this.rootOddEl;
    renderEl.style.backgroundImage = `url(${file})`;
    if (this.imageIndex === 0) {
      setNextIsReady(true);
    }
  }
  loadImage() {
    const { setBadPlaying, images } = this.props;
    const image = images[this.imageIndex];
    this.imageDuration = image.imageDuration;
    getFile(image.file)
    .then(this.handleFile, () => setBadPlaying(true));
  }
  playImage() {
    const { setCurrentlyIsPlaying, images } = this.props;
    const playEl = this.even ? this.rootEvenEl : this.rootOddEl;
    const hideEl = !this.even ? this.rootEvenEl : this.rootOddEl;
    playEl.style.display = 'block';
    hideEl.style.display = 'none';
    this.even = !this.even;
    if (this.imageIndex < images.length - 1) {
      this.imageIndex += 1;
      this.imageTimeout = window.setTimeout(this.playImage, this.imageDuration * 1000);
      this.loadImage();
    } else {
      this.stopTimeout = window.setTimeout(() => {
        setCurrentlyIsPlaying(false);
      }, this.imageDuration * 1000);
    }
  }
  render() {
    return (
      <div id={styles.root}>
        <div
          style={{ display: 'none' }}
          id={styles.rootEven}
          className={styles.rootDiv}
        />
        <div
          style={{ display: 'none' }}
          id={styles.rootOdd}
          className={styles.rootDiv}
        />
      </div>
    );
  }
}
PlayerImages.propTypes = {
  currentlyIsPlaying: PropTypes.bool.isRequired,
  currentlyPlaying: PropTypes.string,
  images: PropTypes.array.isRequired,
  nextPlaying: PropTypes.string,
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
  setBadPlaying: PropTypes.func.isRequired,
  setNextIsReady: PropTypes.func.isRequired,
};
export default PlayerImages;
