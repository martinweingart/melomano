import "./AlbumlistView.scss";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AvatarHeader, Divider, ListRender } from "../../../Components";
import * as api from "../../../Services/api";

export const AlbumlistView = function () {
  const navigate = useNavigate();
  const params = useParams();
  const [albumlist, setAlbumlist] = useState();

  useEffect(() => {
    const getAlbumlist = async (name) => {
      const albumlist = await api.getAlbumlist(name);
      setAlbumlist(albumlist);
    };

    getAlbumlist(params.name);
  }, [params.name]);

  const onRemove = async () => {
    await api.removeAlbumlist(albumlist.name);
    navigate("/", { replace: true });
  };

  return (
    <div className="AlbumlistView">
      {albumlist && (
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
            id="id"
            onClick={(album) => navigate(`/album/${album.id}`)}
          />
        </Fragment>
      )}
    </div>
  );
};
