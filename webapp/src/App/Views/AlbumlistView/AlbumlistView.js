import "./AlbumlistView.scss";
import React, { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import {
  AvatarHeader,
  Divider,
  ListRender,
  Spinner,
} from "../../../Components";
import { getAlbumlist, removeAlbumlist } from "../../../Services/api";

export const AlbumlistView = function () {
  const navigate = useNavigate();
  const params = useParams();

  const { isLoading, data: albumlist } = useQuery(
    ["albumlist", params.id],
    () => getAlbumlist(params.id)
  );

  const onRemove = async () => {
    await removeAlbumlist(albumlist.name);
    navigate("/", { replace: true });
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
          />
        </Fragment>
      )}
    </div>
  );
};
