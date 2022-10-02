import "./SearchBar.scss";
import React from "react";
import { MdOutlineSearch, MdClose } from "react-icons/md";
import { IconButton } from "../Base";

export function SearchBar({ value, onChange }) {
  return (
    <div className="SearchBar">
      <span className="icon">
        <MdOutlineSearch size={18} />
      </span>

      <input
        placeholder="Search..."
        variant="flushed"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {value.length > 0 && (
        <div className="closeIcon">
          <IconButton
            size={16}
            aria-label="Clear Search Input"
            onClick={() => onChange("")}
          >
            <MdClose />
          </IconButton>
        </div>
      )}
    </div>
  );
}
