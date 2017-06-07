// @flow
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { PRIORITY } from '../../strings';
import { fetchBase } from '../../apis/base';
import * as fromAppBlocking from '../../ducks/appBlocking';
import * as fromScreen from '../../ducks/screen';
import { getImages } from '../../ducks/images';
import { getImagesOverride } from '../../ducks/imagesOverride';
import { getLayers } from '../../ducks/layers';
import { getMediaDecks } from '../../ducks/mediaDecks';
import { getMediaDecksOverride } from '../../ducks/mediaDecksOverride';
import { getSlideDecks } from '../../ducks/slideDecks';
import { getSlideDecksOverride } from '../../ducks/slideDecksOverride';
import { getWebs } from '../../ducks/webs';
import { getWebsOverride } from '../../ducks/websOverride';
import { getYoutubeVideos } from '../../ducks/youtubeVideos';
import { getYoutubeVideosOverride } from '../../ducks/youtubeVideosOverride';
import image from './img/image.png';
import mediaDeck from './img/media_deck.png';
import slideDeck from './img/slide_deck.png';
import web from './img/web.png';
import youtubeVideo from './img/youtube_video.png';

const IMAGES = 'IMAGES';
const MEDIA_DECKS = 'MEDIA_DECKS';
const WEBS = 'WEBS';
const YOUTUBE_VIDEOS = 'YOUTUBE_VIDEOS';
const SLIDE_DECKS = 'SLIDE_DECKS';
const icons = {
  IMAGES: image,
  MEDIA_DECKS: mediaDeck,
  SLIDE_DECKS: slideDeck,
  WEBS: web,
  YOUTUBE_VIDEOS: youtubeVideo,
};
class App extends Component {
  componentDidMount() {
    const { fetchScreen, setAppBlocking } = this.props;
    fetchBase()
    .then(fetchScreen)
    .then(() => setAppBlocking(false))
    .catch((error) => {
      if (process.env.NODE_ENV !== 'production'
        && error.name !== 'ServerException') {
        window.console.log(error);
      }
    });
  }
  render() {
    const {
      appBlocking,
      images,
      imagesOverride,
      layers,
      mediaDecks,
      mediaDecksOverride,
      screen,
      slideDecks,
      slideDecksOverride,
      webs,
      websOverride,
      youtubeVideos,
      youtubeVideosOverride,
    } = this.props;
    if (appBlocking) {
      return (
        null
      );
    }
    // NO LISTS
    if (
      screen.subscribedPlaylistIds.length === 0 &&
      screen.subscribedOverrideIds.length === 0
    ) {
      return <p>No subscribed lists</p>;
    }
    // DETERMINE WHICH
    let override = false;
    let usedImages = images;
    let usedMediaDecks = mediaDecks;
    let usedWebs = webs;
    let usedYoutubeVideos = youtubeVideos;
    let usedSlideDecks = slideDecks;
    if (
      imagesOverride.length !== 0 ||
      mediaDecksOverride.length !== 0 ||
      websOverride.length !== 0 ||
      youtubeVideosOverride.length !== 0 ||
      slideDecksOverride.length !== 0
    ) {
      override = true;
      usedImages = imagesOverride;
      usedMediaDecks = mediaDecksOverride;
      usedWebs = websOverride;
      usedYoutubeVideos = youtubeVideosOverride;
      usedSlideDecks = slideDecksOverride;
    }
    // MERGE INTO SINGLE LIST
    const mediaImages = usedImages.map(o => ({
      id: o.id,
      type: IMAGES,
      title: o.title,
      priority: o.priority,
    }));
    const mediaMediaDecks = usedMediaDecks.map(o => ({
      id: o.id,
      type: MEDIA_DECKS,
      title: o.title,
      priority: o.priority,
    }));
    const mediaWebs = usedWebs.map(o => ({
      id: o.id,
      type: WEBS,
      title: o.title,
      priority: o.priority,
    }));
    const mediaYoutubeVideos = usedYoutubeVideos.map(o => ({
      id: o.id,
      type: YOUTUBE_VIDEOS,
      title: o.title,
      priority: o.priority,
    }));
    const mediaSlideDecks = usedSlideDecks.map(o => ({
      id: o.id,
      type: SLIDE_DECKS,
      title: o.title,
      priority: o.priority,
    }));
    const media = [
      ...mediaImages,
      ...mediaMediaDecks,
      ...mediaWebs,
      ...mediaYoutubeVideos,
      ...mediaSlideDecks,
    ].sort((a, b) => {
      if (a.priority < b.priority) {
        return -1;
      }
      if (a.priority > b.priority) {
        return 1;
      }
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });
    if (media.length === 0) {
      return <p>Empty subscribed lists</p>;
    }
    return (
      <div>
        <p style={{ fontWeight: 'bold' }}>
          {override ? 'On Subscribed Overrides' : 'On Subscribed Playlists'}
        </p>
        <table className="wp-list-table widefat fixed striped pages">
          <thead>
            <tr>
              <td style={{ width: '15%' }}>
                Type
              </td>
              <td style={{ width: PRIORITY ? '65%' : '85%' }}>
                Title
              </td>
              { PRIORITY &&
                <td style={{ width: '20%' }}>
                  Priority
                </td>
              }
            </tr>
          </thead>
          <tbody >
            {
              media.map(o => (
                <tr key={o.id}>
                  <td>
                    <img alt={o.type} src={icons[o.type]} />
                  </td>
                  <td>
                    {o.title}
                  </td>
                  { PRIORITY &&
                    <td>
                      {o.priority}
                    </td>
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
        {layers.length !== 0 &&
          <div>
            <p style={{ fontWeight: 'bold' }}>Layers</p>
            <table className="wp-list-table widefat fixed striped pages">
              <thead>
                <tr>
                  <td>
                    Title
                  </td>
                </tr>
              </thead>
              <tbody >
                {
                  layers
                    .sort((a, b) => {
                      if (a.title < b.title) {
                        return -1;
                      }
                      if (a.title > b.title) {
                        return 1;
                      }
                      return 0;
                    })
                    .map(o => (
                      <tr key={o.id}>
                        <td>
                          {o.title}
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    );
  }
}
App.propTypes = {
  appBlocking: PropTypes.bool.isRequired,
  fetchScreen: PropTypes.func.isRequired,
  // eslint-disable-next-line
  images: PropTypes.array.isRequired,
  // eslint-disable-next-line
  imagesOverride: PropTypes.array.isRequired,
  // eslint-disable-next-line
  layers: PropTypes.array.isRequired,
  // eslint-disable-next-line
  mediaDecks: PropTypes.array.isRequired,
  // eslint-disable-next-line
  mediaDecksOverride: PropTypes.array.isRequired,
  // eslint-disable-next-line
  screen: PropTypes.object.isRequired,
  setAppBlocking: PropTypes.func.isRequired,
  // eslint-disable-next-line
  slideDecks: PropTypes.array.isRequired,
  // eslint-disable-next-line
  slideDecksOverride: PropTypes.array.isRequired,
  // eslint-disable-next-line
  webs: PropTypes.array.isRequired,
  // eslint-disable-next-line
  websOverride: PropTypes.array.isRequired,
  // eslint-disable-next-line
  youtubeVideos: PropTypes.array.isRequired,
  // eslint-disable-next-line
  youtubeVideosOverride: PropTypes.array.isRequired,
};
export default connect(
  state => ({
    appBlocking: fromAppBlocking.getAppBlocking(state),
    images: getImages(state),
    imagesOverride: getImagesOverride(state),
    layers: getLayers(state),
    mediaDecks: getMediaDecks(state),
    mediaDecksOverride: getMediaDecksOverride(state),
    screen: fromScreen.getScreen(state),
    slideDecks: getSlideDecks(state),
    slideDecksOverride: getSlideDecksOverride(state),
    webs: getWebs(state),
    websOverride: getWebsOverride(state),
    youtubeVideos: getYoutubeVideos(state),
    youtubeVideosOverride: getYoutubeVideosOverride(state),
  }),
  {
    setAppBlocking: fromAppBlocking.setAppBlocking,
    fetchScreen: fromScreen.fetchScreen,
  },
)(App);
