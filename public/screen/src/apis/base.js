const URL_REGEX = /^<([^>]*)>/;
let base;
export const getBase = () => base;
export const fetchBase = () => (
  new Promise((resolve, reject) => {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener('load', () => {
      const status = xmlhttp.status;
      if (status !== 200) {
        reject({ message: status.toString() });
      }
      const link = xmlhttp.getResponseHeader('Link');
      base = link !== null ? `${URL_REGEX.exec(link)[1]}wp/v2/` : 'data/';
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
  })
);
