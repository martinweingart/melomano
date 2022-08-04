import "./Controls.scss";
import { useContext } from "react";
import {
  MdOutlinePlaylistPlay,
  MdOutlineShuffle,
  MdOutlineRepeat,
  MdOutlineQueueMusic,
  MdOutlineSkipPrevious,
  MdOutlineSkipNext,
  MdOutlinePlayCircleOutline,
  MdOutlinePauseCircleOutline,
} from "react-icons/md";

import { IconButton } from "../../Components/";
import { ContextPlayer } from "../../Context/ContextPlayer";
import {
  PLAYER_STATUS_PLAYING,
  PLAYER_MODE_NORMAL,
  PLAYER_MODE_REPEAT,
  PLAYER_MODE_SHUFFLE,
} from "../../Constants/player";

function getPlayerModeIcon(playerMode) {
  if (playerMode === PLAYER_MODE_NORMAL) return <MdOutlinePlaylistPlay />;
  if (playerMode === PLAYER_MODE_REPEAT) return <MdOutlineRepeat />;
  if (playerMode === PLAYER_MODE_SHUFFLE) return <MdOutlineShuffle />;
}

export function Controls({ onOpenQueue }) {
  const {
    playerStatus,
    togglePlay,
    playerMode,
    togglePlayerMode,
    playNext,
    playPrev,
  } = useContext(ContextPlayer);

  return (
    <div className="Controls">
      <IconButton
        size={36}
        aria-label="Play Mode"
        isDark
        onClick={togglePlayerMode}
      >
        {getPlayerModeIcon(playerMode)}
      </IconButton>

      <div>
        <IconButton
          size={36}
          aria-label="Previous Track"
          isDark
          onClick={playPrev}
        >
          <MdOutlineSkipPrevious />
        </IconButton>

        {playerStatus === PLAYER_STATUS_PLAYING ? (
          <IconButton size={36} aria-label="Pause" isDark onClick={togglePlay}>
            <MdOutlinePauseCircleOutline />
          </IconButton>
        ) : (
          <IconButton size={36} aria-label="Play" isDark onClick={togglePlay}>
            <MdOutlinePlayCircleOutline />
          </IconButton>
        )}

        <IconButton size={36} aria-label="Next Track" isDark onClick={playNext}>
          <MdOutlineSkipNext />
        </IconButton>
      </div>

      <IconButton
        size={36}
        aria-label="Open Queue"
        isDark
        onClick={onOpenQueue}
      >
        <MdOutlineQueueMusic />
      </IconButton>
    </div>
  );
}
