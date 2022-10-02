import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAlbumlists, removeAlbumlist } from "../../../Services/api";
import { ListView } from "../ListView/ListView";

export const AlbumlistsView = function () {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("");

  const { isLoading, data } = useQuery(["albumlists"], () =>
    getAlbumlists({ filter })
  );

  const onRemove = async (id) => {
    await removeAlbumlist(id);
    queryClient.invalidateQueries(["albumlists"]);
  };

  return (
    <ListView
      loading={isLoading}
      list={data || []}
      type="avatar"
      title="name"
      filter={filter}
      onFilter={(value) => setFilter(value)}
      onOpen={(name) => navigate(`/albumlist/${name}`)}
      onRemove={onRemove}
    />
  );
};
