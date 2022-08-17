import "./ListView.scss";
import React from "react";
import { MdCloudOff } from "react-icons/md";
import { SearchBar, ListRender, Spinner } from "../../../Components";
import clsx from "clsx";

export const ListView = function ({
  list,
  loading,
  filter,
  onFilter,
  ...props
}) {
  return (
    <div className="ListView">
      <SearchBar value={filter} onChange={onFilter} />

      {loading && (
        <div className="loading">
          <Spinner size={32} />
        </div>
      )}

      {!loading && list.length === 0 && (
        <p className="empty">
          <MdCloudOff size={24} />
          Nothing found...
        </p>
      )}

      <ListRender
        className={clsx("ListView-list", {
          hide: loading || list.length === 0,
        })}
        list={list || []}
        {...props}
      />
    </div>
  );
};
