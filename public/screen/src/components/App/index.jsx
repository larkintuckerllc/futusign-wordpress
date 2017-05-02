import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { CACHE_INTERVAL, POLLING_INTERVAL, TRANSITION } from '../../strings';
import { fetchBase } from '../../apis/base';
import { minLargerPriority } from '../../util/misc';
import * as fromAppBlocking from '../../ducks/appBlocking';
import * as fromMonitor from '../../ducks/monitor';
import * as fromScreen from '../../ducks/screen';
import * as fromSlideDecks from '../../ducks/slideDecks';
import * as fromYoutubeVideos from '../../ducks/youtubeVideos';
import * as fromCover from '../../ducks/cover';
import * as fromImages from '../../ducks/images';
import * as fromLayers from '../../ducks/layers';
import * as fromWebs from '../../ducks/webs';
import * as fromOfflinePlaying from '../../ducks/offlinePlaying';
import * as fromBadPlaying from '../../ducks/badPlaying';
import * as fromCurrentlyPlaying from '../../ducks/currentlyPlaying';
import * as fromCurrentlyIsPlaying from '../../ducks/currentlyIsPlaying';
import * as fromNextPlaying from '../../ducks/nextPlaying';
import * as fromNextIsReady from '../../ducks/nextIsReady';
import * as fromConnected from '../../ducks/connected';
import * as fromOverlay from '../../ducks/overlay';
import * as fromOvWidgets from '../../ducks/ovWidgets';
import * as fromLayerBlocking from '../../ducks/layerBlocking';
import * as fromPriority from '../../ducks/priority';
import * as fromMinSlideDeckPriority from '../../ducks/minSlideDeckPriority';
import Blocking from './Blocking';
import Offline from './Offline';
import Connected from './Connected';
import OfflineSlideDeck from './OfflineSlideDeck';
import Bad from './Bad';
import NoMedia from './NoMedia';
import Player from './Player';
import Overlay from './Overlay';
import Layers from './Layers';
import Cover from './Cover';

class App extends Component {
  constructor() {
    super();
    this.fetch = this.fetch.bind(this);
    this.restartPlayingLoop = this.restartPlayingLoop.bind(this);
  }
  componentDidMount() {
    const { setLayerBlocking } = this.props;
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
          break;
        case 'unblock':
          this.restartPlayingLoop();
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
      badPlaying,
      fetchImages,
      fetchLayers,
      fetchMonitor,
      fetchOverlay,
      fetchOvWidgets,
      fetchScreen,
      fetchSlideDecks,
      fetchWebs,
      fetchYoutubeVideos,
      images,
      layers,
      monitor,
      offlinePlaying,
      resetImages,
      resetOvWidgets,
      resetSlideDecks,
      resetWebs,
      resetYoutubeVideos,
      setAppBlocking,
      setBadPlaying,
      setConnected,
      setOfflinePlaying,
      slideDecks,
      webs,
      youtubeVideos,
    } = this.props;
    fetchBase()
    .then(() => {
      // DETECT COMING BACK ONLINE
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
        resetImages();
        resetWebs();
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
              images: {},
            },
          },
        }, {
          response: {
            result: [],
            entities: {
              webs: {},
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
              layers: {},
            },
          },
        }]);
      }
      return Promise.all([
        fetchSlideDecks(screen.subscribedPlaylistIds),
        fetchImages(screen.subscribedPlaylistIds),
        fetchWebs(screen.subscribedPlaylistIds),
        fetchYoutubeVideos(screen.subscribedPlaylistIds),
        fetchLayers(screen.subscribedPlaylistIds),
        fetchMonitor(),
        Promise.resolve(screen),
      ]);
    })
    .then(([
      slideDecksResponse,
      imagesResponse,
      websResponse,
      youtubeVideosResponse,
      layersResponse,
      monitorResponse,
      screen,
    ]) => {
      // NEXT SLIDE DECKS
      let keys = slideDecksResponse.response.result;
      let lookup = slideDecksResponse.response.entities.slideDecks;
      let list = keys.map(o => lookup[o]);
      const nextSlideDecks = list;
      // NEXT IMAGES
      keys = imagesResponse.response.result;
      lookup = imagesResponse.response.entities.images;
      list = keys.map(o => lookup[o]);
      const nextImages = list;
      // NEXT WEBS
      keys = websResponse.response.result;
      lookup = websResponse.response.entities.webs;
      list = keys.map(o => lookup[o]);
      const nextWebs = list;
      // NEXT YOUTUBE VIDEOS
      keys = youtubeVideosResponse.response.result;
      lookup = youtubeVideosResponse.response.entities.youtubeVideos;
      list = keys.map(o => lookup[o]);
      const nextYoutubeVideos = list;
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
        badPlaying ||
        offlinePlaying ||
        JSON.stringify(slideDecks) !== JSON.stringify(nextSlideDecks) ||
        JSON.stringify(images) !== JSON.stringify(nextImages) ||
        JSON.stringify(webs) !== JSON.stringify(nextWebs) ||
        JSON.stringify(youtubeVideos) !== JSON.stringify(nextYoutubeVideos) ||
        JSON.stringify(layers) !== JSON.stringify(nextLayers)
      ) {
        this.restartPlayingLoop();
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
  restartPlayingLoop() {
    const {
      images,
      resetCurrentlyPlaying,
      resetNextPlaying,
      setCurrentlyIsPlaying,
      setCurrentlyPlaying,
      setLayerBlocking,
      setMinSlideDeckPriority,
      setNextIsReady,
      setPriority,
      slideDecks,
      webs,
      youtubeVideos,
    } = this.props;
    setNextIsReady(false);
    setCurrentlyIsPlaying(false);
    resetCurrentlyPlaying();
    resetNextPlaying();
    setLayerBlocking(false);
    setCurrentlyPlaying(TRANSITION);
    setCurrentlyIsPlaying(true);
    setMinSlideDeckPriority(minLargerPriority(0, slideDecks));
    setPriority(minLargerPriority(0, [
      ...slideDecks,
      ...images,
      ...webs,
      ...youtubeVideos,
    ]));
  }
  render() {
    const {
      appBlocking,
      badPlaying,
      connected,
      cover,
      images,
      layers,
      layerBlocking,
      monitor,
      offlinePlaying,
      overlay,
      ovWidgets,
      setBadPlaying,
      slideDecks,
      webs,
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
      images.length === 0 &&
      webs.length === 0 &&
      youtubeVideos.length === 0
    ) return <NoMedia />;
    return (
      <div>
        <Layers layers={layers} />
        {!layerBlocking && cover && <Cover />}
        {!layerBlocking && monitor !== null && <Connected connected={connected} />}
        {!layerBlocking && overlay !== null && <Overlay overlay={overlay} ovWidgets={ovWidgets} />}
        {!layerBlocking && <Player />}
      </div>
    );
  }
}
App.propTypes = {
  appBlocking: PropTypes.bool.isRequired,
  badPlaying: PropTypes.bool.isRequired,
  connected: PropTypes.bool.isRequired,
  cover: PropTypes.bool.isRequired,
  images: PropTypes.array.isRequired,
  fetchImages: PropTypes.func.isRequired,
  fetchLayers: PropTypes.func.isRequired,
  fetchOverlay: PropTypes.func.isRequired,
  fetchOvWidgets: PropTypes.func.isRequired,
  fetchMonitor: PropTypes.func.isRequired,
  fetchScreen: PropTypes.func.isRequired,
  fetchSlideDecks: PropTypes.func.isRequired,
  fetchWebs: PropTypes.func.isRequired,
  fetchYoutubeVideos: PropTypes.func.isRequired,
  layers: PropTypes.array.isRequired,
  layerBlocking: PropTypes.bool.isRequired,
  monitor: PropTypes.object,
  offlinePlaying: PropTypes.bool.isRequired,
  overlay: PropTypes.object,
  ovWidgets: PropTypes.array.isRequired,
  resetCurrentlyPlaying: PropTypes.func.isRequired,
  resetImages: PropTypes.func.isRequired,
  resetNextPlaying: PropTypes.func.isRequired,
  resetOvWidgets: PropTypes.func.isRequired,
  resetSlideDecks: PropTypes.func.isRequired,
  resetWebs: PropTypes.func.isRequired,
  resetYoutubeVideos: PropTypes.func.isRequired,
  setAppBlocking: PropTypes.func.isRequired,
  setBadPlaying: PropTypes.func.isRequired,
  setConnected: PropTypes.func.isRequired,
  setCover: PropTypes.func.isRequired,
  setCurrentlyPlaying: PropTypes.func.isRequired,
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
  setLayerBlocking: PropTypes.func.isRequired,
  setMinSlideDeckPriority: PropTypes.func.isRequired,
  setNextIsReady: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
  setPriority: PropTypes.func.isRequired,
  slideDecks: PropTypes.array.isRequired,
  webs: PropTypes.array.isRequired,
  youtubeVideos: PropTypes.array.isRequired,
};
export default connect(
  state => ({
    appBlocking: fromAppBlocking.getAppBlocking(state),
    badPlaying: fromBadPlaying.getBadPlaying(state),
    connected: fromConnected.getConnected(state),
    cover: fromCover.getCover(state),
    images: fromImages.getImages(state),
    layers: fromLayers.getLayers(state),
    layerBlocking: fromLayerBlocking.getLayerBlocking(state),
    monitor: fromMonitor.getMonitor(state),
    offlinePlaying: fromOfflinePlaying.getOfflinePlaying(state),
    overlay: fromOverlay.getOverlay(state),
    ovWidgets: fromOvWidgets.getOvWidgets(state),
    slideDecks: fromSlideDecks.getSlideDecks(state),
    webs: fromWebs.getWebs(state),
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
    fetchWebs: fromWebs.fetchWebs,
    fetchYoutubeVideos: fromYoutubeVideos.fetchYoutubeVideos,
    resetCurrentlyPlaying: fromCurrentlyPlaying.resetCurrentlyPlaying,
    resetImages: fromImages.resetImages,
    resetNextPlaying: fromNextPlaying.resetNextPlaying,
    resetOvWidgets: fromOvWidgets.resetOvWidgets,
    resetSlideDecks: fromSlideDecks.resetSlideDecks,
    resetWebs: fromWebs.resetWebs,
    resetYoutubeVideos: fromYoutubeVideos.resetYoutubeVideos,
    setAppBlocking: fromAppBlocking.setAppBlocking,
    setBadPlaying: fromBadPlaying.setBadPlaying,
    setCover: fromCover.setCover,
    setConnected: fromConnected.setConnected,
    setCurrentlyIsPlaying: fromCurrentlyIsPlaying.setCurrentlyIsPlaying,
    setCurrentlyPlaying: fromCurrentlyPlaying.setCurrentlyPlaying,
    setLayerBlocking: fromLayerBlocking.setLayerBlocking,
    setMinSlideDeckPriority: fromMinSlideDeckPriority.setMinSlideDeckPriority,
    setNextIsReady: fromNextIsReady.setNextIsReady,
    setOfflinePlaying: fromOfflinePlaying.setOfflinePlaying,
    setPriority: fromPriority.setPriority,
  }
)(App);
