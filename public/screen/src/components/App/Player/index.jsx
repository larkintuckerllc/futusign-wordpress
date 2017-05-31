import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  IMAGES, MEDIA_DECKS, TRANSITION, TRANSITION2, WEBS, YOUTUBE_VIDEOS, SLIDE_DECKS,
} from '../../../strings';
import { minLargerPriority } from '../../../util/misc';
import * as fromCurrentlyPlaying from '../../../ducks/currentlyPlaying';
import * as fromCurrentlyIsPlaying from '../../../ducks/currentlyIsPlaying';
import * as fromNextPlaying from '../../../ducks/nextPlaying';
import * as fromNextIsReady from '../../../ducks/nextIsReady';
import * as fromBadPlaying from '../../../ducks/badPlaying';
import * as fromCover from '../../../ducks/cover';
import * as fromCounter from '../../../ducks/counter';
import * as fromPriority from '../../../ducks/priority';
import { getMinImagePriority } from '../../../ducks/minImagePriority';
import PlayerTransition from './PlayerTransition';
import PlayerTransition2 from './PlayerTransition2';
import PlayerSlideDecks from './PlayerSlideDecks';
import PlayerImages from './PlayerImages';
import PlayerWebs from './PlayerWebs';
import PlayerYoutubeVideos from './PlayerYoutubeVideos';

class Player extends Component {
  constructor(props) {
    super(props);
    this.media = [];
    this.mediaImages = [];
    this.filteredImages = [];
    this.filteredMediaDecks = [];
    this.filteredWebs = [];
    this.filteredYoutubeVideos = [];
    this.filteredSlideDecks = [];
  }
  componentWillReceiveProps(upProps) {
    const {
      counter,
      currentlyIsPlaying,
      currentlyPlaying,
      images,
      mediaDecks,
      nextIsReady,
      nextPlaying,
      priority,
      setCounter,
      setCurrentlyIsPlaying,
      setCurrentlyPlaying,
      setNextIsReady,
      setNextPlaying,
      setPriority,
      slideDecks,
      webs,
      youtubeVideos,
    } = this.props;
    const upCurrentlyIsPlaying = upProps.currentlyIsPlaying;
    const upNextIsReady = upProps.nextIsReady;
    // TRIGGER NEXT LOAD
    if (!currentlyIsPlaying && upCurrentlyIsPlaying) {
      if (currentlyPlaying === TRANSITION) {
        // BEGINNING OF NEW PRIORITY; SET MEDIA
        if (counter === 0) {
          // HANDLED DIFFERENT BECAUSE OF OFFLINE
          this.mediaImages = images
            .filter(o => o.priority === priority)
            .map(o => ({
              title: o.title,
              type: IMAGES,
              media: o,
            }))
            .sort((a, b) => {
              if (a.title < b.title) {
                return -1;
              }
              if (a.title > b.title) {
                return 1;
              }
              return 0;
            });
          const mediaWebs = webs
            .filter(o => o.priority === priority)
            .map(o => ({
              title: o.title,
              type: WEBS,
              media: o,
            }));
          const mediaMediaDecks = mediaDecks
            .filter(o => o.priority === priority)
            .map(o => ({
              title: o.title,
              type: MEDIA_DECKS,
              media: o,
            }));
          const mediaYoutubeVideos = youtubeVideos
            .filter(o => o.priority === priority)
            .map(o => ({
              title: o.title,
              type: YOUTUBE_VIDEOS,
              media: o,
            }));
          const mediaSlideDecks = slideDecks
            .filter(o => o.priority === priority)
            .map(o => ({
              title: o.title,
              type: SLIDE_DECKS,
              media: o,
            }));
          this.media = [
            ...this.mediaImages,
            ...mediaWebs,
            ...mediaYoutubeVideos,
            ...mediaSlideDecks,
          ].sort((a, b) => {
            if (a.title < b.title) {
              return -1;
            }
            if (a.title > b.title) {
              return 1;
            }
            return 0;
          });
          // MERGE IN MEDIA DECKS
          const newMedia = [];
          for (let i = this.media.length - 1; i >= 0; i -= 1) {
            const mediaItem = this.media[i];
            for (let j = mediaMediaDecks.length - 1; j >= 0; j -= 1) {
              const mediaMediaDecksItem = mediaMediaDecks[j];
              if (mediaMediaDecksItem.title > mediaItem.title) {
                mediaMediaDecks.splice(j, 1);
                for (let k = mediaMediaDecksItem.media.media.length - 1; k >= 0; k -= 1) {
                  const mediaMediaDecksItemItem = mediaMediaDecksItem.media.media[k];
                  newMedia.unshift({
                    media: mediaMediaDecksItemItem,
                    title: mediaMediaDecksItem.title,
                    type: mediaMediaDecksItemItem.type,
                  });
                }
              }
            }
            newMedia.unshift(mediaItem);
          }
          for (let i = mediaMediaDecks.length - 1; i >= 0; i -= 1) {
            const mediaMediaDecksItem = mediaMediaDecks[i];
            for (let j = mediaMediaDecksItem.media.media.length - 1; j >= 0; j -= 1) {
              const mediaMediaDecksItemItem = mediaMediaDecksItem.media.media[j];
              newMedia.unshift({
                media: mediaMediaDecksItemItem,
                title: mediaMediaDecksItem.title,
                type: mediaMediaDecksItemItem.type,
              });
            }
          }
          this.media = newMedia;
        }
        // STUFF FILTERED
        const nextMedia = this.media[counter];
        this.filteredImages = [];
        this.filteredWebs = [];
        this.filteredYoutubeVideos = [];
        this.filteredSlideDecks = [];
        switch (nextMedia.type) {
          case IMAGES:
            this.filteredImages = [nextMedia.media];
            break;
          case WEBS:
            this.filteredWebs = [nextMedia.media];
            break;
          case YOUTUBE_VIDEOS:
            this.filteredYoutubeVideos = [nextMedia.media];
            break;
          case SLIDE_DECKS:
            this.filteredSlideDecks = [nextMedia.media];
            break;
          default:
        }
        // CONTINUE
        window.setTimeout(() => {
          setNextIsReady(false);
          setNextPlaying(TRANSITION2);
        });
        return;
      }
      if (currentlyPlaying === TRANSITION2) {
        window.setTimeout(() => {
          setNextPlaying(this.media[counter].type);
          setNextIsReady(false);
        });
        return;
      }
      // PLAYING ACTUAL MEDIA
      window.setTimeout(() => {
        setCounter(counter + 1);
        setNextPlaying('TRANSITION');
        setNextIsReady(false);
      });
      return;
    }
    // TRIGGER PLAYING
    if (
      (currentlyIsPlaying && !upCurrentlyIsPlaying && nextIsReady) ||
      (!nextIsReady && upNextIsReady && !currentlyIsPlaying)
    ) {
      window.setTimeout(() => {
        if (nextPlaying === TRANSITION) {
          if (counter === this.media.length) {
            let nextPriority = minLargerPriority(priority, [
              ...images,
              ...mediaDecks,
              ...webs,
              ...youtubeVideos,
              ...slideDecks,
            ]);
            if (nextPriority === Infinity) {
              nextPriority = minLargerPriority(0, [
                ...images,
                ...mediaDecks,
                ...webs,
                ...youtubeVideos,
                ...slideDecks,
              ]);
            }
            setPriority(nextPriority);
            setCounter(0);
          }
        }
        setCurrentlyPlaying(nextPlaying);
        setCurrentlyIsPlaying(true);
      });
      return;
    }
  }
  render() {
    const {
      currentlyIsPlaying,
      currentlyPlaying,
      minImagePriority,
      nextPlaying,
      priority,
      setBadPlaying,
      setCover,
      setCurrentlyIsPlaying,
      setNextIsReady,
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
        <PlayerImages
          currentlyIsPlaying={currentlyIsPlaying}
          currentlyPlaying={currentlyPlaying}
          images={this.filteredImages}
          nextPlaying={nextPlaying}
          setBadPlaying={setBadPlaying}
          setCurrentlyIsPlaying={setCurrentlyIsPlaying}
          setNextIsReady={setNextIsReady}
          storeOffline={
            this.filteredImages.length !== 0 &&
            priority === minImagePriority &&
            this.filteredImages[0].id !== undefined &&
            this.filteredImages[0].id === this.mediaImages[0].media.id
          }
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
          youtubeVideos={this.filteredYoutubeVideos}
        />
        <PlayerSlideDecks
          currentlyIsPlaying={currentlyIsPlaying}
          currentlyPlaying={currentlyPlaying}
          nextPlaying={nextPlaying}
          setBadPlaying={setBadPlaying}
          setCurrentlyIsPlaying={setCurrentlyIsPlaying}
          setNextIsReady={setNextIsReady}
          slideDecks={this.filteredSlideDecks}
        />
      </div>
    );
  }
}
Player.propTypes = {
  counter: PropTypes.number.isRequired,
  currentlyIsPlaying: PropTypes.bool.isRequired,
  currentlyPlaying: PropTypes.string,
  minImagePriority: PropTypes.number.isRequired,
  images: PropTypes.array.isRequired,
  mediaDecks: PropTypes.array.isRequired,
  nextIsReady: PropTypes.bool.isRequired,
  nextPlaying: PropTypes.string,
  priority: PropTypes.number.isRequired,
  setBadPlaying: PropTypes.func.isRequired,
  setCover: PropTypes.func.isRequired,
  setCounter: PropTypes.func.isRequired,
  setCurrentlyPlaying: PropTypes.func.isRequired,
  setCurrentlyIsPlaying: PropTypes.func.isRequired,
  setNextIsReady: PropTypes.func.isRequired,
  setNextPlaying: PropTypes.func.isRequired,
  setPriority: PropTypes.func.isRequired,
  slideDecks: PropTypes.array.isRequired,
  webs: PropTypes.array.isRequired,
  youtubeVideos: PropTypes.array.isRequired,
};
export default connect(
  state => ({
    counter: fromCounter.getCounter(state),
    currentlyIsPlaying: fromCurrentlyIsPlaying.getCurrentlyIsPlaying(state),
    currentlyPlaying: fromCurrentlyPlaying.getCurrentlyPlaying(state),
    minImagePriority: getMinImagePriority(state),
    nextIsReady: fromNextIsReady.getNextIsReady(state),
    nextPlaying: fromNextPlaying.getNextPlaying(state),
    priority: fromPriority.getPriority(state),
  }), {
    setBadPlaying: fromBadPlaying.setBadPlaying,
    setCover: fromCover.setCover,
    setCounter: fromCounter.setCounter,
    setCurrentlyPlaying: fromCurrentlyPlaying.setCurrentlyPlaying,
    setCurrentlyIsPlaying: fromCurrentlyIsPlaying.setCurrentlyIsPlaying,
    setNextIsReady: fromNextIsReady.setNextIsReady,
    setNextPlaying: fromNextPlaying.setNextPlaying,
    setPriority: fromPriority.setPriority,
  }
)(Player);
