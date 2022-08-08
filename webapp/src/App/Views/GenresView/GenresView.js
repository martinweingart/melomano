import { Fragment, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { ContextPlayer } from "../../../Context/ContextPlayer";
import {
  getTracksByGenre,
  getGenres,
  addToPlaylist,
} from "../../../Services/api";
import { ListView } from "../ListView/ListView";
import { AddListModal } from "../../../Components";

export const GenresView = function () {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addTracksAndPlay } = useContext(ContextPlayer);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const refId = useRef();

  const onPlay = async (name) => {
    const tracks = await getTracksByGenre(name);
    addTracksAndPlay(tracks);
  };

  const onAddToPlaylist = async (name) => {
    setIsPlaylistModalOpen(false);
    const tracks = await getTracksByGenre(refId.current);
    const isNewPlaylist = await addToPlaylist(name, tracks);
    if (isNewPlaylist) {
      queryClient.setQueryData(["playlists"], (oldList) => [
        ...oldList,
        { name },
      ]);
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
    ["genres", { filter }],
    ({ pageParam }) => getGenres({ limit: 50, offset: pageParam || 0, filter }),
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
        type="playlist"
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        onSave={onAddToPlaylist}
      />

      <ListView
        loading={isFetching || isFetchingNextPage}
        list={list}
        type="avatar"
        title="name"
        id="name"
        filter={filter}
        onScrollBottom={onScrollBottom}
        onFilter={(value) => setFilter(value)}
        onOpen={(name) => navigate(`/genre/${name}`)}
        onPlay={onPlay}
        onAddToPlaylist={(id) => {
          setIsPlaylistModalOpen(true);
          refId.current = id;
        }}
      />
    </Fragment>
  );
};
