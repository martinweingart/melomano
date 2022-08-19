import "./PlaylistView.scss";
import React, { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { AvatarHeader, Divider, Tracklist, Spinner } from "../../../Components";
import {
  getPlaylist,
  removePlaylist,
  updatePlaylist,
} from "../../../Services/api";
import { removeItemFromList } from "../../../Helpers";

export const PlaylistView = function () {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();

  const { isLoading, data: playlist } = useQuery(["playlist", params.id], () =>
    getPlaylist(params.id)
  );

  const onRemoveTrack = async (_track, index) => {
    const newPlaylist = {
      name: playlist.name,
      tracks: removeItemFromList(playlist.tracks, index),
    };

    await updatePlaylist(params.id, newPlaylist);
    queryClient.setQueryData(["playlist", params.id], newPlaylist);
  };

  const onRemove = async () => {
    await removePlaylist(params.id);
    navigate("/", { replace: true });
  };

  return (
    <div className={clsx("PlaylistView", { isLoading })}>
      {isLoading && <Spinner size={32} />}
      {!isLoading && (
        <Fragment>
          <AvatarHeader
            className="header"
            type="playlist"
            name={playlist.name}
            onRemove={onRemove}
          />
          <Divider />
          <Tracklist
            className="list"
            tracks={playlist.tracks}
            onRemove={onRemoveTrack}
          />
        </Fragment>
      )}
    </div>
  );
};
