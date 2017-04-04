import { SCREENS_API_ENDPOINT } from '../strings';
import * as fromRest from '../util/rest';
import { getBase, getSeparator } from './base';

// eslint-disable-next-line
export const get = (id) => {
  const version = Date.now();
  // eslint-disable-next-line
  return fromRest.get(`${getBase()}${SCREENS_API_ENDPOINT}/${id}${getSeparator()}version=${version}`)
    .then(response => ({
      id: response.id,
      title: response.title.rendered,
      subscribedPlaylistIds: response['fs-playlists'],
      overlay: response.acf.overlay.ID !== undefined ? response.acf.overlay.ID : null,
    }));
};
