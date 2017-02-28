import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { POLLING_INTERVAL } from '../../strings';
import { fetchBase } from '../../apis/base';
import * as fromAppBlocking from '../../ducks/appBlocking';
import * as fromScreen from '../../ducks/screen';
import * as fromSlideDecks from '../../ducks/slideDecks';
import * as fromYoutubeVideos from '../../ducks/youtubeVideos';
import * as fromOfflinePlaying from '../../ducks/offlinePlaying';
import * as fromBadPlaying from '../../ducks/badPlaying';
import Blocking from './Blocking';
import Offline from './Offline';
import Bad from './Bad';
import NoSlideDecks from './NoSlideDecks';
import SlideShow from './SlideShow';

class App extends Component {
  componentDidMount() {
    const {
      fetchScreen,
      fetchSlideDecks,
      fetchYoutubeVideos,
      resetSlideDecks,
      resetYoutubeVideos,
      setAppBlocking,
      setBadPlaying,
      setOfflinePlaying,
    } = this.props;
    const fetch = () => {
      fetchBase()
      .then(() => (
        fetchScreen()
      ))
      .then(screen => {
        if (screen.subscribedPlaylistIds.length === 0) {
          resetSlideDecks();
          resetYoutubeVideos();
          return Promise.resolve();
        }
        return Promise.all([
          fetchSlideDecks(screen.subscribedPlaylistIds),
          fetchYoutubeVideos(screen.subscribedPlaylistIds),
        ]);
      })
      .then(() => {
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
    };
    fetch();
    window.setInterval(fetch, POLLING_INTERVAL * 1000);
  }
  render() {
    const {
      appBlocking,
      badPlaying,
      offlinePlaying,
      slideDecks,
    } = this.props;
    if (appBlocking) return <Blocking />;
    if (offlinePlaying) return <Offline />;
    if (badPlaying) return <Bad />;
    if (slideDecks.length === 0) return <NoSlideDecks />;
    return (
      <SlideShow
        slideDecks={slideDecks.map(o => ({
          id: o.file,
          file: o.file,
          slideDuration: o.slideDuration,
        }))}
      />
    );
  }
}
App.propTypes = {
  appBlocking: PropTypes.bool.isRequired,
  badPlaying: PropTypes.bool.isRequired,
  fetchScreen: PropTypes.func.isRequired,
  fetchSlideDecks: PropTypes.func.isRequired,
  fetchYoutubeVideos: PropTypes.func.isRequired,
  offlinePlaying: PropTypes.bool.isRequired,
  resetSlideDecks: PropTypes.func.isRequired,
  resetYoutubeVideos: PropTypes.func.isRequired,
  setAppBlocking: PropTypes.func.isRequired,
  setBadPlaying: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
  slideDecks: PropTypes.array.isRequired,
  youtubeVideos: PropTypes.array.isRequired,
};
export default connect(
  state => ({
    appBlocking: fromAppBlocking.getAppBlocking(state),
    badPlaying: fromBadPlaying.getBadPlaying(state),
    offlinePlaying: fromOfflinePlaying.getOfflinePlaying(state),
    slideDecks: fromSlideDecks.getSlideDecks(state),
    youtubeVideos: fromYoutubeVideos.getYoutubeVideos(state),
  }),
  {
    fetchScreen: fromScreen.fetchScreen,
    fetchSlideDecks: fromSlideDecks.fetchSlideDecks,
    fetchYoutubeVideos: fromYoutubeVideos.fetchYoutubeVideos,
    resetSlideDecks: fromSlideDecks.resetSlideDecks,
    resetYoutubeVideos: fromYoutubeVideos.resetYoutubeVideos,
    setAppBlocking: fromAppBlocking.setAppBlocking,
    setBadPlaying: fromBadPlaying.setBadPlaying,
    setOfflinePlaying: fromOfflinePlaying.setOfflinePlaying,
  }
)(App);
