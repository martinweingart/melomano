import "./TopBar.scss";
import React from "react";
import { MenuButton } from "./MenuButton/MenuButton";
import { BackButton } from "./BackButton/BackButton";
import { useLocation } from "react-router-dom";

export function TopBar({ onMenu, onBack }) {
  const location = useLocation();

  return (
    <div className="TopBar">
      <MenuButton onClick={onMenu} />
      {location.key !== "default" && <BackButton onClick={onBack} />}
    </div>
  );
}
