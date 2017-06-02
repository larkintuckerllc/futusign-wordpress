import { combineReducers } from 'redux';
import appBlocking from '../ducks/appBlocking';
import images from '../ducks/images';
import imagesOverride from '../ducks/imagesOverride';
import layers from '../ducks/layers';
import mediaDecks from '../ducks/mediaDecks';
import mediaDecksOverride from '../ducks/mediaDecksOverride';
import screen from '../ducks/screen';
import slideDecks from '../ducks/slideDecks';
import slideDecksOverride from '../ducks/slideDecksOverride';
import webs from '../ducks/webs';
import websOverride from '../ducks/websOverride';
import youtubeVideos from '../ducks/youtubeVideos';
import youtubeVideosOverride from '../ducks/youtubeVideosOverride';

export default combineReducers({
  appBlocking,
  images,
  imagesOverride,
  layers,
  mediaDecks,
  mediaDecksOverride,
  screen,
  slideDecks,
  slideDecksOverride,
  webs,
  websOverride,
  youtubeVideos,
  youtubeVideosOverride,
});
