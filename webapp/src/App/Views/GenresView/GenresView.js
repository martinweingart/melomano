import { Fragment, useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ContextPlayer } from "../../../Context/ContextPlayer";
import {
  getTracksByGenre,
  getGenres,
  addToPlaylist,
} from "../../../Services/api";
import { ListView } from "../ListView/ListView";
import { AddListModal } from "../../../Components";

export const GenresView = function () {
  const navigate = useNavigate();
  const { addTracksAndPlay } = useContext(ContextPlayer);
  const [list, setList] = useState([]);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const refId = useRef();

  useEffect(() => {
    const getList = async () => {
      const list = await getGenres();
      setList(list);
    };

    getList();
  }, []);

  const onPlay = async (name) => {
    const tracks = await getTracksByGenre(name);
    addTracksAndPlay(tracks);
  };

  const onAddToPlaylist = async (name) => {
    setIsPlaylistModalOpen(false);
    const tracks = await getTracksByGenre(refId.current);
    await addToPlaylist(name, tracks);
  };

  return (
    <Fragment>
      <AddListModal
        type="playlist"
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        onSave={onAddToPlaylist}
      />
      <ListView
        list={list}
        type="avatar"
        title="name"
        id="name"
        onClick={(genre) => navigate(`/genre/${genre.name}`)}
        onPlay={onPlay}
        onAddToPlaylist={(id) => {
          setIsPlaylistModalOpen(true);
          refId.current = id;
        }}
      />
    </Fragment>
  );
};
