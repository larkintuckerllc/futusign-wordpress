import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { CACHE_INTERVAL, POLLING_INTERVAL, LOADING } from '../../strings';
import { fetchBase } from '../../apis/base';
import * as fromAppBlocking from '../../ducks/appBlocking';
import * as fromMonitor from '../../ducks/monitor';
import * as fromScreen from '../../ducks/screen';
import * as fromSlideDecks from '../../ducks/slideDecks';
import * as fromYoutubeVideos from '../../ducks/youtubeVideos';
import * as fromImages from '../../ducks/images';
import * as fromLayers from '../../ducks/layers';
import * as fromOfflinePlaying from '../../ducks/offlinePlaying';
import * as fromBadPlaying from '../../ducks/badPlaying';
import * as fromCurrentlyPlaying from '../../ducks/currentlyPlaying';
import * as fromCurrentlyIsPlaying from '../../ducks/currentlyIsPlaying';
import * as fromConnected from '../../ducks/connected';
import * as fromOverlay from '../../ducks/overlay';
import * as fromOvWidgets from '../../ducks/ovWidgets';
import * as fromLayerBlocking from '../../ducks/layerBlocking';
import Blocking from './Blocking';
import Offline from './Offline';
import Connected from './Connected';
import OfflineSlideDeck from './OfflineSlideDeck';
import Bad from './Bad';
import NoMedia from './NoMedia';
import Player from './Player';
import Overlay from './Overlay';
import Layers from './Layers';

class App extends Component {
  constructor() {
    super();
    this.fetch = this.fetch.bind(this);
  }
  componentDidMount() {
    const { setCurrentlyIsPlaying, setCurrentlyPlaying, setLayerBlocking } = this.props;
    const appCache = window.applicationCache;
    const check = () => {
      appCache.update();
    };
    const handleUpdateReady = () => {
      window.location.reload();
    };
    const handleMessage = (message) => {
      switch (message.data) {
        case 'block':
          setLayerBlocking(true);
          setCurrentlyPlaying(LOADING);
          setCurrentlyIsPlaying(true);
          break;
        case 'unblock':
          setLayerBlocking(false);
          break;
        default:
      }
    };
    this.fetch();
    window.setInterval(this.fetch, POLLING_INTERVAL * 1000);
    window.setInterval(check, CACHE_INTERVAL * 1000);
    appCache.addEventListener('updateready', handleUpdateReady);
    window.addEventListener('message', handleMessage);
  }
  fetch() {
    const {
      fetchImages,
      fetchLayers,
      fetchMonitor,
      fetchOverlay,
      fetchOvWidgets,
      fetchScreen,
      fetchSlideDecks,
      fetchYoutubeVideos,
      images,
      layers,
      monitor,
      offlinePlaying,
      resetOvWidgets,
      resetSlideDecks,
      resetYoutubeVideos,
      setAppBlocking,
      setBadPlaying,
      setConnected,
      setCurrentlyPlaying,
      setCurrentlyIsPlaying,
      setOfflinePlaying,
      setLayerBlocking,
      slideDecks,
      youtubeVideos,
    } = this.props;
    fetchBase()
    .then(() => {
      if (offlinePlaying) {
        window.location.reload();
      }
      return fetchScreen();
    })
    .then(screen => {
      if (screen.overlay === null) {
        resetOvWidgets();
        return Promise.all([
          Promise.resolve(null),
          Promise.resolve(screen),
        ]);
      }
      return Promise.all([
        fetchOverlay(screen.overlay),
        Promise.resolve(screen),
      ]);
    })
    .then(([overlay, screen]) => {
      if (overlay === null) {
        resetOvWidgets();
        return screen;
      }
      return fetchOvWidgets()
      .then(() => screen);
    })
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
        }, {
          response: {
            result: [],
            entities: {
              layers: {},
            },
          },
        }]);
      }
      return Promise.all([
        fetchSlideDecks(screen.subscribedPlaylistIds),
        fetchYoutubeVideos(screen.subscribedPlaylistIds),
        fetchImages(screen.subscribedPlaylistIds),
        fetchLayers(screen.subscribedPlaylistIds),
        fetchMonitor(),
        Promise.resolve(screen),
      ]);
    })
    .then(([
      slideDecksResponse,
      youtubeVideosResponse,
      imagesResponse,
      layersResponse,
      monitorResponse,
      screen,
    ]) => {
      // NEXT SLIDE DECKS
      let keys = slideDecksResponse.response.result;
      let lookup = slideDecksResponse.response.entities.slideDecks;
      let list = keys.map(o => lookup[o]);
      const nextSlideDecks = list;
      // NEXT YOUTUBE VIDEOS
      keys = youtubeVideosResponse.response.result;
      lookup = youtubeVideosResponse.response.entities.youtubeVideos;
      list = keys.map(o => lookup[o]);
      const nextYoutubeVideos = list;
      // NEXT IMAGES
      keys = imagesResponse.response.result;
      lookup = imagesResponse.response.entities.images;
      list = keys.map(o => lookup[o]);
      const nextImages = list;
      // NEXT LAYERS
      keys = layersResponse.response.result;
      lookup = layersResponse.response.entities.layers;
      list = keys.map(o => lookup[o]);
      const nextLayers = list;
      // MONITORING
      const nextMonitor = monitorResponse;
      // MONITORING - RELOAD
      if (
        monitor !== null &&
        JSON.stringify(nextMonitor) !== JSON.stringify(monitor)
      ) {
        window.location.reload();
        return null;
      }
      // MONITORING - LOGIN AND CHECK-IN
      if (monitor === null && nextMonitor !== null) {
        try {
          firebase.initializeApp(nextMonitor);
          firebase.auth().signOut()
          .then(() => {
            firebase.auth().onAuthStateChanged(user => {
              if (user) {
                const presenceRef = firebase.database().ref('presence');
                const logRef = firebase.database().ref('log');
                const connectedRef = firebase.database().ref('.info/connected');
                connectedRef.on('value', snap => {
                  if (snap.val() === true) {
                    presenceRef.push(screen.id);
                    logRef.push({
                      id: screen.id,
                      title: screen.title,
                      status: 'up',
                      timestamp: firebase.database.ServerValue.TIMESTAMP,
                    });
                    const disconnectRef = logRef.push();
                    presenceRef.onDisconnect().remove();
                    disconnectRef.onDisconnect().set({
                      id: screen.id,
                      title: screen.title,
                      status: 'down',
                      timestamp: firebase.database.ServerValue.TIMESTAMP,
                    });
                    setConnected(true);
                  } else {
                    setConnected(false);
                  }
                });
              }
            });
            firebase.auth().signInWithEmailAndPassword(
              nextMonitor.email,
              nextMonitor.password
            );
          });
        } catch (err) {
          // DO NOTHING
        }
      }
      // CONDITIONALLY CLEAR LOCAL STORAGE
      if (nextSlideDecks.length === 0) {
        window.localStorage.removeItem('futusign_slide_deck_url');
        window.localStorage.removeItem('futusign_slide_deck_file');
        window.localStorage.removeItem('futusign_slide_deck_slide_duration');
      }
      // MISC
      setOfflinePlaying(false);
      setBadPlaying(false);
      setAppBlocking(false);
      // CONDITIONALLY RESTART PLAYING LOOP
      if (
        JSON.stringify(slideDecks) !== JSON.stringify(nextSlideDecks) ||
        JSON.stringify(youtubeVideos) !== JSON.stringify(nextYoutubeVideos) ||
        JSON.stringify(images) !== JSON.stringify(nextImages) ||
        JSON.stringify(layers) !== JSON.stringify(nextLayers)
      ) {
        setLayerBlocking(false);
        setCurrentlyPlaying(LOADING);
        setCurrentlyIsPlaying(true);
      }
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
      connected,
      images,
      layers,
      layerBlocking,
      monitor,
      offlinePlaying,
      overlay,
      ovWidgets,
      setBadPlaying,
      slideDecks,
      youtubeVideos,
    } = this.props;
    const lastSlideDeckURL = window.localStorage.getItem('futusign_slide_deck_url');
    if (appBlocking) return <Blocking />;
    if (offlinePlaying && lastSlideDeckURL !== null) {
      return (
        <OfflineSlideDeck
          setBadPlaying={setBadPlaying}
        />
      );
    }
    if (offlinePlaying) return <Offline />;
    if (badPlaying) return <Bad />;
    if (
      slideDecks.length === 0 &&
      youtubeVideos.length === 0 &&
      images.length === 0
    ) return <NoMedia />;
    return (
      <div>
        <Layers layers={layers} />
        {!layerBlocking && monitor !== null && <Connected connected={connected} />}
        {!layerBlocking && overlay !== null && <Overlay overlay={overlay} ovWidgets={ovWidgets} />}
        {!layerBlocking &&
          <Player />
        }
      </div>
    );
  }
}
App.propTypes = {
  appBlocking: PropTypes.bool.isRequired,
  badPlaying: PropTypes.bool.isRequired,
  connected: PropTypes.bool.isRequired,
  images: PropTypes.array.isRequired,
  fetchImages: PropTypes.func.isRequired,
  fetchLayers: PropTypes.func.isRequired,
  fetchOverlay: PropTypes.func.isRequired,
  fetchOvWidgets: PropTypes.func.isRequired,
  fetchMonitor: PropTypes.func.isRequired,
  fetchScreen: PropTypes.func.isRequired,
  fetchSlideDecks: PropTypes.func.isRequired,
  fetchYoutubeVideos: PropTypes.func.isRequired,
  layers: PropTypes.array.isRequired,
  layerBlocking: PropTypes.bool.isRequired,
  monitor: PropTypes.object,
  offlinePlaying: PropTypes.bool.isRequired,
  overlay: PropTypes.object,
  ovWidgets: PropTypes.array.isRequired,
  resetOvWidgets: PropTypes.func.isRequired,
  resetSlideDecks: PropTypes.func.isRequired,
  resetYoutubeVideos: PropTypes.func.isRequired,
  setAppBlocking: PropTypes.func.isRequired,
  setBadPlaying: PropTypes.func.isRequired,
  setConnected: PropTypes.func.isRequired,
  setCurrentlyPlaying: PropTypes.func.isRequired,
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
  setLayerBlocking: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
  slideDecks: PropTypes.array.isRequired,
  youtubeVideos: PropTypes.array.isRequired,
};
export default connect(
  state => ({
    appBlocking: fromAppBlocking.getAppBlocking(state),
    badPlaying: fromBadPlaying.getBadPlaying(state),
    connected: fromConnected.getConnected(state),
    images: fromImages.getImages(state),
    layers: fromLayers.getLayers(state),
    layerBlocking: fromLayerBlocking.getLayerBlocking(state),
    monitor: fromMonitor.getMonitor(state),
    offlinePlaying: fromOfflinePlaying.getOfflinePlaying(state),
    overlay: fromOverlay.getOverlay(state),
    ovWidgets: fromOvWidgets.getOvWidgets(state),
    slideDecks: fromSlideDecks.getSlideDecks(state),
    youtubeVideos: fromYoutubeVideos.getYoutubeVideos(state),
  }),
  {
    fetchImages: fromImages.fetchImages,
    fetchLayers: fromLayers.fetchLayers,
    fetchMonitor: fromMonitor.fetchMonitor,
    fetchOverlay: fromOverlay.fetchOverlay,
    fetchOvWidgets: fromOvWidgets.fetchOvWidgets,
    fetchScreen: fromScreen.fetchScreen,
    fetchSlideDecks: fromSlideDecks.fetchSlideDecks,
    fetchYoutubeVideos: fromYoutubeVideos.fetchYoutubeVideos,
    resetOvWidgets: fromOvWidgets.resetOvWidgets,
    resetSlideDecks: fromSlideDecks.resetSlideDecks,
    resetYoutubeVideos: fromYoutubeVideos.resetYoutubeVideos,
    setAppBlocking: fromAppBlocking.setAppBlocking,
    setBadPlaying: fromBadPlaying.setBadPlaying,
    setConnected: fromConnected.setConnected,
    setCurrentlyIsPlaying: fromCurrentlyIsPlaying.setCurrentlyIsPlaying,
    setCurrentlyPlaying: fromCurrentlyPlaying.setCurrentlyPlaying,
    setLayerBlocking: fromLayerBlocking.setLayerBlocking,
    setOfflinePlaying: fromOfflinePlaying.setOfflinePlaying,
  }
)(App);
