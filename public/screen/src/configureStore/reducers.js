import { combineReducers } from 'redux';
import appBlocking from '../ducks/appBlocking';
import offlinePlaying from '../ducks/offlinePlaying';
import badPlaying from '../ducks/badPlaying';
import screen from '../ducks/screen';
import layers from '../ducks/layers';
import slideDecks from '../ducks/slideDecks';
import youtubeVideos from '../ducks/youtubeVideos';
import currentlyPlaying from '../ducks/currentlyPlaying';
import currentlyIsPlaying from '../ducks/currentlyIsPlaying';
import nextPlaying from '../ducks/nextPlaying';
import nextIsReady from '../ducks/nextIsReady';
import images from '../ducks/images';
import monitor from '../ducks/monitor';
import connected from '../ducks/connected';
import overlay from '../ducks/overlay';
import ovWidgets from '../ducks/ovWidgets';
import layerBlocking from '../ducks/layerBlocking';
import cover from '../ducks/cover';
import priority from '../ducks/priority';
import minSlideDeckPriority from '../ducks/minSlideDeckPriority';
import webs from '../ducks/webs';
import slideDecksOverride from '../ducks/slideDecksOverride';
import override from '../ducks/override';

export default combineReducers({
  appBlocking,
  offlinePlaying,
  badPlaying,
  screen,
  slideDecks,
  youtubeVideos,
  currentlyPlaying,
  currentlyIsPlaying,
  nextPlaying,
  nextIsReady,
  images,
  layers,
  monitor,
  connected,
  overlay,
  ovWidgets,
  layerBlocking,
  cover,
  priority,
  minSlideDeckPriority,
  webs,
  slideDecksOverride,
  override,
});
