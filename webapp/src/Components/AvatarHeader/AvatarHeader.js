import "./AvatarHeader.scss";
import { useContext } from "react";
import clsx from "clsx";
import {
  MdArrowForward,
  MdOutlinePlayCircleOutline,
  MdOutlineDeleteForever,
} from "react-icons/md";
import { IconButton, Avatar } from "../Base";
import { ContextPlayer } from "../../Context/ContextPlayer";
import { getTracksByArtist, getTracksByGenre } from "../../Services/api";

export const AvatarHeader = function ({
  className,
  type,
  name,
  onOpen,
  onRemove,
}) {
  const { addTracksAndPlay } = useContext(ContextPlayer);

  const onPlay = async () => {
    let tracks = [];
    if (type === "artist") {
      tracks = await getTracksByArtist(name);
    } else if (type === "genre") {
      tracks = await getTracksByGenre(name);
    }
    addTracksAndPlay(tracks);
  };

  return (
    <div className={clsx("AvatarHeader", className)}>
      <div className="AvatarHeader-content">
        <Avatar name={name} />

        <span className="AvatarHeader-name">{name}</span>
      </div>

      {onOpen && (
        <IconButton label="Open" size={16} fontSize={10} onClick={onOpen}>
          <MdArrowForward />
        </IconButton>
      )}

      <IconButton label="Play" size={16} fontSize={10} onClick={onPlay}>
        <MdOutlinePlayCircleOutline />
      </IconButton>

      {onRemove && (
        <IconButton label="Remove" size={16} fontSize={10} onClick={onRemove}>
          <MdOutlineDeleteForever />
        </IconButton>
      )}
    </div>
  );
};
