import "./GenreView.scss";
import { Fragment, useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ContextPlayer } from "../../../Context/ContextPlayer";
import {
  AvatarHeader,
  Divider,
  ListRender,
  AddListModal,
} from "../../../Components";
import * as api from "../../../Services/api";

export const GenreView = function () {
  const navigate = useNavigate();
  const params = useParams();
  const { addTracksAndPlay } = useContext(ContextPlayer);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [modalType, setModalType] = useState("playlist");
  const [genre, setGenre] = useState();

  const refId = useRef();

  useEffect(() => {
    const getGenre = async (name) => {
      const genre = await api.getGenre(name);
      setGenre(genre);
    };

    getGenre(params.name);
  }, [params.name]);

  const onPlay = async (id) => {
    const tracks = await api.getTracksByAlbum(id);
    addTracksAndPlay(tracks);
  };

  const onOpenListModal = (type, id) => {
    refId.current = id;
    setModalType(type);
    setIsPlaylistModalOpen(true);
  };

  const onSave = async (name) => {
    setIsPlaylistModalOpen(false);
    if (modalType === "playlist") {
      const tracks = await api.getTracksByAlbum(refId.current);
      await api.addToPlaylist(name, tracks);
    } else {
      await api.addToAlbumlist(name, refId.current);
    }
  };

  return (
    <div className="GenreView">
      {genre && (
        <Fragment>
          <AddListModal
            type={modalType}
            isOpen={isPlaylistModalOpen}
            onClose={() => setIsPlaylistModalOpen(false)}
            onSave={onSave}
          />

          <AvatarHeader
            className="GenreView-header"
            type="genre"
            name={genre.name}
          />

          <Divider />

          <ListRender
            className="GenreView-albums"
            list={genre.albums}
            type="box"
            title="name"
            subtitle="artist"
            id="id"
            onClick={(album) => navigate(`/album/${album.id}`)}
            onPlay={onPlay}
            onAddToPlaylist={(id) => onOpenListModal("playlist", id)}
            onAddToAlbumlist={(id) => onOpenListModal("albumlist", id)}
          />
        </Fragment>
      )}
    </div>
  );
};
