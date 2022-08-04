import "./PlaylistView.scss";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AvatarHeader, Divider, Tracklist } from "../../../Components";
import * as api from "../../../Services/api";
import { removeItemFromList } from "../../../Helpers";

export const PlaylistView = function () {
  const navigate = useNavigate();
  const params = useParams();
  const [playlist, setPlaylist] = useState();

  useEffect(() => {
    const getPlaylist = async (name) => {
      const playlist = await api.getPlaylist(name);
      setPlaylist(playlist);
    };

    getPlaylist(params.name);
  }, [params.name]);

  const onRemoveTrack = async (_track, index) => {
    const newPlaylist = {
      name: playlist.name,
      tracks: removeItemFromList(playlist.tracks, index),
    };

    await api.updatePlaylist(newPlaylist);
    setPlaylist(newPlaylist);
  };

  const onRemove = async () => {
    await api.removePlaylist(playlist.name);
    navigate("/", { replace: true });
  };

  return (
    <div className="PlaylistView">
      {playlist && (
        <Fragment>
          <AvatarHeader
            className="PlaylistView-header"
            type="playlist"
            name={playlist.name}
            onRemove={onRemove}
          />
          <Divider />
          <Tracklist
            className="PlaylistView-tracklist"
            tracks={playlist.tracks}
            onRemove={onRemoveTrack}
          />
        </Fragment>
      )}
    </div>
  );
};
