import "./AvatarHeader.scss";
import clsx from "clsx";
import {
  MdArrowForward,
  MdOutlinePlayCircleOutline,
  MdOutlineDeleteForever,
  MdQueueMusic,
} from "react-icons/md";
import { IconButton, Avatar } from "../Base";

export const AvatarHeader = function ({
  className,
  name,
  onOpen,
  onPlay,
  onQueue,
  onRemove,
}) {
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

      {onPlay && (
        <IconButton label="Play" size={16} fontSize={10} onClick={onPlay}>
          <MdOutlinePlayCircleOutline />
        </IconButton>
      )}

      {onQueue && (
        <IconButton
          label="Add to queue"
          size={16}
          fontSize={10}
          onClick={onQueue}
        >
          <MdQueueMusic />
        </IconButton>
      )}

      {onRemove && (
        <IconButton label="Remove" size={16} fontSize={10} onClick={onRemove}>
          <MdOutlineDeleteForever />
        </IconButton>
      )}
    </div>
  );
};
