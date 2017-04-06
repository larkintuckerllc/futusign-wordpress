import React, { Component, PropTypes } from 'react';
import pdfjsLib from 'pdfjs-dist';
import { convertDataURIToBinary } from '../../../../util/misc';
import { getFile } from '../../../../util/rest';
import styles from './index.scss';

class PlayerSlideDecks extends Component {
  constructor() {
    super();
    this.handleFile = this.handleFile.bind(this);
    this.handleDocument = this.handleDocument.bind(this);
    this.renderSlideDeck = this.renderSlideDeck.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.handlePage = this.handlePage.bind(this);
    this.futusignCoverEl = document.getElementById('futusign_cover');
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
    this.futusignCoverEl.style.opacity = 0;
    this.coverTimeout = window.setTimeout(() => {
      this.futusignCoverEl.style.opacity = 1;
    }, (this.slideDuration - 1) * 1000);
  }
  // eslint-disable-next-line
  renderPage() {
    const { done, resetPlaying, setBadPlaying, slideDecks } = this.props;
    this.showRendered();
    this.pdfDocument.getPage(this.iPage).then(
      this.handlePage,
      () => {
        setBadPlaying(true);
        resetPlaying();
      });
    this.odd = !this.odd;
    this.iPage += 1;
    if (this.iPage <= this.numPages) {
      this.renderTimeout = window.setTimeout(this.renderPage, this.slideDuration * 1000);
      this.slideDuration = slideDecks[this.iList].slideDuration;
    } else {
      const lastIList = this.iList;
      // MOVE TO NEXT DECK
      if (this.iList < slideDecks.length - 1) {
        this.iList += 1;
        this.renderTimeout = window.setTimeout(this.renderSlideDeck, this.slideDuration * 1000);
        this.slideDuration = slideDecks[lastIList].slideDuration;
      // END OF LAST DECK
      } else {
        this.renderTimeout = window.setTimeout(() => {
          this.slideDuration = slideDecks[this.iList].slideDuration;
          this.showRendered();
          this.renderTimeout = window.setTimeout(() => {
            done();
          }, this.slideDuration * 1000);
        }, this.slideDuration * 1000);
      }
    }
  }
  handleDocument(pdfDocument) {
    this.pdfDocument = pdfDocument;
    this.iPage = 1;
    this.numPages = pdfDocument.numPages;
    this.renderPage();
  }
  handleFile(file) {
    const { resetPlaying, setBadPlaying, slideDecks } = this.props;
    const loadingTask = pdfjsLib.getDocument({
      data: convertDataURIToBinary(file),
      worker: window.futusignPDFWorker,
    });
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
    loadingTask.promise.then(
      this.handleDocument,
      () => {
        setBadPlaying(true);
        resetPlaying();
      }
    );
  }
  renderSlideDeck() {
    const { resetPlaying, setOfflinePlaying, slideDecks } = this.props;
    getFile(slideDecks[this.iList].file)
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
        <canvas id={styles.rootCanvasOdd} />
        <canvas id={styles.rootCanvasEven} />
      </div>
    );
  }
}
PlayerSlideDecks.propTypes = {
  done: PropTypes.func.isRequired,
  resetPlaying: PropTypes.func.isRequired,
  setBadPlaying: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
  slideDecks: PropTypes.array.isRequired,
};
export default PlayerSlideDecks;
