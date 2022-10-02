import "./AlbumView.scss";
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import {
  AlbumHeader,
  Tracklist,
  Divider,
  AddListModal,
  Spinner,
} from "../../../Components";
import { getAlbum, addToPlaylist } from "../../../Services/api";

export const AlbumView = function () {
  const params = useParams();
  const queryClient = useQueryClient();
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState();

  const { isLoading, data: album } = useQuery(["album", params.albumid], () =>
    getAlbum(params.albumid)
  );

  const onAddToPlaylist = async (name) => {
    setIsPlaylistModalOpen(false);
    const isNewPlaylist = await addToPlaylist(name, [selectedTrack]);
    if (isNewPlaylist) {
      queryClient.setQueryData(["playlists"], (oldList) => [
        ...oldList,
        { name },
      ]);
    }
  };

  return (
    <div className={clsx("AlbumView", { isLoading })}>
      <AddListModal
        type="playlist"
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        onSave={onAddToPlaylist}
      />

      {isLoading && <Spinner size={32} />}
      {!isLoading && (
        <Fragment>
          <AlbumHeader className="header" {...album} />
          <Divider />
          <Tracklist
            className="list"
            tracks={album.tracks}
            onAddToPlaylist={(track) => {
              setIsPlaylistModalOpen(true);
              setSelectedTrack(track);
            }}
          />
        </Fragment>
      )}
    </div>
  );
};
