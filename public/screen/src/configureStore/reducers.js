import { combineReducers } from 'redux';
import appBlocking from '../ducks/appBlocking';
import offlinePlaying from '../ducks/offlinePlaying';
import badPlaying from '../ducks/badPlaying';
import screen from '../ducks/screen';
import layers from '../ducks/layers';
import slideDecks from '../ducks/slideDecks';
import youtubeVideos from '../ducks/youtubeVideos';
import youtubeVideosOverride from '../ducks/youtubeVideosOverride';
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
import minImagePriority from '../ducks/minImagePriority';
import webs from '../ducks/webs';
import websOverride from '../ducks/websOverride';
import slideDecksOverride from '../ducks/slideDecksOverride';
import imagesOverride from '../ducks/imagesOverride';
import override from '../ducks/override';
import counter from '../ducks/counter';
import mediaDecks from '../ducks/mediaDecks';
import mediaDecksOverride from '../ducks/mediaDecksOverride';
import time from '../ducks/time';
import version from '../ducks/version';

export default combineReducers({
  appBlocking,
  offlinePlaying,
  badPlaying,
  screen,
  slideDecks,
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
  minImagePriority,
  webs,
  websOverride,
  slideDecksOverride,
  imagesOverride,
  override,
  counter,
  mediaDecks,
  mediaDecksOverride,
  youtubeVideos,
  youtubeVideosOverride,
  time,
  version,
});
