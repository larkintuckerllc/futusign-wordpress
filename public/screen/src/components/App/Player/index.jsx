import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  IMAGES, SLIDE_DECKS, TRANSITION, TRANSITION2, WEBS, YOUTUBE_VIDEOS,
} from '../../../strings';
import { minLargerPriority } from '../../../util/misc';
import * as fromCurrentlyPlaying from '../../../ducks/currentlyPlaying';
import * as fromCurrentlyIsPlaying from '../../../ducks/currentlyIsPlaying';
import * as fromNextPlaying from '../../../ducks/nextPlaying';
import * as fromNextIsReady from '../../../ducks/nextIsReady';
import * as fromBadPlaying from '../../../ducks/badPlaying';
import * as fromCover from '../../../ducks/cover';
import * as fromOfflinePlaying from '../../../ducks/offlinePlaying';
import * as fromPriority from '../../../ducks/priority';
import { getMinSlideDeckPriority } from '../../../ducks/minSlideDeckPriority';
import { getImages } from '../../../ducks/images';
import { getSlideDecks } from '../../../ducks/slideDecks';
import { getYoutubeVideos } from '../../../ducks/youtubeVideos';
import { getWebs } from '../../../ducks/webs';
import PlayerTransition from './PlayerTransition';
import PlayerTransition2 from './PlayerTransition2';
import PlayerSlideDecks from './PlayerSlideDecks';
import PlayerImages from './PlayerImages';
import PlayerWebs from './PlayerWebs';
import PlayerYoutubeVideos from './PlayerYoutubeVideos';

const PLAY_ORDER = [
  TRANSITION,
  TRANSITION2,
  SLIDE_DECKS,
  IMAGES,
  WEBS,
  YOUTUBE_VIDEOS,
];
class Player extends Component {
  constructor(props) {
    super(props);
    this.filteredSlideDecks = [];
    this.filteredImages = [];
    this.filteredWebs = [];
    this.filteredYoutubeVideos = [];
    this.minSlideDeckPriority = null;
  }
  componentWillReceiveProps(upProps) {
    const {
      currentlyIsPlaying,
      currentlyPlaying,
      images,
      nextIsReady,
      nextPlaying,
      priority,
      setCurrentlyIsPlaying,
      setCurrentlyPlaying,
      setNextIsReady,
      setNextPlaying,
      setPriority,
      slideDecks,
      webs,
      youtubeVideos,
    } = this.props;
    const mediaById = {
      TRANSITION: [null],
      TRANSITION2: [null],
      SLIDE_DECKS: this.filteredSlideDecks,
      IMAGES: this.filteredImages,
      WEBS: this.filteredWebs,
      YOUTUBE_VIDEOS: this.filteredYoutubeVideos,
    };
    const upCurrentlyIsPlaying = upProps.currentlyIsPlaying;
    const upNextIsReady = upProps.nextIsReady;
    // TRIGGER NEXT LOAD
    if (!currentlyIsPlaying && upCurrentlyIsPlaying) {
      window.setTimeout(() => {
        let isEmpty = true;
        let nextIndex = PLAY_ORDER.indexOf(currentlyPlaying) + 1;
        nextIndex = nextIndex < PLAY_ORDER.length ? nextIndex : 0;
        while (isEmpty) {
          isEmpty = mediaById[PLAY_ORDER[nextIndex]].length === 0;
          if (isEmpty) {
            nextIndex += 1;
            nextIndex = nextIndex < PLAY_ORDER.length ? nextIndex : 0;
          }
        }
        // FILTER MEDIA BASED ON PRIORITY
        if (PLAY_ORDER[nextIndex] === TRANSITION2) {
          this.filteredSlideDecks = slideDecks.filter(o => o.priority === priority);
          this.filteredImages = images.filter(o => o.priority === priority);
          this.filteredWebs = webs.filter(o => o.priority === priority);
          this.filteredYoutubeVideos = youtubeVideos.filter(o => o.priority === priority);
        }
        // TRIGGER NEXT LOAD
        setNextIsReady(false);
        setNextPlaying(PLAY_ORDER[nextIndex]);
      }, 0);
    }
    // TRIGGER PLAYING
    if (
      (currentlyIsPlaying && !upCurrentlyIsPlaying && nextIsReady) ||
      (!nextIsReady && upNextIsReady && !currentlyIsPlaying)
    ) {
      window.setTimeout(() => {
        if (nextPlaying === TRANSITION) {
          let nextPriority = minLargerPriority(priority, [
            ...slideDecks,
            ...images,
            ...webs,
            ...youtubeVideos,
          ]);
          if (nextPriority === Infinity) {
            nextPriority = minLargerPriority(0, [
              ...slideDecks,
              ...images,
              ...webs,
              ...youtubeVideos,
            ]);
          }
          setPriority(nextPriority);
        }
        setCurrentlyPlaying(nextPlaying);
        setCurrentlyIsPlaying(true);
      }, 0);
    }
  }
  render() {
    const {
      currentlyIsPlaying,
      currentlyPlaying,
      minSlideDeckPriority,
      nextPlaying,
      priority,
      setBadPlaying,
      setCover,
      setCurrentlyIsPlaying,
      setNextIsReady,
      setOfflinePlaying,
    } = this.props;
    return (
      <div>
        <PlayerTransition
          currentlyIsPlaying={currentlyIsPlaying}
          currentlyPlaying={currentlyPlaying}
          nextPlaying={nextPlaying}
          setCover={setCover}
          setCurrentlyIsPlaying={setCurrentlyIsPlaying}
          setNextIsReady={setNextIsReady}
        />
        <PlayerTransition2
          currentlyIsPlaying={currentlyIsPlaying}
          currentlyPlaying={currentlyPlaying}
          nextPlaying={nextPlaying}
          setCover={setCover}
          setCurrentlyIsPlaying={setCurrentlyIsPlaying}
          setNextIsReady={setNextIsReady}
        />
        <PlayerSlideDecks
          currentlyIsPlaying={currentlyIsPlaying}
          currentlyPlaying={currentlyPlaying}
          nextPlaying={nextPlaying}
          setBadPlaying={setBadPlaying}
          setCurrentlyIsPlaying={setCurrentlyIsPlaying}
          setNextIsReady={setNextIsReady}
          slideDecks={this.filteredSlideDecks}
          storeOffline={priority === minSlideDeckPriority}
        />
        <PlayerImages
          currentlyIsPlaying={currentlyIsPlaying}
          currentlyPlaying={currentlyPlaying}
          images={this.filteredImages}
          nextPlaying={nextPlaying}
          setBadPlaying={setBadPlaying}
          setCurrentlyIsPlaying={setCurrentlyIsPlaying}
          setNextIsReady={setNextIsReady}
        />
        <PlayerWebs
          currentlyIsPlaying={currentlyIsPlaying}
          currentlyPlaying={currentlyPlaying}
          nextPlaying={nextPlaying}
          setCurrentlyIsPlaying={setCurrentlyIsPlaying}
          setNextIsReady={setNextIsReady}
          webs={this.filteredWebs}
        />
        <PlayerYoutubeVideos
          currentlyIsPlaying={currentlyIsPlaying}
          currentlyPlaying={currentlyPlaying}
          nextPlaying={nextPlaying}
          setBadPlaying={setBadPlaying}
          setCover={setCover}
          setCurrentlyIsPlaying={setCurrentlyIsPlaying}
          setNextIsReady={setNextIsReady}
          setOfflinePlaying={setOfflinePlaying}
          youtubeVideos={this.filteredYoutubeVideos}
        />
      </div>
    );
  }
}
Player.propTypes = {
  currentlyIsPlaying: PropTypes.bool.isRequired,
  currentlyPlaying: PropTypes.string,
  minSlideDeckPriority: PropTypes.number.isRequired,
  images: PropTypes.array.isRequired,
  nextIsReady: PropTypes.bool.isRequired,
  nextPlaying: PropTypes.string,
  priority: PropTypes.number.isRequired,
  setBadPlaying: PropTypes.func.isRequired,
  setCover: PropTypes.func.isRequired,
  setCurrentlyPlaying: PropTypes.func.isRequired,
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
  setNextIsReady: PropTypes.func.isRequired,
  setNextPlaying: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
  setPriority: PropTypes.func.isRequired,
  slideDecks: PropTypes.array.isRequired,
  webs: PropTypes.array.isRequired,
  youtubeVideos: PropTypes.array.isRequired,
};
export default connect(
  state => ({
    currentlyIsPlaying: fromCurrentlyIsPlaying.getCurrentlyIsPlaying(state),
    currentlyPlaying: fromCurrentlyPlaying.getCurrentlyPlaying(state),
    images: getImages(state),
    minSlideDeckPriority: getMinSlideDeckPriority(state),
    nextIsReady: fromNextIsReady.getNextIsReady(state),
    nextPlaying: fromNextPlaying.getNextPlaying(state),
    priority: fromPriority.getPriority(state),
    slideDecks: getSlideDecks(state),
    webs: getWebs(state),
    youtubeVideos: getYoutubeVideos(state),
  }), {
    setBadPlaying: fromBadPlaying.setBadPlaying,
    setCover: fromCover.setCover,
    setCurrentlyPlaying: fromCurrentlyPlaying.setCurrentlyPlaying,
    setCurrentlyIsPlaying: fromCurrentlyIsPlaying.setCurrentlyIsPlaying,
    setNextIsReady: fromNextIsReady.setNextIsReady,
    setNextPlaying: fromNextPlaying.setNextPlaying,
    setOfflinePlaying: fromOfflinePlaying.setOfflinePlaying,
    setPriority: fromPriority.setPriority,
  }
)(Player);
