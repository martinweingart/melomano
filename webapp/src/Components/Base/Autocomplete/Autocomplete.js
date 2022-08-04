import "./Autocomplete.scss";
import { Fragment } from "react";
import { Divider } from "../Divider/Divider";

export function Autocomplete({ value, options, onChange }) {
  const optionsFiltered = options.filter((o) => {
    return value.length < o.length && o.indexOf(value) !== -1;
  });

  return (
    <div className="Autocomplete">
      <input value={value} onChange={(e) => onChange(e.target.value)} />
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