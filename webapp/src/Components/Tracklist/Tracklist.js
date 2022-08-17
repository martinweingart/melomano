import "./Tracklist.scss";
import React, { Fragment, useContext } from "react";
import { MdClose, MdPlaylistAdd } from "react-icons/md";
import clsx from "clsx";
import { Divider, IconButton } from "../../Components";
import { ContextPlayer } from "../../Context/ContextPlayer";
import { getDuration } from "../../Helpers";

export const Tracklist = function ({
  className = "",
  tracks,
  onAddToPlaylist,
  onRemove,
}) {
  const { addTrack } = useContext(ContextPlayer);

  return (
    <ul className={clsx("Tracklist", className)}>
      {tracks.map((track, index) => (
        <Fragment key={track.id}>
          <li className="Tracklist-item">
            <div
              className="Tracklist-item-info"
              onClick={() => addTrack(track)}
            >
              <div className="Tracklist-item-number">{track.track}</div>
              <div className="Tracklist-item-title">{track.title}</div>
              <div className="Tracklist-item-duration">
                {getDuration(track.duration)}
              </div>
            </div>

            {onAddToPlaylist && (
              <IconButton size={16} onClick={() => onAddToPlaylist(track)}>
                <MdPlaylistAdd />
              </IconButton>
            )}

            {onRemove && (
              <IconButton size={16} onClick={() => onRemove(track, index)}>
                <MdClose />
              </IconButton>
            )}
          </li>

          {index < tracks.length - 1 && <Divider />}
        </Fragment>
      ))}
    </ul>
  );
};
