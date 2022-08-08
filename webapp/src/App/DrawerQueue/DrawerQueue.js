import "./DrawerQueue.scss";
import { useContext, Fragment, useState } from "react";
import clsx from "clsx";
import { MdClose, MdDelete, MdHeadsetOff } from "react-icons/md";
import { Drawer, Divider, IconButton, Spinner } from "../../Components";
import { ContextPlayer } from "../../Context/ContextPlayer";
import { getDuration } from "../../Helpers";

export const DrawerQueue = function ({ isOpen, onClose }) {
  const {
    queue,
    currentTrackIndex,
    removeTrack,
    onChangeTrackIndex,
    clearQueue,
  } = useContext(ContextPlayer);

  const [isLoading, setIsLoading] = useState(false);

  const onRemoveTrack = async (index) => {
    setIsLoading(true);
    await removeTrack(index);
    setIsLoading(false);
  };

  const onClear = () => {
    clearQueue();
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} position="right">
      <div className={clsx("DrawerQueue-content", { isLoading })}>
        <div className="DrawerQueue-header">
          {queue.length > 0 && (
            <IconButton
              size={24}
              aria-label="Close Nav Drawer"
              onClick={onClear}
            >
              <MdDelete />
            </IconButton>
          )}

          <h3>Now Playing</h3>

          <IconButton size={24} aria-label="Close Nav Drawer" onClick={onClose}>
            <MdClose />
          </IconButton>
        </div>

        {isLoading && <Spinner size={32} />}
        {!isLoading && (
          <Fragment>
            {queue.length === 0 && (
              <div className="empty">
                <MdHeadsetOff size={32} />
                <p>Empty queue</p>
              </div>
            )}

            {queue.length > 0 && (
              <Fragment>
                <ul className="DrawerQueue-tracklist">
                  {queue.map((track, index) => (
                    <Fragment key={track.id}>
                      <li
                        className={clsx("DrawerQueue-tracklist-item", {
                          isActive: index === currentTrackIndex,
                        })}
                      >
                        <div
                          className="DrawerQueue-tracklist-item-info"
                          onClick={() => onChangeTrackIndex(index)}
                        >
                          <div className="DrawerQueue-tracklist-item-title">
                            {track.title}
                          </div>
                          <div className="DrawerQueue-tracklist-item-duration">
                            {getDuration(track.duration)}
                          </div>
                        </div>

                        <div className="DrawerQueue-tracklist-item-action">
                          <IconButton
                            size={18}
                            onClick={() => onRemoveTrack(index)}
                          >
                            <MdDelete />
                          </IconButton>
                        </div>
                      </li>

                      {index < queue.length - 1 && <Divider />}
                    </Fragment>
                  ))}
                </ul>
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    </Drawer>
  );
};
