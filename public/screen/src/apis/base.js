const URL_REGEX = /^<([^>]*)>/;
let base;
let separator;
export const getBase = () => base;
export const getSeparator = () => separator;
export const fetchBase = () => {
  if (process.env.NODE_ENV !== 'production') {
    base = '/data/wp/v2/';
    separator = '?';
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
      base = `${URL_REGEX.exec(link)[1]}wp/v2/`;
      if (base.indexOf('?') === -1) {
        separator = '?';
      } else {
        separator = '&';
      }
      resolve();
    });
    xmlhttp.addEventListener('error', () => {
      reject({ message: '500' });
    });
    xmlhttp.addEventListener('abort', () => {
      reject({ message: '500' });
    });
    xmlhttp.open('HEAD', '/', true);
    xmlhttp.send();
  });
};
