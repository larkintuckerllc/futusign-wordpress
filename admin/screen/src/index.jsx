// @flow
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

window.console.log('hello');
render(
  <div>Hello</div>,
  document.getElementById('root'),
);
