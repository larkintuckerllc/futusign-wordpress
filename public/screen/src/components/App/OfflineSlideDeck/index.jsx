// TODO: REFACTOR INTO NEW
import React, { Component, PropTypes } from 'react';
import pdfjsLib from 'pdfjs-dist';
import { convertDataURIToBinary } from '../../../util/misc';
import styles from './index.scss';
import offline from './offline.png';

class OfflineSlideDeck extends Component {
  constructor() {
    super();
    this.handleFile = this.handleFile.bind(this);
    this.handleDocument = this.handleDocument.bind(this);
    this.renderSlideDeck = this.renderSlideDeck.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.handlePage = this.handlePage.bind(this);
  }
  componentDidMount() {
    const rootEl = document.getElementById(styles.root);
    this.rootWidth = rootEl.offsetWidth;
    this.rootHeight = rootEl.offsetHeight;
    this.canvasOddEl = document.getElementById(styles.rootCanvasOdd);
    this.canvasEvenEl = document.getElementById(styles.rootCanvasEven);
    this.slideDuration = 2;
    this.odd = true;
    this.iList = 0;
    this.renderSlideDeck();
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    window.clearTimeout(this.coverTimeout);
    window.clearTimeout(this.renderTimeout);
  }
  handlePage(pdfPage) {
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
    });
  }
  showRendered() {
    this.renderCanvasEl = this.odd ? this.canvasOddEl : this.canvasEvenEl;
    const renderedCanvasEl = !this.odd ? this.canvasOddEl : this.canvasEvenEl;
    this.renderCanvasEl.style.display = 'none';
    renderedCanvasEl.style.display = 'block';
    // TODO: NEW COVER
    this.coverTimeout = window.setTimeout(() => {
      // TODO: NEW COVER
    }, (this.slideDuration - 1) * 1000);
  }
  // eslint-disable-next-line
  renderPage() {
    const { setBadPlaying } = this.props;
    this.showRendered();
    this.pdfDocument.getPage(this.iPage).then(
      this.handlePage,
      () => {
        setBadPlaying(true);
      });
    this.odd = !this.odd;
    this.iPage += 1;
    if (this.iPage <= this.numPages) {
      this.renderTimeout = window.setTimeout(this.renderPage, this.slideDuration * 1000);
      this.slideDuration = window.localStorage.getItem('futusign_slide_deck_slide_duration');
    } else {
      this.iPage = 1;
      // DUPLICATED FOR THE CASE OF A SINGLE PAGE
      this.slideDuration = window.localStorage.getItem('futusign_slide_deck_slide_duration');
      this.renderTimeout = window.setTimeout(() => {
        this.renderPage();
      }, this.slideDuration * 1000);
    }
  }
  handleDocument(pdfDocument) {
    this.pdfDocument = pdfDocument;
    this.iPage = 1;
    this.numPages = pdfDocument.numPages;
    this.renderPage();
  }
  handleFile(file) {
    const { setBadPlaying } = this.props;
    const loadingTask = pdfjsLib.getDocument({
      data: convertDataURIToBinary(file),
      worker: window.futusignPDFWorker,
    });
    loadingTask.promise.then(
      this.handleDocument,
      () => {
        setBadPlaying(true);
      }
    );
  }
  renderSlideDeck() {
    const lastSlideDeckFile = window.localStorage.getItem('futusign_slide_deck_file');
    this.handleFile(lastSlideDeckFile);
  }
  render() {
    return (
      <div id={styles.root}>
        <canvas id={styles.rootCanvasOdd} />
        <canvas id={styles.rootCanvasEven} />
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
