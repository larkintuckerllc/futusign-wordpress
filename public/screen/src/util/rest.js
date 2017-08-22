export const get = (endpoint) => (
  new Promise((resolve, reject) => {
    let result;
    let cleanUp = () => {}; // WILL REASSIGN
    const xmlhttp = new XMLHttpRequest();
    const handleLoad = () => {
      const status = xmlhttp.status;
      if (status !== 200) {
        reject({ message: status.toString() });
        cleanUp();
        return;
      }
      try {
        result = JSON.parse(xmlhttp.responseText);
      } catch (error) {
        reject({ message: '500' });
        cleanUp();
        return;
      }
      resolve(result);
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
    xmlhttp.open('GET', endpoint, true);
    xmlhttp.send();
  })
);
export const getFile = (url) => (
  new Promise((resolve, reject) => {
    let cleanUp = () => {}; // WILL REASSIGN
    const xmlhttp = new XMLHttpRequest();
    const handleLoad = () => {
      const status = xmlhttp.status;
      if (status !== 200) {
        reject({ message: status.toString() });
        cleanUp();
        return;
      }
      const fileReader = new FileReader();
      fileReader.onload = ({ target: { result } }) => {
        resolve(result);
        cleanUp();
      };
      fileReader.readAsDataURL(xmlhttp.response);
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
    xmlhttp.open('GET', url, true);
    xmlhttp.responseType = 'blob';
    xmlhttp.send();
  })
);
