import "./Autocomplete.scss";
import React, { Fragment } from "react";
import { Divider } from "../Divider/Divider";

export function Autocomplete({ value, options, onChange }) {
  const optionsFiltered = options.filter((o) => {
    return (
      value.length < o.length &&
      o.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  });

  return (
    <div className="Autocomplete">
      <input
        autocorrect="off"
        autocapitalize="none"
        autocomplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value.length > 0 && optionsFiltered.length > 0 && (
        <ul className="options">
          {optionsFiltered.map((o, i) => (
            <Fragment key={o}>
              <li onClick={() => onChange(o)}>{o}</li>
              {i < optionsFiltered.length - 1 && <Divider />}
            </Fragment>
          ))}
        </ul>
      )}
    </div>
  );
}
