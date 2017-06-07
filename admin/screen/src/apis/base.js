import { SITE_URL } from '../strings';

let pretty = true;
export const getPretty = () => pretty;
export const fetchBase = () => {
  if (process.env.NODE_ENV !== 'production') {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener('load', () => {
      const status = xmlhttp.status;
      if (status !== 200) {
        reject({ message: status.toString() });
      }
      const link = xmlhttp.getResponseHeader('Link');
      if (link.indexOf('?') !== -1) {
        pretty = false;
      }
      resolve();
    });
    xmlhttp.addEventListener('error', () => {
      reject({ message: '500' });
    });
    xmlhttp.addEventListener('abort', () => {
      reject({ message: '500' });
    });
    xmlhttp.open('HEAD', SITE_URL, true);
    xmlhttp.send();
  });
};
