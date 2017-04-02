import { OVERLAYS_API_ENDPOINT } from '../strings';
import * as fromRest from '../util/rest';
import { getBase, getSeparator } from './base';

// eslint-disable-next-line
export const get = (id) => {
  const version = Date.now();
  // eslint-disable-next-line
  return fromRest.get(`${getBase()}${OVERLAYS_API_ENDPOINT}/${id}${getSeparator()}version=${version}`)
    .then(response => ({
      id,
      upperLeft: response.acf.upper_left !== false ?
        response.acf.upper_left : null,
      upperMiddle: response.acf.upper_middle !== false ?
        response.acf.upper_middle : null,
      upperRight: response.acf.upper_right !== false ?
        response.acf.upper_right : null,
      middleLeft: response.acf.middle_left !== false ?
        response.acf.middle_left : null,
      middleRight: response.acf.middle_right !== false ?
        response.acf.middle_right : null,
      lowerLeft: response.acf.lower_left !== false ?
        response.acf.lower_left : null,
      lowerMiddle: response.acf.lower_middle !== false ?
        response.acf.lower_middle : null,
      lowerRight: response.acf.lower_right !== false ?
        response.acf.lower_right : null,
    }))
    .catch(() => (null));
};
