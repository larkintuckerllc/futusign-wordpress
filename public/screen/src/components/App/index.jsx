import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { CACHE_INTERVAL, POLLING_INTERVAL, TRANSITION } from '../../strings';
import { minLargerPriority } from '../../util/misc';
import * as fromAppBlocking from '../../ducks/appBlocking';
import * as fromMonitor from '../../ducks/monitor';
import * as fromScreen from '../../ducks/screen';
import * as fromSlideDecks from '../../ducks/slideDecks';
import * as fromSlideDecksOverride from '../../ducks/slideDecksOverride';
import * as fromYoutubeVideos from '../../ducks/youtubeVideos';
import * as fromCover from '../../ducks/cover';
import * as fromCounter from '../../ducks/counter';
import * as fromImages from '../../ducks/images';
import * as fromImagesOverride from '../../ducks/imagesOverride';
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
import * as fromMinImagePriority from '../../ducks/minImagePriority';
import * as fromOverride from '../../ducks/override';
import * as fromMediaDecks from '../../ducks/mediaDecks';
import * as fromMediaDecksOverride from '../../ducks/mediaDecksOverride';
import Blocking from './Blocking';
import Offline from './Offline';
import Connected from './Connected';
import OfflineImage from './OfflineImage';
import Bad from './Bad';
import NoMedia from './NoMedia';
import Player from './Player';
import Overlay from './Overlay';
import Layers from './Layers';
import Cover from './Cover';

class App extends Component {
  constructor() {
    super();
    this.checkRestart = this.checkRestart.bind(this);
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
  checkRestart(response) {
    window.console.log(response);
    /*
      let nextOverride = false;
      let usedImagesResponse = imagesResponse;
      let usedMediaDecksResponse = mediaDecksResponse;
      let usedSlideDecksResponse = slideDecksResponse;
      let usedWebsResponse = websResponse;
      let usedYoutubeVideosResponse = youtubeVideosResponse;
      if (
        imagesOverrideResponse.response.result.length !== 0 ||
        mediaDecksOverrideResponse.response.result.length !== 0 ||
        slideDecksOverrideResponse.response.result.length !== 0
      ) {
        nextOverride = true;
        setOverride(true);
        usedImagesResponse = imagesOverrideResponse;
        usedMediaDecksResponse = mediaDecksOverrideResponse;
        usedSlideDecksResponse = slideDecksOverrideResponse;
        usedWebsResponse = {
          response: {
            result: [],
            entities: {
              webs: {},
            },
          },
        };
        usedYoutubeVideosResponse = {
          response: {
            result: [],
            entities: {
              youtubeVideos: {},
            },
          },
        };
      } else {
        setOverride(false);
      }
      // NEXT IMAGES
      let keys = usedImagesResponse.response.result;
      let lookup = usedImagesResponse.response.entities.images;
      let list = keys.map(o => lookup[o]);
      const nextImages = list;
      // NEXT MEDIA DECKS
      keys = usedMediaDecksResponse.response.result;
      lookup = usedMediaDecksResponse.response.entities.mediaDecks;
      list = keys.map(o => lookup[o]);
      const nextMediaDecks = list;
      // NEXT WEBS
      keys = usedWebsResponse.response.result;
      lookup = usedWebsResponse.response.entities.webs;
      list = keys.map(o => lookup[o]);
      const nextWebs = list;
      // NEXT YOUTUBE VIDEOS
      keys = usedYoutubeVideosResponse.response.result;
      lookup = usedYoutubeVideosResponse.response.entities.youtubeVideos;
      list = keys.map(o => lookup[o]);
      const nextYoutubeVideos = list;
      // NEXT LAYERS
      keys = layersResponse.response.result;
      lookup = layersResponse.response.entities.layers;
      list = keys.map(o => lookup[o]);
      const nextLayers = list;
      // NEXT SLIDE DECKS
      keys = usedSlideDecksResponse.response.result;
      lookup = usedSlideDecksResponse.response.entities.slideDecks;
      list = keys.map(o => lookup[o]);
      const nextSlideDecks = list;
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
      if (nextImages.length === 0) {
        window.localStorage.removeItem('futusign_image_url');
        window.localStorage.removeItem('futusign_image_file');
      }
      // MISC
      setOfflinePlaying(false);
      setBadPlaying(false);
      setAppBlocking(false);
      // CONDITIONALLY RESTART PLAYING LOOP
      let usedImages = images;
      let usedMediaDecks = mediaDecks;
      let usedWebs = webs;
      let usedYoutubeVideos = youtubeVideos;
      let usedSlideDecks = slideDecks;
      if (nextOverride) {
        usedImages = imagesOverride;
        usedMediaDecks = mediaDecksOverride;
        usedWebs = [];
        usedYoutubeVideos = [];
        usedSlideDecks = slideDecksOverride;
      }
      if (
        badPlaying ||
        offlinePlaying ||
        override !== nextOverride ||
        JSON.stringify(usedImages) !== JSON.stringify(nextImages) ||
        JSON.stringify(usedMediaDecks) !== JSON.stringify(nextMediaDecks) ||
        JSON.stringify(usedWebs) !== JSON.stringify(nextWebs) ||
        JSON.stringify(usedYoutubeVideos) !== JSON.stringify(nextYoutubeVideos) ||
        JSON.stringify(layers) !== JSON.stringify(nextLayers) ||
        JSON.stringify(usedSlideDecks) !== JSON.stringify(nextSlideDecks)
      ) {
        this.restartPlayingLoop();
      }
      */
  }
  fetch() {
    const {
      fetchScreen,
      offlinePlaying,
      setAppBlocking,
      setBadPlaying,
      setOfflinePlaying,
    } = this.props;
    fetchScreen()
    .then(response => {
      if (offlinePlaying) {
        window.location.reload();
        return;
      }
      this.checkRestart(response);
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
      imagesOverride,
      override,
      mediaDecks,
      mediaDecksOverride,
      resetCurrentlyPlaying,
      resetNextPlaying,
      setCounter,
      setCurrentlyIsPlaying,
      setCurrentlyPlaying,
      setLayerBlocking,
      setMinImagePriority,
      setNextIsReady,
      setPriority,
      slideDecks,
      slideDecksOverride,
      webs,
      youtubeVideos,
    } = this.props;
    let usedSlideDecks = slideDecks;
    let usedImages = images;
    let usedMediaDecks = mediaDecks;
    let usedWebs = webs;
    let usedYoutubeVideos = youtubeVideos;
    if (override) {
      usedSlideDecks = slideDecksOverride;
      usedMediaDecks = mediaDecksOverride;
      usedImages = imagesOverride;
      usedWebs = [];
      usedYoutubeVideos = [];
    }
    setNextIsReady(false);
    setCurrentlyIsPlaying(false);
    resetCurrentlyPlaying();
    resetNextPlaying();
    setLayerBlocking(false);
    setMinImagePriority(minLargerPriority(0, usedImages));
    setPriority(minLargerPriority(0, [
      ...usedImages,
      ...usedMediaDecks,
      ...usedWebs,
      ...usedYoutubeVideos,
      ...usedSlideDecks,
    ]));
    setCounter(0);
    setCurrentlyPlaying(TRANSITION);
    setCurrentlyIsPlaying(true);
  }
  render() {
    const {
      appBlocking,
      badPlaying,
      connected,
      cover,
      images,
      imagesOverride,
      mediaDecks,
      mediaDecksOverride,
      layers,
      layerBlocking,
      monitor,
      offlinePlaying,
      overlay,
      override,
      ovWidgets,
      slideDecks,
      slideDecksOverride,
      webs,
      youtubeVideos,
    } = this.props;
    const lastImageURL = window.localStorage.getItem('futusign_image_url');
    let usedImages = images;
    let usedMediaDecks = mediaDecks;
    let usedWebs = webs;
    let usedYoutubeVideos = youtubeVideos;
    let usedSlideDecks = slideDecks;
    if (override) {
      usedImages = imagesOverride;
      usedMediaDecks = mediaDecksOverride;
      usedWebs = [];
      usedYoutubeVideos = [];
      usedSlideDecks = slideDecksOverride;
    }
    if (appBlocking) return <Blocking />;
    if (offlinePlaying && lastImageURL !== null) return <OfflineImage />;
    if (offlinePlaying) return <Offline />;
    if (badPlaying) return <Bad />;
    const noMedia = (
      usedImages.length === 0 &&
      usedMediaDecks.length === 0 &&
      usedWebs.length === 0 &&
      usedYoutubeVideos.length === 0 &&
      usedSlideDecks.length === 0
    );
    return (
      <div>
        <Layers layers={layers} />
        {!layerBlocking && cover && <Cover />}
        {!layerBlocking && monitor !== null && <Connected connected={connected} />}
        {!layerBlocking && overlay !== null && <Overlay overlay={overlay} ovWidgets={ovWidgets} />}
        {!layerBlocking && noMedia && !override && <NoMedia />}
        {!layerBlocking && !noMedia &&
          <Player
            images={usedImages}
            mediaDecks={usedMediaDecks}
            slideDecks={usedSlideDecks}
            webs={usedWebs}
            youtubeVideos={usedYoutubeVideos}
          />
        }
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
  imagesOverride: PropTypes.array.isRequired,
  // fetchImages: PropTypes.func.isRequired,
  // fetchImagesOverride: PropTypes.func.isRequired,
  // fetchLayers: PropTypes.func.isRequired,
  // fetchMediaDecks: PropTypes.func.isRequired,
  // fetchMediaDecksOverride: PropTypes.func.isRequired,
  fetchOverlay: PropTypes.func.isRequired,
  fetchOvWidgets: PropTypes.func.isRequired,
  fetchMonitor: PropTypes.func.isRequired,
  fetchScreen: PropTypes.func.isRequired,
  // fetchSlideDecks: PropTypes.func.isRequired,
  // fetchSlideDecksOverride: PropTypes.func.isRequired,
  // fetchWebs: PropTypes.func.isRequired,
  // fetchYoutubeVideos: PropTypes.func.isRequired,
  layers: PropTypes.array.isRequired,
  layerBlocking: PropTypes.bool.isRequired,
  mediaDecks: PropTypes.array.isRequired,
  mediaDecksOverride: PropTypes.array.isRequired,
  monitor: PropTypes.object,
  offlinePlaying: PropTypes.bool.isRequired,
  overlay: PropTypes.object,
  override: PropTypes.bool.isRequired,
  ovWidgets: PropTypes.array.isRequired,
  resetCurrentlyPlaying: PropTypes.func.isRequired,
  // resetImages: PropTypes.func.isRequired,
  // resetImagesOverride: PropTypes.func.isRequired,
  // resetMediaDecks: PropTypes.func.isRequired,
  // resetMediaDecksOverride: PropTypes.func.isRequired,
  resetNextPlaying: PropTypes.func.isRequired,
  resetOvWidgets: PropTypes.func.isRequired,
  // resetSlideDecks: PropTypes.func.isRequired,
  // resetSlideDecksOverride: PropTypes.func.isRequired,
  // resetWebs: PropTypes.func.isRequired,
  // resetYoutubeVideos: PropTypes.func.isRequired,
  setAppBlocking: PropTypes.func.isRequired,
  setBadPlaying: PropTypes.func.isRequired,
  setConnected: PropTypes.func.isRequired,
  setCover: PropTypes.func.isRequired,
  setCounter: PropTypes.func.isRequired,
  setCurrentlyPlaying: PropTypes.func.isRequired,
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
  setLayerBlocking: PropTypes.func.isRequired,
  setMinImagePriority: PropTypes.func.isRequired,
  setNextIsReady: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
  setOverride: PropTypes.func.isRequired,
  setPriority: PropTypes.func.isRequired,
  slideDecks: PropTypes.array.isRequired,
  slideDecksOverride: PropTypes.array.isRequired,
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
    imagesOverride: fromImagesOverride.getImagesOverride(state),
    layers: fromLayers.getLayers(state),
    layerBlocking: fromLayerBlocking.getLayerBlocking(state),
    mediaDecks: fromMediaDecks.getMediaDecks(state),
    mediaDecksOverride: fromMediaDecksOverride.getMediaDecksOverride(state),
    monitor: fromMonitor.getMonitor(state),
    offlinePlaying: fromOfflinePlaying.getOfflinePlaying(state),
    overlay: fromOverlay.getOverlay(state),
    override: fromOverride.getOverride(state),
    ovWidgets: fromOvWidgets.getOvWidgets(state),
    slideDecks: fromSlideDecks.getSlideDecks(state),
    slideDecksOverride: fromSlideDecksOverride.getSlideDecksOverride(state),
    webs: fromWebs.getWebs(state),
    youtubeVideos: fromYoutubeVideos.getYoutubeVideos(state),
  }),
  {
    // fetchImages: fromImages.fetchImages,
    // fetchImagesOverride: fromImagesOverride.fetchImagesOverride,
    // fetchLayers: fromLayers.fetchLayers,
    // fetchMediaDecks: fromMediaDecks.fetchMediaDecks,
    // fetchMediaDecksOverride: fromMediaDecksOverride.fetchMediaDecksOverride,
    fetchMonitor: fromMonitor.fetchMonitor,
    fetchOverlay: fromOverlay.fetchOverlay,
    fetchOvWidgets: fromOvWidgets.fetchOvWidgets,
    fetchScreen: fromScreen.fetchScreen,
    // fetchSlideDecks: fromSlideDecks.fetchSlideDecks,
    // fetchSlideDecksOverride: fromSlideDecksOverride.fetchSlideDecksOverride,
    // fetchWebs: fromWebs.fetchWebs,
    // fetchYoutubeVideos: fromYoutubeVideos.fetchYoutubeVideos,
    resetCurrentlyPlaying: fromCurrentlyPlaying.resetCurrentlyPlaying,
    // resetImages: fromImages.resetImages,
    // resetImagesOverride: fromImagesOverride.resetImagesOverride,
    // resetMediaDecks: fromMediaDecks.resetMediaDecks,
    // resetMediaDecksOverride: fromMediaDecksOverride.resetMediaDecksOverride,
    resetNextPlaying: fromNextPlaying.resetNextPlaying,
    resetOvWidgets: fromOvWidgets.resetOvWidgets,
    // resetSlideDecks: fromSlideDecks.resetSlideDecks,
    // resetSlideDecksOverride: fromSlideDecksOverride.resetSlideDecksOverride,
    // resetWebs: fromWebs.resetWebs,
    // resetYoutubeVideos: fromYoutubeVideos.resetYoutubeVideos,
    setAppBlocking: fromAppBlocking.setAppBlocking,
    setBadPlaying: fromBadPlaying.setBadPlaying,
    setCover: fromCover.setCover,
    setCounter: fromCounter.setCounter,
    setConnected: fromConnected.setConnected,
    setCurrentlyIsPlaying: fromCurrentlyIsPlaying.setCurrentlyIsPlaying,
    setCurrentlyPlaying: fromCurrentlyPlaying.setCurrentlyPlaying,
    setLayerBlocking: fromLayerBlocking.setLayerBlocking,
    setMinImagePriority: fromMinImagePriority.setMinImagePriority,
    setNextIsReady: fromNextIsReady.setNextIsReady,
    setOfflinePlaying: fromOfflinePlaying.setOfflinePlaying,
    setOverride: fromOverride.setOverride,
    setPriority: fromPriority.setPriority,
  }
)(App);
