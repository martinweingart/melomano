import { Fragment, useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ContextPlayer } from "../../../Context/ContextPlayer";
import { ListView } from "../ListView/ListView";
import { AddListModal } from "../../../Components";
import {
  getAlbums,
  getTracksByAlbum,
  addToPlaylist,
  addToAlbumlist,
} from "../../../Services/api";

export const AlbumsView = function () {
  const navigate = useNavigate();
  const { addTracksAndPlay } = useContext(ContextPlayer);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [modalType, setModalType] = useState("playlist");
  const [list, setList] = useState([]);

  useEffect(() => {
    const getList = async () => {
      const list = await getAlbums();
      setList(list);
    };

    getList();
  }, []);

  const refId = useRef();

  const onPlay = async (id) => {
    const tracks = await getTracksByAlbum(id);
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
      const tracks = await getTracksByAlbum(refId.current);
      await addToPlaylist(name, tracks);
    } else {
      await addToAlbumlist(name, refId.current);
    }
  };

  return (
    <Fragment>
      <AddListModal
        type={modalType}
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        onSave={onSave}
      />

      <ListView
        list={list}
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
  );
};
