import "./Folder.scss";
import React, { Fragment, useContext } from "react";
import clsx from "clsx";
import {
  MdFolderOpen,
  MdMusicNote,
  MdOutlinePlayCircleOutline,
  MdQueueMusic,
  MdPlaylistAdd,
} from "react-icons/md";
import { IconButton } from "../../Components";
import { ContextPlayer } from "../../Context/ContextPlayer";

export const Folder = ({ className, folder, onFolderClick, onAddTrack }) => {
  const { addTracksAndPlay, addTracks } = useContext(ContextPlayer);
  const onPlay = (files) => {
    addTracksAndPlay(files);
  };

  const onQueue = (files) => {
    addTracks(files);
  };

  return (
    <div className={clsx("Folder", className)}>
      {Object.keys(folder.folders).map((name) => {
        const files = folder.folders[name].files;

        return (
          <div className="item" key={name}>
            <div className="data" onClick={() => onFolderClick(name)}>
              <MdFolderOpen size={36} />
              <span>{name}</span>
            </div>

            <div className="controls">
              {files && files.length > 0 && (
                <Fragment>
                  <IconButton size={16} onClick={() => onPlay(files)}>
                    <MdOutlinePlayCircleOutline />
                  </IconButton>

                  <IconButton size={16} onClick={() => onQueue(files)}>
                    <MdQueueMusic />
                  </IconButton>
                </Fragment>
              )}
            </div>
          </div>
        );
      })}

      {folder.files && folder.files.length > 0 && (
        <ul className="files">
          {folder.files.map((file) => (
            <li
              className="file"
              key={file.$loki}
              onClick={() => onAddTrack(file)}
            >
              <div>
                <MdMusicNote size={20} />
              </div>
              <span>{file.filepath}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
