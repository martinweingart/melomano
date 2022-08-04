import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContextPlayer } from "../../../Context/ContextPlayer";
import {
  getPlaylists,
  getTracksByPlaylist,
  removePlaylist,
} from "../../../Services/api";
import { ListView } from "../ListView/ListView";

export const PlaylistsView = function () {
  const navigate = useNavigate();
  const { addTracksAndPlay } = useContext(ContextPlayer);
  const [list, setList] = useState([]);

  useEffect(() => {
    const getList = async () => {
      const list = await getPlaylists();
      setList(list);
    };

    getList();
  }, []);

  const onPlay = async (name) => {
    const tracks = await getTracksByPlaylist(name);
    addTracksAndPlay(tracks);
  };

  const onRemove = async (name) => {
    await removePlaylist(name);
    const list = await getPlaylists();
    setList(list);
  };

  return (
    <ListView
      list={list}
      type="avatar"
      title="name"
      id="name"
      onClick={(playlist) => navigate(`/playlist/${playlist.name}`)}
      onPlay={onPlay}
      onRemove={onRemove}
    />
  );
};
