import { SITE_URL } from '../strings';

let pretty = true;
export const getPretty = () => pretty;
export const fetchBase = () => {
  if (process.env.NODE_ENV !== 'production') {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    let cleanUp = () => {}; // WILL REASSIGN
    const xmlhttp = new XMLHttpRequest();
    const handleLoad = () => {
      const status = xmlhttp.status;
      if (status !== 200) {
        reject({ message: status.toString() });
        cleanUp();
        return;
      }
      const link = xmlhttp.getResponseHeader('Link');
      if (link.indexOf('?') !== -1) {
        pretty = false;
      }
      resolve();
      cleanUp();
    };
    const handleError = () => {
      reject({ message: '500' });
      cleanUp();
    };
    cleanUp = () => {
      xmlhttp.removeEventListener('load', handleLoad);
      xmlhttp.removeEventListener('error', handleError);
      xmlhttp.removeEventListener('abort', handleError);
    };
    xmlhttp.addEventListener('load', handleLoad);
    xmlhttp.addEventListener('error', handleError);
    xmlhttp.addEventListener('abort', handleError);
    xmlhttp.open('HEAD', SITE_URL, true);
    xmlhttp.send();
  });
};
