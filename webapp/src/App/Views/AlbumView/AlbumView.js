import "./AlbumView.scss";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AlbumHeader,
  Tracklist,
  Divider,
  AddListModal,
} from "../../../Components";
import * as api from "../../../Services/api";

export const AlbumView = function () {
  const params = useParams();
  const [album, setAlbum] = useState();
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState();

  useEffect(() => {
    const getAlbum = async (id) => {
      const album = await api.getAlbum(id);
      setAlbum(album);
    };

    getAlbum(params.albumid);
  }, [params.albumid]);

  const onAddToPlaylist = async (name) => {
    setIsPlaylistModalOpen(false);
    await api.addToPlaylist(name, [selectedTrack]);
  };

  return (
    <div className="AlbumView">
      <AddListModal
        type="playlist"
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        onSave={onAddToPlaylist}
      />

      {album && (
        <Fragment>
          <AlbumHeader className="header" {...album} />
          <Divider />
          <Tracklist
            className="list"
            tracks={album.tracks}
            onAddToPlaylist={(track) => {
              setIsPlaylistModalOpen(true);
              setSelectedTrack(track);
            }}
          />
        </Fragment>
      )}
    </div>
  );
};
