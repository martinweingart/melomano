import { Fragment, useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../../Hooks/useQuery";
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
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const refId = useRef();

  const { loading, error, data } = useQuery(getGenres);

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
        loading={loading}
        list={data}
        type="avatar"
        title="name"
        id="name"
        onOpen={(name) => navigate(`/genre/${name}`)}
        onPlay={onPlay}
        onAddToPlaylist={(id) => {
          setIsPlaylistModalOpen(true);
          refId.current = id;
        }}
      />
    </Fragment>
  );
};
