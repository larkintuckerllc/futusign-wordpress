const BASE64_MARKER = ';base64,';

// eslint-disable-next-line
export const convertDataURIToBinary = (dataUri) => {
  const base64Index = dataUri.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  const base64 = dataUri.substring(base64Index);
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));
  for (let i = 0; i < rawLength; i += 1) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
};
