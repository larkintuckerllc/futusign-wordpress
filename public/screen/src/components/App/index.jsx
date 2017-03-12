import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { POLLING_INTERVAL } from '../../strings';
import { fetchBase } from '../../apis/base';
import * as fromAppBlocking from '../../ducks/appBlocking';
import * as fromScreen from '../../ducks/screen';
import * as fromSlideDecks from '../../ducks/slideDecks';
import * as fromYoutubeVideos from '../../ducks/youtubeVideos';
import * as fromImages from '../../ducks/images';
import * as fromOfflinePlaying from '../../ducks/offlinePlaying';
import * as fromBadPlaying from '../../ducks/badPlaying';
import * as fromCurrentlyPlaying from '../../ducks/currentlyPlaying';
import Blocking from './Blocking';
import Offline from './Offline';
import Bad from './Bad';
import NoMedia from './NoMedia';
import Player from './Player';

class App extends Component {
  constructor() {
    super();
    this.fetch = this.fetch.bind(this);
  }
  componentDidMount() {
    this.fetch();
    window.setInterval(this.fetch, POLLING_INTERVAL * 1000);
  }
  fetch() {
    const {
      fetchImages,
      fetchScreen,
      fetchSlideDecks,
      fetchYoutubeVideos,
      images,
      offlinePlaying,
      resetSlideDecks,
      resetYoutubeVideos,
      setAppBlocking,
      setBadPlaying,
      setCurrentlyPlaying,
      setOfflinePlaying,
      slideDecks,
      youtubeVideos,
    } = this.props;
    if (offlinePlaying) {
      window.location.reload();
    }
    fetchBase()
    .then(() => (
      fetchScreen()
    ))
    .then(screen => {
      if (screen.subscribedPlaylistIds.length === 0) {
        resetSlideDecks();
        resetYoutubeVideos();
        return Promise.resolve([{
          response: {
            result: [],
            entities: {
              slideDecks: {},
            },
          },
        }, {
          response: {
            result: [],
            entities: {
              youtubeVideos: {},
            },
          },
        }, {
          response: {
            result: [],
            entities: {
              images: {},
            },
          },
        }]);
      }
      return Promise.all([
        fetchSlideDecks(screen.subscribedPlaylistIds),
        fetchYoutubeVideos(screen.subscribedPlaylistIds),
        fetchImages(screen.subscribedPlaylistIds),
      ]);
    })
    .then(([
      slideDecksResponse,
      youtubeVideosResponse,
      imagesResponse,
    ]) => {
      let keys = slideDecksResponse.response.result;
      let lookup = slideDecksResponse.response.entities.slideDecks;
      let list = keys.map(o => lookup[o]);
      const nextSlideDecks = list;
      keys = youtubeVideosResponse.response.result;
      lookup = youtubeVideosResponse.response.entities.youtubeVideos;
      list = keys.map(o => lookup[o]);
      const nextYoutubeVideos = list;
      keys = imagesResponse.response.result;
      lookup = imagesResponse.response.entities.images;
      list = keys.map(o => lookup[o]);
      const nextImages = list;
      if (nextSlideDecks.length === 0) {
        window.localStorage.removeItem('futusign_slide_deck_url');
        window.localStorage.removeItem('futusign_slide_deck_file');
      }
      if (nextImages.length === 0) {
        window.localStorage.removeItem('futusign_image_url');
        window.localStorage.removeItem('futusign_image_file');
      }
      if (
        JSON.stringify(slideDecks) !== JSON.stringify(nextSlideDecks) ||
        JSON.stringify(youtubeVideos) !== JSON.stringify(nextYoutubeVideos) ||
        JSON.stringify(images) !== JSON.stringify(nextImages)
      ) {
        setCurrentlyPlaying(fromCurrentlyPlaying.LOADING);
      }
      setOfflinePlaying(false);
      setBadPlaying(false);
      setAppBlocking(false);
      return null;
    })
    .catch(error => {
      setOfflinePlaying(true);
      setBadPlaying(false);
      setAppBlocking(false);
      if (process.env.NODE_ENV !== 'production'
        && error.name !== 'ServerException') {
        window.console.log(error);
        return;
      }
    });
  }
  render() {
    const {
      appBlocking,
      badPlaying,
      currentlyPlaying,
      images,
      offlinePlaying,
      setBadPlaying,
      setCurrentlyPlaying,
      setOfflinePlaying,
      slideDecks,
      youtubeVideos,
    } = this.props;
    if (appBlocking) return <Blocking />;
    if (offlinePlaying) return <Offline />;
    if (badPlaying) return <Bad />;
    if (
      slideDecks.length === 0 &&
      youtubeVideos.length === 0 &&
      images.length === 0
    ) return <NoMedia />;
    return (
      <Player
        currentlyPlaying={currentlyPlaying}
        images={images}
        setBadPlaying={setBadPlaying}
        setCurrentlyPlaying={setCurrentlyPlaying}
        setOfflinePlaying={setOfflinePlaying}
        slideDecks={slideDecks}
        youtubeVideos={youtubeVideos}
      />
    );
  }
}
App.propTypes = {
  appBlocking: PropTypes.bool.isRequired,
  badPlaying: PropTypes.bool.isRequired,
  currentlyPlaying: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
  fetchImages: PropTypes.func.isRequired,
  fetchScreen: PropTypes.func.isRequired,
  fetchSlideDecks: PropTypes.func.isRequired,
  fetchYoutubeVideos: PropTypes.func.isRequired,
  offlinePlaying: PropTypes.bool.isRequired,
  resetSlideDecks: PropTypes.func.isRequired,
  resetYoutubeVideos: PropTypes.func.isRequired,
  setAppBlocking: PropTypes.func.isRequired,
  setBadPlaying: PropTypes.func.isRequired,
  setCurrentlyPlaying: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
  slideDecks: PropTypes.array.isRequired,
  youtubeVideos: PropTypes.array.isRequired,
};
export default connect(
  state => ({
    appBlocking: fromAppBlocking.getAppBlocking(state),
    badPlaying: fromBadPlaying.getBadPlaying(state),
    currentlyPlaying: fromCurrentlyPlaying.getCurrentlyPlaying(state),
    images: fromImages.getImages(state),
    offlinePlaying: fromOfflinePlaying.getOfflinePlaying(state),
    slideDecks: fromSlideDecks.getSlideDecks(state),
    youtubeVideos: fromYoutubeVideos.getYoutubeVideos(state),
  }),
  {
    fetchImages: fromImages.fetchImages,
    fetchScreen: fromScreen.fetchScreen,
    fetchSlideDecks: fromSlideDecks.fetchSlideDecks,
    fetchYoutubeVideos: fromYoutubeVideos.fetchYoutubeVideos,
    resetSlideDecks: fromSlideDecks.resetSlideDecks,
    resetYoutubeVideos: fromYoutubeVideos.resetYoutubeVideos,
    setAppBlocking: fromAppBlocking.setAppBlocking,
    setBadPlaying: fromBadPlaying.setBadPlaying,
    setCurrentlyPlaying: fromCurrentlyPlaying.setCurrentlyPlaying,
    setOfflinePlaying: fromOfflinePlaying.setOfflinePlaying,
  }
)(App);
