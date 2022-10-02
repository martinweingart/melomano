import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ContextPlayer } from "../../../Context/ContextPlayer";
import {
  getPlaylists,
  getTracksByPlaylist,
  removePlaylist,
} from "../../../Services/api";
import { ListView } from "../ListView/ListView";

export const PlaylistsView = function () {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addTracks, addTracksAndPlay } = useContext(ContextPlayer);
  const [filter, setFilter] = useState("");

  const { isLoading, data } = useQuery(["playlists", { filter }], () =>
    getPlaylists({ filter })
  );

  const onPlay = async (name) => {
    const tracks = await getTracksByPlaylist(name);
    addTracksAndPlay(tracks);
  };

  const onQueue = async (name) => {
    const tracks = await getTracksByPlaylist(name);
    addTracks(tracks);
  };

  const onRemove = async (id) => {
    await removePlaylist(id);
    queryClient.invalidateQueries(["playlists"]);
  };

  return (
    <ListView
      loading={isLoading}
      list={data || []}
      type="avatar"
      title="name"
      filter={filter}
      onFilter={(value) => setFilter(value)}
      onOpen={(name) => navigate(`/playlist/${name}`)}
      onPlay={onPlay}
      onQueue={onQueue}
      onRemove={onRemove}
    />
  );
};
