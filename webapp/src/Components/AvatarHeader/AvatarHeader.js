import "./AvatarHeader.scss";
import { useContext } from "react";
import clsx from "clsx";
import {
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
  onClick,
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
    console.log(tracks);
    addTracksAndPlay(tracks);
  };

  return (
    <div className={clsx("AvatarHeader", className)}>
      <div className="AvatarHeader-content">
        <Avatar name={name} onClick={onClick} />

        <span className="AvatarHeader-name">{name}</span>
      </div>

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
