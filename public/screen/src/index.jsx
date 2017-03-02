import 'babel-polyfill';
import React from 'react';
import pdfjsLib from 'pdfjs-dist';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import App from './components/App';
import './index.scss';

// eslint-disable-next-line
__webpack_public_path__ = window.publicPath;
pdfjsLib.PDFJS.workerSrc = `${window.publicPath}pdf.worker.js`;
window.futusignPDFWorker = new pdfjsLib.PDFWorker();
const store = configureStore();
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
