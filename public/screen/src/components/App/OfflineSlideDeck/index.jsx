import React, { Component, PropTypes } from 'react';
import pdfjsLib from 'pdfjs-dist';
import { convertDataURIToBinary } from '../../../util/misc';
import styles from './index.scss';
import offline from './offline.png';

class OfflineSlideDeck extends Component {
  constructor() {
    super();
    this.firstPass = true;
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
    this.mounted = true;
    this.loadingTask = null;
    this.playSlide = this.playSlide.bind(this);
    this.loadSlideDeck = this.loadSlideDeck.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleDocument = this.handleDocument.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.handlePage = this.handlePage.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
  }
  componentDidMount() {
    const rootEl = document.getElementById(styles.root);
    this.rootWidth = rootEl.offsetWidth;
    this.rootHeight = rootEl.offsetHeight;
    this.rootCanvasEvenEl = document.getElementById(styles.rootCanvasEven);
    this.rootCanvasOddEl = document.getElementById(styles.rootCanvasOdd);
    this.loadSlideDeck();
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    window.clearTimeout(this.slideTimeout);
    if (this.loadingTask !== null) {
      this.loadingTask.destroy();
    }
    this.mounted = false;
  }
  handlePage(pdfPage) {
    if (!this.mounted) { return; }
    const { setBadPlaying } = this.props;
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
      if (this.firstPass) {
        this.firstPass = false;
        this.playSlide();
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
    const { setBadPlaying } = this.props;
    const loadingTask = pdfjsLib.getDocument({
      data: convertDataURIToBinary(file),
      worker: window.futusignPDFWorker,
    });
    loadingTask.promise.then(this.handleDocument, () => setBadPlaying(true));
  }
  handleDestroy() {
    const file = window.localStorage.getItem('futusign_slide_deck_file');
    this.slideDuration = window.localStorage.getItem('futusign_slide_deck_slide_duration');
    this.handleFile(file);
  }
  loadSlideDeck() {
    const { setBadPlaying } = this.props;
    if (this.loadingTask === null) {
      this.handleDestroy();
    } else {
      this.loadingTask.destroy()
        .then(this.handleDestroy, () => setBadPlaying(true));
    }
  }
  playSlide() {
    const playCanvasEl = this.even ? this.rootCanvasEvenEl : this.rootCanvasOddEl;
    const hideCanvasEl = !this.even ? this.rootCanvasEvenEl : this.rootCanvasOddEl;
    playCanvasEl.style.display = 'block';
    hideCanvasEl.style.display = 'none';
    this.even = !this.even;
    this.pageNumber = this.pageNumber < this.numberOfPages ?
      this.pageNumber + 1 : 1;
    this.renderPage();
    this.slideTimeout = window.setTimeout(this.playSlide, this.slideDuration * 1000);
  }
  render() {
    return (
      <div id={styles.root}>
        <canvas
          style={{ display: 'none' }}
          id={styles.rootCanvasEven}
        />
        <canvas
          style={{ display: 'none' }}
          id={styles.rootCanvasOdd}
        />
        <div
          id={styles.rootOffline}
          style={{ backgroundImage: `url(${offline})` }}
        />
      </div>
    );
  }
}
OfflineSlideDeck.propTypes = {
  setBadPlaying: PropTypes.func.isRequired,
};
export default OfflineSlideDeck;
