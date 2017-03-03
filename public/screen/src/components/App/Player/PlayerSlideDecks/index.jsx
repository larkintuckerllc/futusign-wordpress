import React, { Component, PropTypes } from 'react';
import pdfjsLib from 'pdfjs-dist';
import { LOADING } from '../../../../ducks/currentlyPlaying';
import { convertDataURIToBinary } from '../../../../util/misc';
import { getFile } from '../../../../util/rest';
import styles from './index.scss';

class PlayerSlideDecks extends Component {
  constructor() {
    super();
    this.handleFile = this.handleFile.bind(this);
    this.handleDocument = this.handleDocument.bind(this);
    this.renderPlayable = this.renderPlayable.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.handlePage = this.handlePage.bind(this);
    this.futusignCoverEl = document.getElementById('futusign_cover');
  }
  componentDidMount() {
    const { slideDecks } = this.props;
    const rootEl = document.getElementById(styles.root);
    this.rootWidth = rootEl.offsetWidth;
    this.rootHeight = rootEl.offsetHeight;
    this.canvasOddEl = document.getElementById(styles.rootCanvasOdd);
    this.canvasEvenEl = document.getElementById(styles.rootCanvasEven);
    this.slideDecks = slideDecks;
    this.slideDuration = 1;
    this.start();
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
  // eslint-disable-next-line
  renderPage() {
    const { done, setBadPlaying, setCurrentlyPlaying } = this.props;
    this.renderCanvasEl = this.odd ? this.canvasOddEl : this.canvasEvenEl;
    const renderedCanvasEl = !this.odd ? this.canvasOddEl : this.canvasEvenEl;
    this.renderCanvasEl.style.display = 'none';
    renderedCanvasEl.style.display = 'block';
    this.futusignCoverEl.style.opacity = 0;
    this.coverTimeout = window.setTimeout(() => {
      this.futusignCoverEl.style.opacity = 1;
    }, (this.slideDuration - 1) * 1000);
    this.pdfDocument.getPage(this.iPage).then(
      this.handlePage,
      () => {
        setBadPlaying(true);
        setCurrentlyPlaying(LOADING);
      });
    this.first = false;
    this.odd = !this.odd;
    this.iPage += 1;
    if (this.iPage <= this.numPages) {
      this.renderTimeout = window.setTimeout(this.renderPage, this.slideDuration * 1000);
      this.slideDuration = this.slideDecks[this.iList].slideDuration;
    } else {
      const lastIList = this.iList;
      // MOVE TO NEXT DECK
      if (this.iList < this.slideDecks.length - 1) {
        this.iList += 1;
        this.renderTimeout = window.setTimeout(this.renderPlayable, this.slideDuration * 1000);
        this.slideDuration = this.slideDecks[lastIList].slideDuration;
      // END OF LAST DECK
      } else {
        this.renderTimeout = window.setTimeout(() => {
          const lastCanvasEl = this.odd ? this.canvasOddEl : this.canvasEvenEl;
          const nextCanvasEl = !this.odd ? this.canvasOddEl : this.canvasEvenEl;
          lastCanvasEl.style.display = 'none';
          nextCanvasEl.style.display = 'block';
          this.futusignCoverEl.style.opacity = 0;
          this.renderTimeout = window.setTimeout(() => {
            this.futusignCoverEl.style.opacity = 1;
            this.renderTimeout = window.setTimeout(() => {
              done();
            }, 1000);
          }, (this.slideDuration - 1) * 1000);
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
    const { setBadPlaying, setCurrentlyPlaying } = this.props;
    const loadingTask = pdfjsLib.getDocument({
      data: convertDataURIToBinary(file),
      worker: window.futusignPDFWorker,
    });
    loadingTask.promise.then(
      this.handleDocument,
      () => {
        setBadPlaying(true);
        setCurrentlyPlaying(LOADING);
      }
    );
  }
  renderPlayable() {
    const { setOfflinePlaying, setCurrentlyPlaying } = this.props;
    getFile(this.slideDecks[this.iList].file)
    .then(
      this.handleFile,
      () => {
        setOfflinePlaying(true);
        setCurrentlyPlaying(LOADING);
      }
    );
  }
  start() {
    this.first = true;
    this.odd = true;
    this.iList = 0;
    this.renderPlayable();
  }
  render() {
    return (
      <div id={styles.root}>
        <canvas id={styles.rootCanvasOdd} className={styles.rootCanvas} />
        <canvas id={styles.rootCanvasEven} className={styles.rootCanvas} />
      </div>
    );
  }
}
PlayerSlideDecks.propTypes = {
  done: PropTypes.func.isRequired,
  setBadPlaying: PropTypes.func.isRequired,
  setCurrentlyPlaying: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
  slideDecks: PropTypes.array.isRequired,
};
export default PlayerSlideDecks;
