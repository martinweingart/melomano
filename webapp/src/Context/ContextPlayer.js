import React, { useCallback, useEffect, useRef, useState } from "react";
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

export const ContextPlayer = React.createContext({});

export function ContextPlayerProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [playerStatus, setPlayerStatus] = useState(PLAYER_STATUS_STOPPED);
  const [playerMode, setPlayerMode] = useState(PLAYER_MODE_NORMAL);

  const audioRef = useRef(new Audio());

  const playTrack = (id) => {
    audioRef.current.src = getTrackUrl(id);
    return audioRef.current.play();
  };

  const addTrack = (track) => {
    setQueue((queue) => {
      //If queue is empty, play track
      if (queue.length === 0) {
        playTrack(track.id);
        setCurrentTrackIndex(0);
      }
      return [...queue, track];
    });
  };

  const addTracksAndPlay = (tracks) => {
    playTrack(tracks[0].id);
    setCurrentTrackIndex(0);
    setQueue(tracks);
  };

  const removeTrack = async (index) => {
    if (index === currentTrackIndex) {
      audioRef.current.pause();
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

  const togglePlay = useCallback(() => {
    if (playerStatus === PLAYER_STATUS_PAUSED) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
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

  const playNext = useCallback(() => {
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
      playTrack(queue[nextIndex].id);
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

  audioRef.current.addEventListener("play", (e) =>
    setPlayerStatus(PLAYER_STATUS_PLAYING)
  );
  audioRef.current.addEventListener("pause", (e) =>
    setPlayerStatus(PLAYER_STATUS_PAUSED)
  );
  audioRef.current.addEventListener("timeupdate", (e) =>
    setCurrentTime(e.target.currentTime)
  );

  useEffect(() => {
    const audio = audioRef.current;

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
      }}
    >
      {children}
    </ContextPlayer.Provider>
  );
}
