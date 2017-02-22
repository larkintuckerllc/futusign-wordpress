import { SCREENS_API_ENDPOINT } from '../strings';
import * as fromRest from '../util/rest';
import { getBase } from './base';

// eslint-disable-next-line
export const get = (id) => {
  const version = Date.now();
  return fromRest.get(`${getBase()}${SCREENS_API_ENDPOINT}/${id}?version=${version}`)
    .then(response => ({
      id: response.id,
      subscribedPlaylistIds: response['fs-playlists'],
    }));
};
