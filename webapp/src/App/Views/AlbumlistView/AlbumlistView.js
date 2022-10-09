import "./AlbumlistView.scss";
import React, { Fragment, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ContextPlayer } from "../../../Context/ContextPlayer";
import {
  AvatarHeader,
  Divider,
  ListRender,
  Spinner,
} from "../../../Components";
import {
  getAlbumlist,
  removeAlbumlist,
  updateAlbumlist,
  getDownloadAlbumUrl,
  getTracksByAlbum,
} from "../../../Services/api";
import { download } from "../../../Helpers";

export const AlbumlistView = function () {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();
  const { addTracksAndPlay, addTracks } = useContext(ContextPlayer);

  const { isLoading, data: albumlist } = useQuery(
    ["albumlist", params.id],
    () => getAlbumlist(params.id)
  );

  const onPlay = async (id) => {
    const tracks = await getTracksByAlbum(id);
    addTracksAndPlay(tracks);
  };

  const onQueue = async (id) => {
    const tracks = await getTracksByAlbum(id);
    addTracks(tracks);
  };

  const onRemove = async () => {
    await removeAlbumlist(params.id);
    navigate("/", { replace: true });
  };

  const onRemoveAlbum = async (id) => {
    const albums = albumlist.albums.filter((a) => a.id !== id);

    await updateAlbumlist(params.id, {
      name: albumlist.name,
      albums: albums.map((a) => a.id),
    });

    queryClient.setQueryData(["albumlist", params.id], {
      name: albumlist.name,
      albums,
    });
  };

  const onDownloadAlbum = (id) => {
    download(getDownloadAlbumUrl(id));
  };

  return (
    <div className={clsx("AlbumlistView", { isLoading })}>
      {isLoading && <Spinner size={32} />}
      {!isLoading && (
        <Fragment>
          <AvatarHeader
            className="header"
            type="albumlist"
            name={albumlist.name}
            onRemove={onRemove}
          />

          <Divider />

          <ListRender
            className="list"
            list={albumlist.albums}
            type="box"
            title="name"
            subtitle="artist"
            onOpen={(id) => navigate(`/album/${id}`)}
            onQueue={onQueue}
            onPlay={onPlay}
            onRemove={onRemoveAlbum}
            onDownload={(id) => onDownloadAlbum(id)}
          />
        </Fragment>
      )}
    </div>
  );
};
