import React, { useCallback, useEffect, useState } from "react";
import { getTrackUrl } from "../Services/media";
import {
  PLAYER_STATUS_PLAYING,
  PLAYER_STATUS_PAUSED,
  PLAYER_STATUS_STOPPED,
  PLAYER_MODE_NORMAL,
  PLAYER_MODE_REPEAT,
  PLAYER_MODE_SHUFFLE,
} from "../Constants/player";
import { getRandomNum } from "../Helpers";

const audio = new Audio();

function playTrack(id) {
  audio.pause();
  audio.setAttribute("src", getTrackUrl(id));
  audio.load();
  return audio.play();
}

function stopAudio() {
  audio.pause();
  audio.setAttribute("src", "");
  audio.load();
}

export const ContextPlayer = React.createContext({});

export function ContextPlayerProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [playerStatus, setPlayerStatus] = useState(PLAYER_STATUS_STOPPED);
  const [playerMode, setPlayerMode] = useState(PLAYER_MODE_NORMAL);

  const addTrack = (track) => {
    setQueue((queue) => {
      //If queue is empty, play track
      if (queue.length === 0) {
        playTrack(track.id, audio);
        setCurrentTrackIndex(0);
      }
      return [...queue, track];
    });
  };

  const addTracksAndPlay = (tracks) => {
    playTrack(tracks[0].id, audio);
    setCurrentTrackIndex(0);
    setQueue(tracks);
  };

  const removeTrack = async (index) => {
    if (index === currentTrackIndex) {
      audio.pause();
      if (queue.length > 1) {
        await playTrack(queue[index === 0 ? index + 1 : index - 1].id);
      }
    }

    setQueue((queue) => {
      return [
        ...queue.slice(0, index),
        ...queue.slice(index + 1, queue.length),
      ];
    });
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentTrackIndex(-1);
    stopAudio();
  };

  const togglePlay = useCallback(() => {
    if (playerStatus === PLAYER_STATUS_PAUSED) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [playerStatus]);

  const togglePlayerMode = useCallback(() => {
    if (playerMode === PLAYER_MODE_NORMAL) {
      setPlayerMode(PLAYER_MODE_REPEAT);
    } else if (playerMode === PLAYER_MODE_REPEAT) {
      setPlayerMode(PLAYER_MODE_SHUFFLE);
    } else if (playerMode === PLAYER_MODE_SHUFFLE) {
      setPlayerMode(PLAYER_MODE_NORMAL);
    }
  }, [playerMode]);

  const playNext = useCallback(async () => {
    const isLast = currentTrackIndex === queue.length - 1;
    let nextIndex = currentTrackIndex;
    if (playerMode === PLAYER_MODE_NORMAL && !isLast) {
      nextIndex++;
    } else if (playerMode === PLAYER_MODE_REPEAT && isLast) {
      nextIndex = 0;
    } else if (playerMode === PLAYER_MODE_SHUFFLE) {
      while (nextIndex === currentTrackIndex) {
        nextIndex = getRandomNum(0, queue.length);
      }
    }

    if (nextIndex !== currentTrackIndex) {
      playTrack(queue[nextIndex].id, audio);
      setCurrentTrackIndex(nextIndex);
    }
  }, [queue, currentTrackIndex, playerMode]);

  const playPrev = useCallback(() => {
    const isFirst = currentTrackIndex === 0;
    let nextIndex = currentTrackIndex;
    if (
      (playerMode === PLAYER_MODE_NORMAL ||
        playerMode === PLAYER_MODE_REPEAT) &&
      !isFirst
    ) {
      nextIndex--;
    } else if (playerMode === PLAYER_MODE_SHUFFLE) {
      while (nextIndex === currentTrackIndex) {
        nextIndex = getRandomNum(0, queue.length);
      }
    }

    if (nextIndex !== currentTrackIndex) {
      playTrack(queue[nextIndex].id);
      setCurrentTrackIndex(nextIndex);
    }
  }, [queue, currentTrackIndex, playerMode]);

  const onChangeTrackIndex = (newIndex) => {
    playTrack(queue[newIndex].id);
    setCurrentTrackIndex(newIndex);
  };

  useEffect(() => {
    const listener = (e) => {
      if (e.target.ended) {
        playNext();
      }
    };

    audio.addEventListener("ended", listener);

    return () => {
      audio.removeEventListener("ended", listener);
    };
  }, [playNext]);

  useEffect(() => {
    const playListener = (e) => setPlayerStatus(PLAYER_STATUS_PLAYING);
    const pauseListener = (e) => setPlayerStatus(PLAYER_STATUS_PAUSED);
    const timeListener = (e) => setCurrentTime(e.target.currentTime);

    audio.addEventListener("play", playListener);
    audio.addEventListener("pause", pauseListener);
    audio.addEventListener("timeupdate", timeListener);

    return () => {
      audio.removeEventListener("play", playListener);
      audio.removeEventListener("pause", pauseListener);
      audio.removeEventListener("timeupdate", timeListener);
    };
  }, []);

  return (
    <ContextPlayer.Provider
      value={{
        queue,
        playerStatus,
        currentTime,
        currentTrackIndex,
        togglePlay,
        playerMode,
        togglePlayerMode,
        addTracksAndPlay,
        addTrack,
        removeTrack,
        playNext,
        playPrev,
        onChangeTrackIndex,
        clearQueue,
      }}
    >
      {children}
    </ContextPlayer.Provider>
  );
}
