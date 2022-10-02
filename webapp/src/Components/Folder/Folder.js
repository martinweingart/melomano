import "./Folder.scss";
import React from "react";
import clsx from "clsx";
import { MdFolderOpen, MdMusicNote } from "react-icons/md";

export const Folder = ({ className, folder, onFolderClick, onAddTrack }) => {
  return (
    <div className={clsx("Folder", className)}>
      {Object.keys(folder.folders).map((name) => (
        <div className="item" key={name} onClick={() => onFolderClick(name)}>
          <MdFolderOpen size={36} />
          <span>{name}</span>
        </div>
      ))}

      {folder.files && folder.files.length > 0 && (
        <ul className="files">
          {folder.files.map((file) => (
            <li
              className="item"
              key={file.$loki}
              onClick={() => onAddTrack(file)}
            >
              <MdMusicNote />
              <span>{file.filepath}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
