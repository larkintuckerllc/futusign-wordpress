import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { CACHE_INTERVAL, POLLING_INTERVAL } from '../../strings';
import { fetchBase } from '../../apis/base';
import * as fromAppBlocking from '../../ducks/appBlocking';
import * as fromMonitor from '../../ducks/monitor';
import * as fromScreen from '../../ducks/screen';
import * as fromSlideDecks from '../../ducks/slideDecks';
import * as fromYoutubeVideos from '../../ducks/youtubeVideos';
import * as fromImages from '../../ducks/images';
import * as fromOfflinePlaying from '../../ducks/offlinePlaying';
import * as fromBadPlaying from '../../ducks/badPlaying';
import * as fromCurrentlyPlaying from '../../ducks/currentlyPlaying';
import * as fromConnected from '../../ducks/connected';
import Blocking from './Blocking';
import Offline from './Offline';
import Connected from './Connected';
import OfflineSlideDeck from './OfflineSlideDeck';
import Bad from './Bad';
import NoMedia from './NoMedia';
import Player from './Player';

class App extends Component {
  constructor() {
    super();
    this.fetch = this.fetch.bind(this);
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
    window.setInterval(this.fetch, POLLING_INTERVAL * 1000);
    window.setInterval(check, CACHE_INTERVAL * 1000);
    appCache.addEventListener('updateready', handleUpdateReady);
  }
  fetch() {
    const {
      fetchImages,
      fetchMonitor,
      fetchScreen,
      fetchSlideDecks,
      fetchYoutubeVideos,
      images,
      monitor,
      offlinePlaying,
      resetSlideDecks,
      resetYoutubeVideos,
      setAppBlocking,
      setBadPlaying,
      setConnected,
      setCurrentlyPlaying,
      setOfflinePlaying,
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
        fetchMonitor(),
        Promise.resolve(screen),
      ]);
    })
    .then(([
      slideDecksResponse,
      youtubeVideosResponse,
      imagesResponse,
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
      // MONITORING
      const nextMonitor = monitorResponse;
      // MONITORING - LOGOUT AND RELOAD
      if (
        monitor !== null &&
        JSON.stringify(nextMonitor) !== JSON.stringify(monitor)
      ) {
        try {
          firebase.initializeApp(monitor);
          firebase.auth().onAuthStateChanged(user => {
            if (user) {
              firebase.auth().signOut()
              .finally(() => window.location.reload());
            } else {
              window.location.reload();
            }
          });
        } catch (err) {
          window.location.reload();
        }
        return null;
      }
      // MONITORING - LOGIN AND CHECK-IN
      if (monitor === null && nextMonitor !== null) {
        try {
          firebase.initializeApp(nextMonitor);
          firebase.auth().onAuthStateChanged(user => {
            if (!user) {
              firebase.auth().signInWithEmailAndPassword(
                nextMonitor.email,
                nextMonitor.password
              );
            } else {
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
      // CONDITIONALLY RESTART PLAYING LOOP
      if (
        JSON.stringify(slideDecks) !== JSON.stringify(nextSlideDecks) ||
        JSON.stringify(youtubeVideos) !== JSON.stringify(nextYoutubeVideos) ||
        JSON.stringify(images) !== JSON.stringify(nextImages)
      ) {
        setCurrentlyPlaying(fromCurrentlyPlaying.LOADING);
      }
      // MISC
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
      connected,
      currentlyPlaying,
      images,
      monitor,
      offlinePlaying,
      setBadPlaying,
      setCurrentlyPlaying,
      setOfflinePlaying,
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
        {monitor !== null && <Connected connected={connected} />}
        <Player
          currentlyPlaying={currentlyPlaying}
          images={images}
          setBadPlaying={setBadPlaying}
          setCurrentlyPlaying={setCurrentlyPlaying}
          setOfflinePlaying={setOfflinePlaying}
          slideDecks={slideDecks}
          youtubeVideos={youtubeVideos}
        />
      </div>
    );
  }
}
App.propTypes = {
  appBlocking: PropTypes.bool.isRequired,
  badPlaying: PropTypes.bool.isRequired,
  connected: PropTypes.bool.isRequired,
  currentlyPlaying: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
  fetchImages: PropTypes.func.isRequired,
  fetchMonitor: PropTypes.func.isRequired,
  fetchScreen: PropTypes.func.isRequired,
  fetchSlideDecks: PropTypes.func.isRequired,
  fetchYoutubeVideos: PropTypes.func.isRequired,
  monitor: PropTypes.object,
  offlinePlaying: PropTypes.bool.isRequired,
  resetSlideDecks: PropTypes.func.isRequired,
  resetYoutubeVideos: PropTypes.func.isRequired,
  setAppBlocking: PropTypes.func.isRequired,
  setBadPlaying: PropTypes.func.isRequired,
  setConnected: PropTypes.func.isRequired,
  setCurrentlyPlaying: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
  slideDecks: PropTypes.array.isRequired,
  youtubeVideos: PropTypes.array.isRequired,
};
export default connect(
  state => ({
    appBlocking: fromAppBlocking.getAppBlocking(state),
    badPlaying: fromBadPlaying.getBadPlaying(state),
    connected: fromConnected.getConnected(state),
    currentlyPlaying: fromCurrentlyPlaying.getCurrentlyPlaying(state),
    images: fromImages.getImages(state),
    monitor: fromMonitor.getMonitor(state),
    offlinePlaying: fromOfflinePlaying.getOfflinePlaying(state),
    slideDecks: fromSlideDecks.getSlideDecks(state),
    youtubeVideos: fromYoutubeVideos.getYoutubeVideos(state),
  }),
  {
    fetchImages: fromImages.fetchImages,
    fetchMonitor: fromMonitor.fetchMonitor,
    fetchScreen: fromScreen.fetchScreen,
    fetchSlideDecks: fromSlideDecks.fetchSlideDecks,
    fetchYoutubeVideos: fromYoutubeVideos.fetchYoutubeVideos,
    resetSlideDecks: fromSlideDecks.resetSlideDecks,
    resetYoutubeVideos: fromYoutubeVideos.resetYoutubeVideos,
    setAppBlocking: fromAppBlocking.setAppBlocking,
    setBadPlaying: fromBadPlaying.setBadPlaying,
    setConnected: fromConnected.setConnected,
    setCurrentlyPlaying: fromCurrentlyPlaying.setCurrentlyPlaying,
    setOfflinePlaying: fromOfflinePlaying.setOfflinePlaying,
  }
)(App);
