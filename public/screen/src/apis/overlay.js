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
      upperLeft:
        response.acf !== undefined &&
        response.acf.upper_left !== undefined &&
        response.acf.upper_left.ID !== undefined ?
        response.acf.upper_left.ID : null,
      upperMiddle:
        response.acf !== undefined &&
        response.acf.upper_middle !== undefined &&
        response.acf.upper_middle.ID !== undefined ?
        response.acf.upper_middle.ID : null,
      upperRight:
        response.acf !== undefined &&
        response.acf.upper_right !== undefined &&
        response.acf.upper_right.ID !== undefined ?
        response.acf.upper_right.ID : null,
      middleLeft:
        response.acf !== undefined &&
        response.acf.middle_left !== undefined &&
        response.acf.middle_left.ID !== undefined ?
        response.acf.middle_left.ID : null,
      middleRight:
        response.acf !== undefined &&
        response.acf.middle_right !== undefined &&
        response.acf.middle_right.ID !== undefined ?
        response.acf.middle_right.ID : null,
      lowerLeft:
        response.acf !== undefined &&
        response.acf.lower_left !== undefined &&
        response.acf.lower_left.ID !== undefined ?
        response.acf.lower_left.ID : null,
      lowerMiddle:
        response.acf !== undefined &&
        response.acf.lower_middle !== undefined &&
        response.acf.lower_middle.ID !== undefined ?
        response.acf.lower_middle.ID : null,
      lowerRight:
        response.acf !== undefined &&
        response.acf.lower_right !== undefined &&
        response.acf.lower_right.ID !== undefined ?
        response.acf.lower_right.ID : null,
    }))
    .catch(() => (null));
};
