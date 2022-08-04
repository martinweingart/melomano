import { Fragment, useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ContextPlayer } from "../../../Context/ContextPlayer";
import {
  getArtists,
  getTracksByArtist,
  addToPlaylist,
} from "../../../Services/api";
import { ListView } from "../ListView/ListView";
import { AddListModal } from "../../../Components";

export const ArtistsView = function () {
  const navigate = useNavigate();
  const { addTracksAndPlay } = useContext(ContextPlayer);
  const [list, setList] = useState([]);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const refId = useRef();

  useEffect(() => {
    const getList = async () => {
      const list = await getArtists();
      setList(list);
    };

    getList();
  }, []);

  const onPlay = async (name) => {
    const tracks = await getTracksByArtist(name);
    addTracksAndPlay(tracks);
  };

  const onAddToPlaylist = async (name) => {
    setIsPlaylistModalOpen(false);
    const tracks = await getTracksByArtist(refId.current);
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
        onClick={(artist) => navigate(`/artist/${artist.name}`)}
        onPlay={onPlay}
        onAddToPlaylist={(id) => {
          setIsPlaylistModalOpen(true);
          refId.current = id;
        }}
      />
    </Fragment>
  );
};
