import React, { Component, PropTypes } from 'react';
import { TRANSITION, TRANSITION2, WEBS } from '../../../../strings';
import styles from './index.scss';

const WEB_LOAD_TIME = 2;
class PlayerWebs extends Component {
  constructor(props) {
    super(props);
    this.showing = false;
    this.webDuration = null;
    this.stopTimeout = null;
    this.webIndex = null;
    this.rootEvenEl = null;
    this.rootOddEl = null;
    this.mounted = true;
    this.even = true;
    this.playWeb = this.playWeb.bind(this);
    this.loadWeb = this.loadWeb.bind(this);
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
      setNextIsReady,
    } = this.props;
    const upNextPlaying = upProps.nextPlaying;
    const upCurrentlyIsPlaying = upProps.currentlyIsPlaying;
    const upCurrentlyPlaying = upProps.currentlyPlaying;
    // GETTING READY TO PLAY
    if (
      nextPlaying !== WEBS &&
      upNextPlaying === WEBS
    ) {
      this.webIndex = 0;
      this.loadWeb();
      this.readyTimeout = window.setTimeout(() => setNextIsReady(true), WEB_LOAD_TIME * 1000);
    }
    // START PLAYING
    if (
      currentlyPlaying === WEBS &&
      !currentlyIsPlaying &&
      upCurrentlyIsPlaying
    ) {
      this.showing = true;
      this.playWeb();
    }
    // STOP PLAYING
    if (
      currentlyPlaying === WEBS &&
      upCurrentlyPlaying !== WEBS
    ) {
      window.clearTimeout(this.webTimeout);
      window.clearTimeout(this.stopTimeout);
    }
    // STOP SHOWING
    if (
      this.showing &&
      upCurrentlyPlaying !== WEBS &&
      upCurrentlyPlaying !== TRANSITION &&
      upCurrentlyPlaying !== TRANSITION2
    ) {
      this.showing = false;
      this.rootEvenEl.style.display = 'none';
      this.rootOddEl.style.display = 'none';
      this.rootEvenEl.src = 'about:blank';
      this.rootOddEl.src = 'about:blank';
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    window.clearTimeout(this.webTimeout);
    window.clearTimeout(this.stopTimeout);
  }
  loadWeb() {
    const { webs } = this.props;
    const web = webs[this.webIndex];
    this.webDuration = web.webDuration;
    const renderEl = this.even ? this.rootEvenEl : this.rootOddEl;
    renderEl.src = web.url;
  }
  playWeb() {
    const { setCurrentlyIsPlaying, webs } = this.props;
    const playEl = this.even ? this.rootEvenEl : this.rootOddEl;
    const hideEl = !this.even ? this.rootEvenEl : this.rootOddEl;
    playEl.style.display = 'block';
    hideEl.style.display = 'none';
    hideEl.src = 'about:blank';
    this.even = !this.even;
    if (this.webIndex < webs.length - 1) {
      this.webIndex += 1;
      this.webTimeout = window.setTimeout(this.playWeb, this.webDuration * 1000);
      this.loadWeb();
    } else {
      this.stopTimeout = window.setTimeout(() => {
        setCurrentlyIsPlaying(false);
      }, this.webDuration * 1000);
    }
  }
  render() {
    return (
      <div id={styles.root}>
        <iframe
          frameBorder="0"
          scrolling="no"
          style={{ display: 'none' }}
          id={styles.rootEven}
          className={styles.rootIFrame}
          src="about:blank"
        />
        <iframe
          frameBorder="0"
          scrolling="no"
          style={{ display: 'none' }}
          id={styles.rootOdd}
          className={styles.rootIFrame}
          src="about:blank"
        />
      </div>
    );
  }
}
PlayerWebs.propTypes = {
  currentlyIsPlaying: PropTypes.bool.isRequired,
  currentlyPlaying: PropTypes.string,
  nextPlaying: PropTypes.string,
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
  setNextIsReady: PropTypes.func.isRequired,
  webs: PropTypes.array.isRequired,
};
export default PlayerWebs;
