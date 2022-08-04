import { useNavigate } from "react-router-dom";
import { useQuery } from "../../../Hooks/useQuery";
import { getAlbumlists, removeAlbumlist } from "../../../Services/api";
import { ListView } from "../ListView/ListView";

export const AlbumlistsView = function () {
  const navigate = useNavigate();

  const { loading, error, data, forceRefresh } = useQuery(getAlbumlists);

  const onRemove = async (name) => {
    await removeAlbumlist(name);
    forceRefresh();
  };

  return (
    <ListView
      loading={loading}
      list={data}
      type="avatar"
      title="name"
      id="name"
      onOpen={(name) => navigate(`/albumlist/${name}`)}
      onRemove={onRemove}
    />
  );
};
