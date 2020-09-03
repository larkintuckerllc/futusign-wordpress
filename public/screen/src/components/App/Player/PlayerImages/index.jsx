import React, { Component, PropTypes } from 'react';
import { getFile } from '../../../../util/rest';
import { IMAGES, TRANSITION, TRANSITION2 } from '../../../../strings';
import styles from './index.css';

class PlayerImages extends Component {
  constructor(props) {
    super(props);
    this.even = true;
    this.mounted = true;
    this.showing = false;
    this.handleFile = this.handleFile.bind(this);
    this.loadImage = this.loadImage.bind(this);
    this.playImage = this.playImage.bind(this);
    this.rootEvenEl = null;
    this.rootOddEl = null;
    this.stopTimeout = null;
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
    // STOP PLAYING
    if (
      currentlyPlaying === IMAGES &&
      upCurrentlyPlaying !== IMAGES
    ) {
      // STOP PLAYING
    }
    // STOP SHOWING
    if (
      this.showing &&
      upCurrentlyPlaying !== IMAGES &&
      upCurrentlyPlaying !== TRANSITION &&
      upCurrentlyPlaying !== TRANSITION2
    ) {
      this.showing = false;
      this.rootEvenEl.style.display = 'none';
      this.rootOddEl.style.display = 'none';
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    this.mounted = false;
    window.clearTimeout(this.stopTimeout);
  }
  handleFile(image) {
    const { setNextIsReady, storeOffline } = this.props;
    if (!this.mounted) { return; }
    // CACHING OFFLINE
    if (storeOffline) {
      const newImageURL = image.file;
      const lastImageURL = window.localStorage.getItem('futusign_image_url');
      if (newImageURL !== lastImageURL) {
        window.localStorage.setItem('futusign_image_url', newImageURL);
        window.localStorage.setItem('futusign_image_file', image.encoded);
      }
    }
    const renderEl = this.even ? this.rootEvenEl : this.rootOddEl;
    renderEl.style.backgroundImage = `url(${image.encoded})`;
    setNextIsReady(true);
  }
  loadImage() {
    const { images, setBadPlaying } = this.props;
    const image = images[0]; // EVENTUALLY GET RID OF ARRAY
    getFile(image.file)
    .then(encoded => {
      this.handleFile({
        ...image,
        encoded,
      });
    })
    .catch(() => setBadPlaying(true));
  }
  playImage() {
    const { images, setCurrentlyIsPlaying } = this.props;
    const image = images[0]; // EVENTUALLY GET RID OF ARRAY
    this.showing = true;
    const playEl = this.even ? this.rootEvenEl : this.rootOddEl;
    const hideEl = !this.even ? this.rootEvenEl : this.rootOddEl;
    playEl.style.display = 'block';
    hideEl.style.display = 'none';
    this.even = !this.even;
    this.stopTimeout
      = window.setTimeout(() => setCurrentlyIsPlaying(false), image.imageDuration * 1000);
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
  storeOffline: PropTypes.bool.isRequired,
};
export default PlayerImages;
