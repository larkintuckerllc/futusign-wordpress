import { ENDPOINT_API_ENDPOINT, SITE_URL } from '../strings';
import * as fromRest from '../util/rest';

// eslint-disable-next-line
export const get = (id) => {
  // eslint-disable-next-line
  return fromRest.get(`${SITE_URL}${ENDPOINT_API_ENDPOINT}?futusign_screen_id=${id.toString()}`);
};
