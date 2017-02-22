import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import pdfjsLib from 'pdfjs-dist';
import { getFile } from '../../../util/rest';
import { convertDataURIToBinary } from '../../../util/misc';
import * as fromOfflinePlaying from '../../../ducks/offlinePlaying';
import * as fromBadPlaying from '../../../ducks/badPlaying';
import styles from './index.scss';

pdfjsLib.PDFJS.workerSrc = `${window.publicPath}pdf.worker.js`;
class Slideshow extends Component {
  constructor() {
    super();
    this.handleFile = this.handleFile.bind(this);
    this.handleDocument = this.handleDocument.bind(this);
    this.renderPlayable = this.renderPlayable.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.handlePage = this.handlePage.bind(this);
  }
  componentDidMount() {
    const { slideDecks } = this.props;
    const rootEl = document.getElementById(styles.root);
    this.rootWidth = rootEl.offsetWidth;
    this.rootHeight = rootEl.offsetHeight;
    this.canvasOddEl = document.getElementById(styles.rootCanvasOdd);
    this.canvasEvenEl = document.getElementById(styles.rootCanvasEven);
    this.coverEl = document.getElementById(styles.rootCover);
    this.slideDecks = slideDecks;
    this.slideDuration = 2;
    this.worker = new pdfjsLib.PDFWorker();
    this.start();
  }
  componentWillReceiveProps(nextProps) {
    const { slideDecks } = this.props;
    const nextSlideDecks = nextProps.slideDecks;
    if (
      slideDecks.map(o => o.id).join() !==
      nextSlideDecks.map(o => o.id).join()) {
      window.clearTimeout(this.renderTimeout);
      this.slideDecks = nextProps.slideDecks;
      this.slideDuration = 2;
      this.start();
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    window.clearTimeout(this.renderTimeout);
  }
  start() {
    this.first = true;
    this.odd = true;
    this.iList = 0;
    this.renderPlayable();
  }
  handleFile(file) {
    const { setBadPlaying } = this.props;
    const loadingTask = pdfjsLib.getDocument({
      data: convertDataURIToBinary(file),
      worker: this.worker,
    });
    loadingTask.promise.then(
      this.handleDocument,
      () => {
        setBadPlaying(true);
      }
    );
  }
  handleDocument(pdfDocument) {
    this.pdfDocument = pdfDocument;
    this.iPage = 1;
    this.numPages = pdfDocument.numPages;
    this.renderPage();
  }
  handlePage(pdfPage) {
    let viewport = pdfPage.getViewport(1);
    const pdfWidth = viewport.width;
    const pdfHeight = viewport.height;
    const scaleX = this.rootWidth / pdfWidth;
    const scaleY = this.rootHeight / pdfHeight;
    const scale = Math.min(scaleX, scaleY);
    this.renderCanvasEl.width = pdfWidth * scale;
    this.renderCanvasEl.height = pdfHeight * scale;
    viewport = pdfPage.getViewport(scale);
    pdfPage.render({
      canvasContext: this.renderCanvasEl.getContext('2d'),
      viewport,
    });
  }
  renderPage() {
    const { setBadPlaying } = this.props;
    this.renderCanvasEl = this.odd ? this.canvasOddEl : this.canvasEvenEl;
    const renderedCanvasEl = !this.odd ? this.canvasOddEl : this.canvasEvenEl;
    this.renderCanvasEl.style.display = 'none';
    renderedCanvasEl.style.display = 'block';
    this.coverEl.style.opacity = 0;
    window.setTimeout(() => {
      this.coverEl.style.opacity = 1;
    }, (this.slideDuration - 1) * 1000);
    this.pdfDocument.getPage(this.iPage).then(
      this.handlePage,
      () => {
        setBadPlaying(true);
      });
    this.first = false;
    this.odd = !this.odd;
    this.iPage += 1;
    if (this.iPage <= this.numPages) {
      this.renderTimeout = window.setTimeout(this.renderPage, this.slideDuration * 1000);
      this.slideDuration = this.slideDecks[this.iList].slideDuration;
    } else {
      const lastIList = this.iList;
      this.iList = this.iList < this.slideDecks.length - 1
        ? this.iList + 1 : 0;
      this.renderTimeout = window.setTimeout(this.renderPlayable, this.slideDuration * 1000);
      this.slideDuration = this.slideDecks[lastIList].slideDuration;
    }
  }
  renderPlayable() {
    const { setOfflinePlaying } = this.props;
    getFile(this.slideDecks[this.iList].file)
      .then(
        this.handleFile,
        () => {
          setOfflinePlaying(true);
        });
  }
  render() {
    return (
      <div id={styles.root}>
        <canvas id={styles.rootCanvasOdd} className={styles.rootCanvas} />
        <canvas id={styles.rootCanvasEven} className={styles.rootCanvas} />
        <div id={styles.rootCover} />
      </div>
    );
  }
}
Slideshow.propTypes = {
  slideDecks: PropTypes.array.isRequired,
  setBadPlaying: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
};
export default connect(
  null,
  {
    setBadPlaying: fromBadPlaying.setBadPlaying,
    setOfflinePlaying: fromOfflinePlaying.setOfflinePlaying,
  }
)(Slideshow);
