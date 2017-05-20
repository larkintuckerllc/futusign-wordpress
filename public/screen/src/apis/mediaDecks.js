import { IMAGES, WEBS, YOUTUBE_VIDEOS, MEDIA_DECKS_API_ENDPOINT } from '../strings';
import * as fromRest from '../util/rest';
import { getBase, getSeparator } from './base';

// eslint-disable-next-line
export const get = (listIds, override) => {
  const slug = override ? 'fs-overrides' : 'fs-playlists';
  const version = Date.now();
// eslint-disable-next-line
  return fromRest.get(`${getBase()}${MEDIA_DECKS_API_ENDPOINT}${getSeparator()}${slug}=${listIds.join(',')}&per_page=100&order=asc&orderby=title&version=${version}`)
    .then(response => {
      const mediaDecks = [];
      for (let i = 0; i < response.length; i += 1) {
        const media = [];
        const mediaDeckRaw = response[i];
        for (let j = 0; j < mediaDeckRaw.acf.media.length; j += 1) {
          const mediaItemRaw = mediaDeckRaw.acf.media[j];
          switch (mediaItemRaw.acf_fc_layout) {
            case 'image':
              media.push({
                type: IMAGES,
                file: mediaItemRaw.file,
                imageDuration: Number(mediaItemRaw.image_duration),
              });
              break;
            case 'web':
              media.push({
                type: WEBS,
                url: mediaItemRaw.url,
                webDuration: Number(mediaItemRaw.web_duration),
              });
              break;
            case 'youtube':
              media.push({
                type: YOUTUBE_VIDEOS,
                url: mediaItemRaw.url,
                suggestedQuality: mediaItemRaw.suggested_quality,
              });
              break;
            default:
          }
        }
        mediaDecks.push({
          id: mediaDeckRaw.id,
          title: mediaDeckRaw.title.rendered,
          priority: mediaDeckRaw.acf.priority !== undefined ? Number(mediaDeckRaw.acf.priority) : 1,
          media,
        });
      }
      return mediaDecks;
    })
    .catch(() => ([]));
};
