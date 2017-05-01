const BASE64_MARKER = ';base64,';

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
export const minLargerPriority = (start, media) => {
  let priority = Infinity;
  for (let i = 0; i < media.length; i += 1) {
    const iPriority = media[i].priority;
    priority = (iPriority > start && iPriority < priority) ? iPriority : priority;
  }
  return priority;
};
