import "./ListRenderItem.scss";
import clsx from "clsx";
import {
  MdArrowForward,
  MdOutlinePlayCircleOutline,
  MdPlaylistAdd,
  MdAlbum,
  MdClose,
} from "react-icons/md";
import noAlbum from "../../../Images/album.jpg";
import { Avatar, IconButton } from "../../Base";

export function ListRenderItem({
  id,
  type,
  title,
  subtitle,
  image,
  onOpen,
  onPlay,
  onAddToPlaylist,
  onAddToAlbumlist,
  onRemove,
}) {
  const isAvatar = type === "avatar";

  return (
    <li className={clsx("ListRenderItem", { isAvatar })}>
      {isAvatar ? (
        <Avatar name={title} />
      ) : (
        <img src={image || noAlbum} alt={title} />
      )}

      <div className="ListRenderItem-content">
        <div className="ListRenderItem-info">
          <span className="ListRenderItem-title">{title}</span>
          <span className="ListRenderItem-subtitle">{subtitle}</span>
        </div>

        <div className="ListRenderItem-controls">
          {onOpen && (
            <IconButton size={16} onClick={() => onOpen(id)}>
              <MdArrowForward />
            </IconButton>
          )}

          {onPlay && (
            <IconButton size={16} onClick={() => onPlay(id)}>
              <MdOutlinePlayCircleOutline />
            </IconButton>
          )}

          {onAddToPlaylist && (
            <IconButton size={16} onClick={() => onAddToPlaylist(id)}>
              <MdPlaylistAdd />
            </IconButton>
          )}

          {onAddToAlbumlist && (
            <IconButton size={16} onClick={() => onAddToAlbumlist(id)}>
              <MdAlbum />
            </IconButton>
          )}

          {onRemove && (
            <IconButton size={16} onClick={() => onRemove(id)}>
              <MdClose />
            </IconButton>
          )}
        </div>
      </div>
    </li>
  );
}
