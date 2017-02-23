import { SLIDE_DECKS_API_ENDPOINT } from '../strings';
import * as fromRest from '../util/rest';
import { getBase, getSeparator } from './base';

// eslint-disable-next-line
export const get = (playlistIds) => {
  const version = Date.now();
// eslint-disable-next-line
  return fromRest.get(`${getBase()}${SLIDE_DECKS_API_ENDPOINT}${getSeparator()}fs-playlists=${playlistIds.join(',')}&version=${version}`)
    .then(response => (response.map(o => ({
      id: o.id,
      file: o.acf.file,
      slideDuration: Number(o.acf.slide_duration),
    }))));
};
