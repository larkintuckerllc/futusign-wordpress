import { SLIDE_DECKS_API_ENDPOINT } from '../strings';
import * as fromRest from '../util/rest';
import { getBase, getSeparator } from './base';

// eslint-disable-next-line
export const get = (listIds, override) => {
  const slug = override ? 'fs-overrides' : 'fs-playlists';
  const version = Date.now();
// eslint-disable-next-line
  return fromRest.get(`${getBase()}${SLIDE_DECKS_API_ENDPOINT}${getSeparator()}${slug}=${listIds.join(',')}&per_page=100&order=asc&orderby=title&version=${version}`)
    .then(response => (response.map(o => ({
      id: o.id,
      title: o.title.rendered,
      file: o.acf.file,
      slideDuration: Number(o.acf.slide_duration),
      priority: o.acf.priority !== undefined ? Number(o.acf.priority) : 1,
    }))));
};
