import { MONITOR_API_ENDPOINT, SITE_URL } from '../strings';
import * as fromRest from '../util/rest';

// eslint-disable-next-line
export const get = (playlistIds) => {
  const version = Date.now();
  return fromRest.get(`${SITE_URL}${MONITOR_API_ENDPOINT}?version=${version}`)
  .catch(() => null);
};
