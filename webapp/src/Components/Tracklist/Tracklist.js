import "./Tracklist.scss";
import React, { Fragment, useContext } from "react";
import clsx from "clsx";
import {
  MdClose,
  MdPlaylistAdd,
  MdDownload,
  MdOutlineFormatColorText,
} from "react-icons/md";
import { Divider, IconButton } from "../../Components";
import { ContextPlayer } from "../../Context/ContextPlayer";
import { download, getDuration, openGoogleSearch } from "../../Helpers";
import { getTrackUrl } from "../../Services/media";

export const Tracklist = function ({
  className = "",
  tracks,
  numberType = "track",
  onAddToPlaylist,
  onRemove,
}) {
  const { addTrack } = useContext(ContextPlayer);

  const onFindLyrics = (track) => {
    openGoogleSearch(`${track.artist} ${track.title} lyrics`);
  };

  const onDownload = (track) => {
    download(getTrackUrl(track.id));
  };

  return (
    <ul className={clsx("Tracklist", className)}>
      {tracks.map((track, index) => (
        <Fragment key={track.id}>
          <li className="Tracklist-item">
            <div
              className="Tracklist-item-info"
              onClick={() => addTrack(track)}
            >
              <div className="Tracklist-item-number">
                {numberType === "track" ? track.track : index + 1}
              </div>
              <div className="Tracklist-item-title">{track.title}</div>
              <div className="Tracklist-item-duration">
                {getDuration(track.duration)}
              </div>
            </div>

            <div className="Tracklist-actions">
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

              <IconButton size={16} onClick={() => onFindLyrics(track)}>
                <MdOutlineFormatColorText />
              </IconButton>

              <IconButton size={16} onClick={() => onDownload(track)}>
                <MdDownload />
              </IconButton>
            </div>
          </li>

          {index < tracks.length - 1 && <Divider />}
        </Fragment>
      ))}
    </ul>
  );
};
