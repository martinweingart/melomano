import "./ListView.scss";
import { useState } from "react";
import { SearchBar, ListRender } from "../../../Components";

export const ListView = function ({ list, ...props }) {
  const [filter, setFilter] = useState("");

  const filteredList = list.filter(
    (item) => item[props.title].toLowerCase().indexOf(filter) !== -1
  );

  return (
    <div className="ListView">
      <SearchBar value={filter} onChange={(value) => setFilter(value)} />
      <ListRender className="ListView-list" list={filteredList} {...props} />
    </div>
  );
};
