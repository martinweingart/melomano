import "./FoldersView.scss";
import React, { Fragment, useContext, useState } from "react";
import clsx from "clsx";
import { MdArrowBack } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { Spinner, Folder, IconButton } from "../../../Components";
import { getFolders } from "../../../Services/api";
import { ContextPlayer } from "../../../Context/ContextPlayer";

export const FoldersView = function () {
  const { addTrack } = useContext(ContextPlayer);
  const { isLoading, data: folders } = useQuery(["folders"], () =>
    getFolders()
  );

  const [route, setRoute] = useState("");

  const onBack = () =>
    setRoute((route) => route.substring(0, route.lastIndexOf(".")));

  const onFolderClick = (name) =>
    setRoute((route) => (route.length === 0 ? name : `${route}.${name}`));

  const onAddTrack = (track) => {
    addTrack(track);
  };

  let folder;
  if (folders) {
    if (route.length === 0) {
      folder = folders.root;
    } else {
      folder = route
        .split(".")
        .reduce((prev, curr) => prev.folders[curr], folders.root);
    }
  }

  return (
    <div className={clsx("FoldersView", { isLoading })}>
      {isLoading && <Spinner size={32} />}

      {!isLoading && (
        <Fragment>
          <div className="FoldersView-header">
            <IconButton aria-label="Back" onClick={onBack}>
              <MdArrowBack />
            </IconButton>

            <span>{route.replace(/\./g, "/")}</span>
          </div>

          <Folder
            className="FoldersView-list"
            folder={folder}
            onFolderClick={onFolderClick}
            onAddTrack={onAddTrack}
          />
        </Fragment>
      )}
    </div>
  );
};
