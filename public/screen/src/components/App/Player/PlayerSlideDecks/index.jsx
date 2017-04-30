import React, { Component, PropTypes } from 'react';
import pdfjsLib from 'pdfjs-dist';
import { convertDataURIToBinary } from '../../../../util/misc';
import { getFile } from '../../../../util/rest';
import { SLIDE_DECKS } from '../../../../strings';
import styles from './index.scss';

class PlayerSlideDecks extends Component {
  constructor(props) {
    super(props);
    this.slideDeckIndex = null;
    this.pdfDocument = null;
    this.pageNumber = null;
    this.numberOfPages = null;
    this.rootCanvasEvenEl = null;
    this.rootCanvasOddEl = null;
    this.renderCanvasEl = null;
    this.rootWidth = null;
    this.rootHeight = null;
    this.even = true;
    this.slideDuration = null;
    this.slideTimeout = null;
    this.clearTimeout = null;
    this.mounted = true;
    this.playSlide = this.playSlide.bind(this);
    this.loadSlideDeck = this.loadSlideDeck.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleDocument = this.handleDocument.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.handlePage = this.handlePage.bind(this);
  }
  componentDidMount() {
    const rootEl = document.getElementById(styles.root);
    this.rootWidth = rootEl.offsetWidth;
    this.rootHeight = rootEl.offsetHeight;
    this.rootCanvasEvenEl = document.getElementById(styles.rootCanvasEven);
    this.rootCanvasOddEl = document.getElementById(styles.rootCanvasOdd);
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
      nextPlaying !== SLIDE_DECKS &&
      upNextPlaying === SLIDE_DECKS
    ) {
      this.slideDeckIndex = 0;
      this.loadSlideDeck();
    }
    // START PLAYING
    if (
      currentlyPlaying === SLIDE_DECKS &&
      !currentlyIsPlaying &&
      upCurrentlyIsPlaying
    ) {
      this.playSlide();
    }
    // STOP SHOWING
    if (
      currentlyPlaying === SLIDE_DECKS &&
      upCurrentlyPlaying !== SLIDE_DECKS
    ) {
      this.rootCanvasEvenEl.style.opacity = 0.1;
      this.rootCanvasOddEl.style.opacity = 0.1;
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
  handlePage(pdfPage) {
    if (!this.mounted) { return; }
    const { setBadPlaying, setNextIsReady } = this.props;
    let viewport = pdfPage.getViewport(1);
    const pdfWidth = viewport.width;
    const pdfHeight = viewport.height;
    const scaleX = this.rootWidth / pdfWidth;
    const scaleY = this.rootHeight / pdfHeight;
    const scale = Math.max(scaleX, scaleY);
    this.renderCanvasEl.width = pdfWidth * scale;
    this.renderCanvasEl.height = pdfHeight * scale;
    viewport = pdfPage.getViewport(scale);
    pdfPage.render({
      canvasContext: this.renderCanvasEl.getContext('2d'),
      viewport,
    }).then(() => {
      if (!this.mounted) { return; }
      if (this.slideDeckIndex === 0 && this.pageNumber === 1) {
        setNextIsReady(true);
      }
    }, () => setBadPlaying(true));
  }
  // eslint-disable-next-line
  renderPage() {
    const { setBadPlaying } = this.props;
    this.renderCanvasEl = this.even ? this.rootCanvasEvenEl : this.rootCanvasOddEl;
    this.pdfDocument.getPage(this.pageNumber).then(
      this.handlePage, () => setBadPlaying(true)
    );
  }
  handleDocument(pdfDocument) {
    if (!this.mounted) { return; }
    this.pdfDocument = pdfDocument;
    this.pageNumber = 1;
    this.numberOfPages = pdfDocument.numPages;
    this.renderPage();
  }
  handleFile(file) {
    const { setBadPlaying, slideDecks } = this.props;
    if (!this.mounted) { return; }
    const loadingTask = pdfjsLib.getDocument({
      data: convertDataURIToBinary(file),
      worker: window.futusignPDFWorker,
    });
    // CACHING OFFLINE
    if (this.iList === 0) {
      const newSlideDeckURL = slideDecks[0].file;
      const newSlideDeckDuration = slideDecks[0].slideDuration;
      const lastSlideDeckURL = window.localStorage.getItem('futusign_slide_deck_url');
      const lastSlideDeckDuration =
        window.localStorage.getItem('futusign_slide_deck_slide_duration');
      if (
        newSlideDeckURL !== lastSlideDeckURL ||
        newSlideDeckDuration !== lastSlideDeckDuration
      ) {
        window.localStorage.setItem('futusign_slide_deck_url', newSlideDeckURL);
        window.localStorage.setItem('futusign_slide_deck_file', file);
        window.localStorage.setItem(
          'futusign_slide_deck_slide_duration',
          newSlideDeckDuration
        );
      }
    }
    loadingTask.promise.then(this.handleDocument, () => setBadPlaying(true));
  }
  loadSlideDeck() {
    const { setBadPlaying, slideDecks } = this.props;
    const slideDeck = slideDecks[this.slideDeckIndex];
    this.slideDuration = slideDeck.slideDuration;
    getFile(slideDeck.file)
    .then(this.handleFile, () => setBadPlaying(true));
  }
  playSlide() {
    const { setCurrentlyIsPlaying, slideDecks } = this.props;
    const playCanvasEl = this.even ? this.rootCanvasEvenEl : this.rootCanvasOddEl;
    const hideCanvasEl = !this.even ? this.rootCanvasEvenEl : this.rootCanvasOddEl;
    playCanvasEl.style.opacity = 1;
    hideCanvasEl.style.opacity = 0.1;
    this.even = !this.even;
    this.pageNumber += 1;
    if (this.pageNumber <= this.numberOfPages) {
      this.renderPage();
      this.slideTimeout = window.setTimeout(this.playSlide, this.slideDuration * 1000);
      return;
    }
    if (this.slideDeckIndex < slideDecks.length - 1) {
      this.slideDeckIndex += 1;
      this.slideTimeout = window.setTimeout(this.playSlide, this.slideDuration * 1000);
      this.loadSlideDeck();
    } else {
      this.stopTimeout = window.setTimeout(() => {
        setCurrentlyIsPlaying(false);
      }, this.slideDuration * 1000);
    }
  }
  render() {
    return (
      <div id={styles.temp}>
        <div id={styles.root}>
          <canvas
            style={{ opacity: 0.1 }}
            id={styles.rootCanvasEven}
          />
        </div>
        <div id={styles.root2}>
          <canvas
            style={{ opacity: 0.1 }}
            id={styles.rootCanvasOdd}
          />
        </div>
      </div>
    );
  }
}
PlayerSlideDecks.propTypes = {
  currentlyIsPlaying: PropTypes.bool.isRequired,
  currentlyPlaying: PropTypes.string,
  nextPlaying: PropTypes.string,
  setBadPlaying: PropTypes.func.isRequired,
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
  setNextIsReady: PropTypes.func.isRequired,
  slideDecks: PropTypes.array.isRequired,
};
export default PlayerSlideDecks;
