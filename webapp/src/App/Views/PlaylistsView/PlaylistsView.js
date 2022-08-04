import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../../Hooks/useQuery";
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
  const { loading, error, data, forceRefresh } = useQuery(getPlaylists);

  const onPlay = async (name) => {
    const tracks = await getTracksByPlaylist(name);
    addTracksAndPlay(tracks);
  };

  const onRemove = async (name) => {
    await removePlaylist(name);
    forceRefresh();
  };

  return (
    <ListView
      loading={loading}
      list={data}
      type="avatar"
      title="name"
      id="name"
      onOpen={(name) => navigate(`/playlist/${name}`)}
      onPlay={onPlay}
      onRemove={onRemove}
    />
  );
};
