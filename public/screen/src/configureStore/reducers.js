import { combineReducers } from 'redux';
import appBlocking from '../ducks/appBlocking';
import offlinePlaying from '../ducks/offlinePlaying';
import badPlaying from '../ducks/badPlaying';
import screen from '../ducks/screen';
import slideDecks from '../ducks/slideDecks';
import youtubeVideos from '../ducks/youtubeVideos';
import currentlyPlaying from '../ducks/currentlyPlaying';
import images from '../ducks/images';
import monitor from '../ducks/monitor';
import connected from '../ducks/connected';
import overlay from '../ducks/overlay';
import ovWidgets from '../ducks/ovWidgets';

export default combineReducers({
  appBlocking,
  offlinePlaying,
  badPlaying,
  screen,
  slideDecks,
  youtubeVideos,
  currentlyPlaying,
  images,
  monitor,
  connected,
  overlay,
  ovWidgets,
});
