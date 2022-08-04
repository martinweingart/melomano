import "./AlbumHeader.scss";
import { Fragment, useContext, useState } from "react";
import clsx from "clsx";
import {
  MdArrowForward,
  MdOutlinePlayCircleOutline,
  MdPlaylistAdd,
  MdAlbum,
} from "react-icons/md";
import noAlbum from "../../Images/album.jpg";
import { getImageUrl } from "../../Services/media";
import { IconButton } from "../Base";
import { AddListModal } from "../AddListModal/AddListModal";
import {
  getTracksByAlbum,
  addToPlaylist,
  addToAlbumlist,
} from "../../Services/api";
import { ContextPlayer } from "../../Context/ContextPlayer";

export const AlbumHeader = function ({
  className,
  id,
  name,
  artist,
  year,
  genres,
  image,
  onOpen,
}) {
  const { addTracksAndPlay } = useContext(ContextPlayer);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [modalType, setModalType] = useState("playlist");

  const hasYearAndGenres = genres && genres.length > 0 && year;

  const onPlay = async () => {
    const tracks = await getTracksByAlbum(id);
    addTracksAndPlay(tracks);
  };

  const onSave = async (name) => {
    setIsPlaylistModalOpen(false);
    if (modalType === "playlist") {
      const tracks = await getTracksByAlbum(id);
      await addToPlaylist(name, tracks);
    } else {
      await addToAlbumlist(name, id);
    }
  };

  return (
    <Fragment>
      <AddListModal
        type={modalType}
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        onSave={onSave}
      />

      <div className={clsx("AlbumHeader", className)}>
        <div className="AlbumHeader-content">
          <img src={getImageUrl(image) || noAlbum} alt={name} />

          <div className="AlbumHeader-info">
            <span className="AlbumHeader-info-name">{name}</span>
            <span className="AlbumHeader-info-sm">{artist}</span>
            <p className="AlbumHeader-info-xs">
              {year && <span>{year}</span>}
              {hasYearAndGenres && " - "}
              {genres && genres.length > 0 && <span>{genres.join(", ")}</span>}
            </p>
          </div>
        </div>

        <div className="AlbumHeader-controls">
          {onOpen && (
            <IconButton label="Open" size={16} fontSize={10} onClick={onOpen}>
              <MdArrowForward />
            </IconButton>
          )}

          <IconButton label="Play" size={16} fontSize={10} onClick={onPlay}>
            <MdOutlinePlayCircleOutline />
          </IconButton>

          <IconButton
            label="Add to playlist"
            size={16}
            fontSize={10}
            onClick={() => {
              setModalType("playlist");
              setIsPlaylistModalOpen(true);
            }}
          >
            <MdPlaylistAdd />
          </IconButton>

          <IconButton
            label="Add to albumlist"
            size={16}
            fontSize={10}
            onClick={() => {
              setModalType("albumlist");
              setIsPlaylistModalOpen(true);
            }}
          >
            <MdAlbum />
          </IconButton>
        </div>
      </div>
    </Fragment>
  );
};
