import "./ListView.scss";
import { Fragment, useState } from "react";
import { MdCloudOff } from "react-icons/md";
import { SearchBar, ListRender, Spinner } from "../../../Components";

export const ListView = function ({ list, loading, ...props }) {
  const [filter, setFilter] = useState("");

  return (
    <div className="ListView">
      {loading && (
        <div className="loading">
          <Spinner size={32} />{" "}
        </div>
      )}

      {!loading && list.length === 0 && (
        <p className="empty">
          <MdCloudOff size={24} />
          Nothing found...
        </p>
      )}

      {!loading && list.length > 0 && (
        <Fragment>
          <SearchBar value={filter} onChange={(value) => setFilter(value)} />
          <ListRender
            className="ListView-list"
            list={list.filter(
              (item) => item[props.title].toLowerCase().indexOf(filter) !== -1
            )}
            {...props}
          />
        </Fragment>
      )}
    </div>
  );
};
