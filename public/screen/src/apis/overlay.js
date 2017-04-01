import { OVERLAYS_API_ENDPOINT } from '../strings';
import * as fromRest from '../util/rest';
import { getBase, getSeparator } from './base';

// TODO: WORRY ABOUT NULL CASE
// eslint-disable-next-line
export const get = (id) => {
  const version = Date.now();
  // eslint-disable-next-line
  return fromRest.get(`${getBase()}${OVERLAYS_API_ENDPOINT}/${id}${getSeparator()}version=${version}`)
    .then(response => ({
      id,
      upperLeft: response.acf.upper_left,
    }))
    .catch(() => ({
      id,
      upperLeft: null,
    }));
};
