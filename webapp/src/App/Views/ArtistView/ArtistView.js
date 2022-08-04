import "./ArtistView.scss";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AvatarHeader, Divider, ListRender } from "../../../Components";
import * as api from "../../../Services/api";

export const ArtistView = function () {
  const navigate = useNavigate();
  const params = useParams();
  const [artist, setArtist] = useState();

  useEffect(() => {
    const getArtist = async (name) => {
      const artist = await api.getArtist(name);
      setArtist(artist);
    };

    getArtist(params.name);
  }, [params.name]);

  return (
    <div className="ArtistView">
      {artist && (
        <Fragment>
          <AvatarHeader className="header" type="artist" name={artist.name} />
          <Divider />
          <ListRender
            className="list"
            list={artist.albums}
            type="box"
            title="name"
            subtitle="year"
            id="id"
            onClick={(album) => navigate(`/album/${album.id}`)}
          />
        </Fragment>
      )}
    </div>
  );
};
