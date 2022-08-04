import "./Spinner.scss";
import React from "react";

export function Spinner({ size }) {
  return (
    <div className="Spinner">
      <div
        className="Spinner-loading"
        style={{
          width: size,
          height: size,
        }}
      ></div>
    </div>
  );
}
