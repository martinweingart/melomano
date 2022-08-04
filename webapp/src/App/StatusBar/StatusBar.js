import "./StatusBar.scss";
import { Fragment, useContext } from "react";
import clsx from "clsx";
import { ContextPlayer } from "../../Context/ContextPlayer";
import { getDuration } from "../../Helpers";

export function StatusBar() {
  const { queue, currentTrackIndex, currentTime } = useContext(ContextPlayer);
  const currentTrack = queue[currentTrackIndex];

  const porcentage = currentTrack
    ? 100 - (currentTime * 100) / currentTrack.duration
    : 100;

  const style = currentTrack
    ? {
        background: `linear-gradient(to left, rgba(0, 0, 0, 0) ${porcentage}%, #97aabd ${porcentage}%)`,
      }
    : {};

  return (
    <div
      className={clsx("StatusBar", { isEmpty: !currentTrack })}
      style={style}
    >
      {currentTrack && (
        <Fragment>
          <span>{currentTrack.title}</span>
          <span>{getDuration(currentTrack.duration - currentTime)}</span>
        </Fragment>
      )}
    </div>
  );
}
