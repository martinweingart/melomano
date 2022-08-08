import "./ArtistView.scss";
import { Fragment, useState, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import {
  AvatarHeader,
  Divider,
  ListRender,
  Spinner,
  AddListModal,
} from "../../../Components";
import { ContextPlayer } from "../../../Context/ContextPlayer";
import {
  getArtist,
  getTracksByArtist,
  getTracksByAlbum,
} from "../../../Services/api";

export const ArtistView = function () {
  const navigate = useNavigate();
  const params = useParams();
  const { addTracks, addTracksAndPlay, addToPlaylist, addToAlbumlist } =
    useContext(ContextPlayer);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [modalType, setModalType] = useState("playlist");

  const refId = useRef();

  const { isLoading, data: artist } = useQuery(["artist", params.id], () =>
    getArtist(params.id)
  );

  const onPlay = async () => {
    const tracks = await getTracksByArtist(params.id);
    addTracksAndPlay(tracks);
  };

  const onQueue = async () => {
    const tracks = await getTracksByArtist(params.id);
    addTracks(tracks);
  };

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

  return (
    <div className={clsx("ArtistView", { isLoading })}>
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
            type="artist"
            name={artist.name}
            onPlay={onPlay}
            onQueue={onQueue}
          />

          <Divider />

          <ListRender
            className="list"
            list={artist.albums}
            type="box"
            title="name"
            subtitle="year"
            onOpen={(id) => navigate(`/album/${id}`)}
            onPlay={onPlayAlbum}
            onQueue={onQueueAlbum}
            onAddToPlaylist={(id) => onOpenListModal("playlist", id)}
            onAddToAlbumlist={(id) => onOpenListModal("albumlist", id)}
          />
        </Fragment>
      )}
    </div>
  );
};
