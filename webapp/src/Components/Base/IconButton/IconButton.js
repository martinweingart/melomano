import "./IconButton.scss";
import React, { cloneElement } from "react";
import clsx from "clsx";

export function IconButton({
  className = "",
  children,
  size = 24,
  isDark = false,
  label,
  fontSize,
  ...props
}) {
  return (
    <button
      className={clsx("IconButton", className, {
        isDark: isDark,
        withLabel: label,
      })}
      {...props}
    >
      {cloneElement(children, { size })}
      {label && <span style={{ fontSize }}>{label}</span>}
    </button>
  );
}
