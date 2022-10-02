import "./HomeView.scss";
import React, {
  Fragment,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  AlbumHeader,
  ListRender,
  AddListModal,
  Spinner,
} from "../../../Components";
import * as api from "../../../Services/api";
import { ContextPlayer } from "../../../Context/ContextPlayer";
import { download } from "../../../Helpers";

export const HomeView = function () {
  const navigate = useNavigate();
  const { addTracksAndPlay, addTracks } = useContext(ContextPlayer);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [modalType, setModalType] = useState("playlist");
  const [album, setAlbum] = useState();
  const [recent, setRecent] = useState([]);

  const refId = useRef();

  useEffect(() => {
    const getData = async () => {
      const album = await api.getAlbum("random");
      const recent = await api.getRecent();
      setRecent(recent);
      setAlbum(album);
      setIsLoading(false);
    };

    getData();
  }, []);

  const onPlay = async (id) => {
    const tracks = await api.getTracksByAlbum(id);
    addTracksAndPlay(tracks);
  };

  const onQueue = async (id) => {
    const tracks = await api.getTracksByAlbum(id);
    addTracks(tracks);
  };

  const onOpenListModal = (type, id) => {
    refId.current = id;
    setModalType(type);
    setIsPlaylistModalOpen(true);
  };

  const onSave = async (name) => {
    setIsPlaylistModalOpen(false);
    if (modalType === "playlist") {
      const tracks = await api.getTracksByAlbum(refId.current);
      await api.addToPlaylist(name, tracks);
    } else {
      await api.addToAlbumlist(name, refId.current);
    }
  };

  const onDownloadAlbum = (id) => {
    download(api.getDownloadAlbumUrl(id));
  };

  return (
    <Fragment>
      <AddListModal
        type={modalType}
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        onSave={onSave}
      />

      <div className={clsx("HomeView", { isLoading })}>
        {isLoading && <Spinner size={32} />}
        {!isLoading && (
          <Fragment>
            <div className="HomeView-header">
              <h4>Check this album!</h4>
              <AlbumHeader
                {...album}
                onOpen={() => navigate(`/album/${album.id}`)}
              />
            </div>

            <div className="HomeView-recent">
              <h3>Recently added</h3>

              <ListRender
                className="HomeView-recent-list"
                list={recent}
                type="box"
                title="name"
                subtitle="artist"
                onOpen={(id) => navigate(`/album/${id}`)}
                onPlay={onPlay}
                onQueue={onQueue}
                onAddToPlaylist={(id) => onOpenListModal("playlist", id)}
                onAddToAlbumlist={(id) => onOpenListModal("albumlist", id)}
                onDownload={(id) => onDownloadAlbum(id)}
              />
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};
