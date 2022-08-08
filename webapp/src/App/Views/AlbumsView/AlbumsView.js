import { Fragment, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { ContextPlayer } from "../../../Context/ContextPlayer";
import { ListView } from "../ListView/ListView";
import { AddListModal } from "../../../Components";
import {
  getAlbums,
  getTracksByAlbum,
  addToPlaylist,
  addToAlbumlist,
} from "../../../Services/api";

export const AlbumsView = function () {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addTracksAndPlay, addTracks } = useContext(ContextPlayer);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [modalType, setModalType] = useState("playlist");
  const [filter, setFilter] = useState("");

  const refId = useRef();

  const onPlay = async (id) => {
    const tracks = await getTracksByAlbum(id);
    addTracksAndPlay(tracks);
  };

  const onQueue = async (id) => {
    const tracks = await getTracksByAlbum(id);
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
      const tracks = await getTracksByAlbum(refId.current);
      const isNewPlaylist = await addToPlaylist(name, tracks);
      if (isNewPlaylist) {
        queryClient.setQueryData(["playlists"], (oldList) => [
          ...oldList,
          { name },
        ]);
      }
    } else {
      const isNewAlbumlist = await addToAlbumlist(name, refId.current);
      if (isNewAlbumlist) {
        queryClient.setQueryData(["albumlists"], (oldList) => [
          ...oldList,
          { name },
        ]);
      }
    }
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["albums", { filter }],
    ({ pageParam }) => getAlbums({ limit: 50, offset: pageParam || 0, filter }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (pages.length > 0 && pages[0].total > pages.length * 50)
          return pages.length * 50;
        else return undefined;
      },
    }
  );

  const onScrollBottom = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const list = data
    ? [].concat.apply(
        [],
        data.pages.map((d) => d.data)
      )
    : [];

  return (
    <Fragment>
      <AddListModal
        type={modalType}
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        onSave={onSave}
      />

      <ListView
        loading={isFetching || isFetchingNextPage}
        list={list}
        type="box"
        title="name"
        subtitle="artist"
        filter={filter}
        onScrollBottom={onScrollBottom}
        onFilter={(value) => setFilter(value)}
        onOpen={(id) => navigate(`/album/${id}`)}
        onQueue={onQueue}
        onPlay={onPlay}
        onAddToPlaylist={(id) => onOpenListModal("playlist", id)}
        onAddToAlbumlist={(id) => onOpenListModal("albumlist", id)}
      />
    </Fragment>
  );
};
