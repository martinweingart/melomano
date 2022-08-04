import { Fragment, useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../../Hooks/useQuery";
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
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const refId = useRef();

  const { loading, error, data } = useQuery(getArtists);

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
        loading={loading}
        list={data}
        type="avatar"
        title="name"
        id="name"
        onOpen={(name) => navigate(`/artist/${name}`)}
        onPlay={onPlay}
        onAddToPlaylist={(id) => {
          setIsPlaylistModalOpen(true);
          refId.current = id;
        }}
      />
    </Fragment>
  );
};
