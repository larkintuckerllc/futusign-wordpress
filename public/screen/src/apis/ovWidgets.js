import { OV_WIDGETS_API_ENDPOINT } from '../strings';
import * as fromRest from '../util/rest';
import { getBase, getSeparator } from './base';

// eslint-disable-next-line
export const get = () => {
  const version = Date.now();
// eslint-disable-next-line
  return fromRest.get(`${getBase()}${OV_WIDGETS_API_ENDPOINT}${getSeparator()}version=${version}`)
  .then(response => (response.map(o => ({
    id: o.id,
  }))));
};
