import "./ArtistView.scss";
import { Fragment, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import {
  AvatarHeader,
  Divider,
  ListRender,
  Spinner,
} from "../../../Components";
import { ContextPlayer } from "../../../Context/ContextPlayer";
import {
  getArtist,
  getTracksByArtist,
  getTracksByGenre,
} from "../../../Services/api";

export const ArtistView = function () {
  const navigate = useNavigate();
  const params = useParams();
  const { addTracksAndPlay } = useContext(ContextPlayer);

  const { isLoading, data: artist } = useQuery(["artist", params.id], () =>
    getArtist(params.id)
  );

  const onPlay = async () => {
    const tracks = await getTracksByArtist(params.id);
    addTracksAndPlay(tracks);
  };

  return (
    <div className={clsx("ArtistView", { isLoading })}>
      {isLoading && <Spinner size={32} />}
      {!isLoading && (
        <Fragment>
          <AvatarHeader
            className="header"
            type="artist"
            name={artist.name}
            onPlay={onPlay}
          />
          <Divider />
          <ListRender
            className="list"
            list={artist.albums}
            type="box"
            title="name"
            subtitle="year"
            onOpen={(id) => navigate(`/album/${id}`)}
          />
        </Fragment>
      )}
    </div>
  );
};
