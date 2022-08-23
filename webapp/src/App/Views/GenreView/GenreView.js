import "./GenreView.scss";
import React, { Fragment, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { ContextPlayer } from "../../../Context/ContextPlayer";
import {
  AvatarHeader,
  Divider,
  ListRender,
  AddListModal,
  Spinner,
} from "../../../Components";
import {
  getGenre,
  getTracksByAlbum,
  addToPlaylist,
  addToAlbumlist,
  getTracksByGenre,
  getDownloadAlbumUrl,
} from "../../../Services/api";
import { download } from "../../../Helpers";

export const GenreView = function () {
  const navigate = useNavigate();
  const params = useParams();
  const { addTracksAndPlay, addTracks } = useContext(ContextPlayer);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [modalType, setModalType] = useState("playlist");

  const { isLoading, data: genre } = useQuery(["genre", params.id], () =>
    getGenre(params.id)
  );

  const refId = useRef();

  const onPlayAlbum = async (id) => {
    const tracks = await getTracksByAlbum(id);
    addTracksAndPlay(tracks);
  };

  const onQueueAlbum = async (id) => {
    const tracks = await getTracksByAlbum(id);
    addTracks(tracks);
  };

  const onOpenListModal = (type, id) => {
    refId.current = id;
    setModalType(type);
    setIsPlaylistModalOpen(true);
  };

  const onSave = async (name) => {
    setIsPlaylistModalOpen(false);
    if (modalType === "playlist") {
      const tracks = await getTracksByAlbum(refId.current);
      await addToPlaylist(name, tracks);
    } else {
      await addToAlbumlist(name, refId.current);
    }
  };

  const onPlay = async () => {
    const tracks = await getTracksByGenre(params.id);
    addTracksAndPlay(tracks);
  };

  const onQueue = async () => {
    const tracks = await getTracksByGenre(params.id);
    addTracks(tracks);
  };

  const onDownloadAlbum = (id) => {
    download(getDownloadAlbumUrl(id));
  };

  return (
    <div className={clsx("GenreView", { isLoading })}>
      {isLoading && <Spinner size={32} />}
      {!isLoading && (
        <Fragment>
          <AddListModal
            type={modalType}
            isOpen={isPlaylistModalOpen}
            onClose={() => setIsPlaylistModalOpen(false)}
            onSave={onSave}
          />

          <AvatarHeader
            className="header"
            type="genre"
            name={genre.name}
            onPlay={onPlay}
            onQueue={onQueue}
          />

          <Divider />

          <ListRender
            className="list"
            list={genre.albums}
            type="box"
            title="name"
            subtitle="artist"
            onOpen={(id) => navigate(`/album/${id}`)}
            onPlay={onPlayAlbum}
            onQueue={onQueueAlbum}
            onAddToPlaylist={(id) => onOpenListModal("playlist", id)}
            onAddToAlbumlist={(id) => onOpenListModal("albumlist", id)}
            onDownload={(id) => onDownloadAlbum(id)}
          />
        </Fragment>
      )}
    </div>
  );
};
