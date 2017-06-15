import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import {
  CACHE_INTERVAL,
  ERROR_POLLING_INTERVAL,
  MSG_BLOCK,
  MSG_TIME,
  MSG_UNBLOCK,
  TRANSITION,
} from '../../strings';
import { minLargerPriority } from '../../util/misc';
import { fetchBase } from '../../apis/base';
import * as fromAppBlocking from '../../ducks/appBlocking';
import * as fromMonitor from '../../ducks/monitor';
import * as fromScreen from '../../ducks/screen';
import * as fromSlideDecks from '../../ducks/slideDecks';
import * as fromSlideDecksOverride from '../../ducks/slideDecksOverride';
import * as fromYoutubeVideos from '../../ducks/youtubeVideos';
import * as fromYoutubeVideosOverride from '../../ducks/youtubeVideosOverride';
import * as fromCover from '../../ducks/cover';
import * as fromCounter from '../../ducks/counter';
import * as fromImages from '../../ducks/images';
import * as fromImagesOverride from '../../ducks/imagesOverride';
import * as fromLayers from '../../ducks/layers';
import * as fromWebs from '../../ducks/webs';
import * as fromWebsOverride from '../../ducks/websOverride';
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
import * as fromTime from '../../ducks/time';
import * as fromVersion from '../../ducks/version';
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
    this.fetch = this.fetch.bind(this);
    this.restartPlayingLoop = this.restartPlayingLoop.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }
  componentDidMount() {
    const appCache = window.applicationCache;
    const check = () => {
      appCache.update();
    };
    const handleUpdateReady = () => {
      window.location.reload();
    };
    this.fetch();
    window.setInterval(check, CACHE_INTERVAL * 1000);
    appCache.addEventListener('updateready', handleUpdateReady);
    window.addEventListener('message', this.handleMessage);
  }
  handleMessage(message) {
    const { setLayerBlocking, time } = this.props;
    switch (message.data.type) {
      case MSG_BLOCK:
        setLayerBlocking(true);
        break;
      case MSG_UNBLOCK:
        this.restartPlayingLoop();
        break;
      case MSG_TIME:
        message.source.postMessage({
          type: MSG_TIME,
          value: time,
        }, message.origin);
        break;
      default:
    }
  }
  fetch() {
    const {
      badPlaying,
      fetchScreen,
      images,
      imagesOverride,
      offlinePlaying,
      override,
      layers,
      monitor,
      mediaDecks,
      mediaDecksOverride,
      webs,
      websOverride,
      youtubeVideos,
      youtubeVideosOverride,
      setConnected,
      slideDecks,
      slideDecksOverride,
      setAppBlocking,
      setBadPlaying,
      setOverride,
      setOfflinePlaying,
      setTime,
      version,
      setVersion,
    } = this.props;
    fetchBase()
    .then(() => {
      // DETECT COMING BACK ONLINE
      if (offlinePlaying) {
        window.location.reload();
      }
      return fetchScreen();
    })
    .then(response => {
      const screen = response.screen;
      if (version !== null && version !== response.version) {
        window.location.reload();
      }
      let nextOverride = false;
      let nextImages = response.images;
      let nextMediaDecks = response.mediaDecks;
      let nextSlideDecks = response.slideDecks;
      let nextWebs = response.webs;
      let nextYoutubeVideos = response.youtubeVideos;
      const nextLayers = response.layers;
      const nextMonitor = response.monitor;
      if (
        response.imagesOverride.length !== 0 ||
        response.mediaDecksOverride.length !== 0 ||
        response.slideDecksOverride.length !== 0 ||
        response.websOverride.length !== 0 ||
        response.youtubeVideosOverride.length !== 0
      ) {
        nextOverride = true;
        setOverride(true);
        nextImages = response.imagesOverride;
        nextMediaDecks = response.mediaDecksOverride;
        nextSlideDecks = response.slideDecksOverride;
        nextWebs = response.websOverride;
        nextYoutubeVideos = response.youtubeVideosOverride;
      } else {
        setOverride(false);
      }
      // MONITORING - RELOAD
      if (
        monitor !== null &&
        JSON.stringify(nextMonitor) !== JSON.stringify(monitor)
      ) {
        window.location.reload();
        return;
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
      // SET DRIFT TIME
      const serverTime = response.time * 1000;
      const localTime = Date.now();
      setTime(localTime - serverTime);
      // MISC
      setVersion(response.version);
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
        usedWebs = websOverride;
        usedYoutubeVideos = youtubeVideosOverride;
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
      window.setTimeout(this.fetch, screen.polling * 60 * 1000);
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
      window.setTimeout(this.fetch, ERROR_POLLING_INTERVAL * 1000);
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
      websOverride,
      youtubeVideos,
      youtubeVideosOverride,
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
      usedWebs = websOverride;
      usedYoutubeVideos = youtubeVideosOverride;
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
      websOverride,
      youtubeVideos,
      youtubeVideosOverride,
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
      usedWebs = websOverride;
      usedYoutubeVideos = youtubeVideosOverride;
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
  fetchScreen: PropTypes.func.isRequired,
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
  resetNextPlaying: PropTypes.func.isRequired,
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
  setTime: PropTypes.func.isRequired,
  setVersion: PropTypes.func.isRequired,
  slideDecks: PropTypes.array.isRequired,
  slideDecksOverride: PropTypes.array.isRequired,
  time: PropTypes.number.isRequired,
  version: PropTypes.string,
  webs: PropTypes.array.isRequired,
  websOverride: PropTypes.array.isRequired,
  youtubeVideos: PropTypes.array.isRequired,
  youtubeVideosOverride: PropTypes.array.isRequired,
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
    time: fromTime.getTime(state),
    version: fromVersion.getVersion(state),
    webs: fromWebs.getWebs(state),
    websOverride: fromWebsOverride.getWebsOverride(state),
    youtubeVideos: fromYoutubeVideos.getYoutubeVideos(state),
    youtubeVideosOverride: fromYoutubeVideosOverride.getYoutubeVideosOverride(state),
  }),
  {
    fetchScreen: fromScreen.fetchScreen,
    resetCurrentlyPlaying: fromCurrentlyPlaying.resetCurrentlyPlaying,
    resetNextPlaying: fromNextPlaying.resetNextPlaying,
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
    setTime: fromTime.setTime,
    setVersion: fromVersion.setVersion,
  }
)(App);
