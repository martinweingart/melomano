import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAlbumlists, removeAlbumlist } from "../../../Services/api";
import { ListView } from "../ListView/ListView";

export const AlbumlistsView = function () {
  const navigate = useNavigate();
  const [list, setList] = useState([]);

  useEffect(() => {
    const getList = async () => {
      const list = await getAlbumlists();
      setList(list);
    };

    getList();
  }, []);

  const onRemove = async (name) => {
    await removeAlbumlist(name);
    const list = await getAlbumlists();
    setList(list);
  };

  return (
    <ListView
      list={list}
      type="avatar"
      title="name"
      id="name"
      onClick={(albumlist) => navigate(`/albumlist/${albumlist.name}`)}
      onRemove={onRemove}
    />
  );
};
