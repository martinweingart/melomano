import "./DrawerNav.scss";
import React from "react";
import { MdClose } from "react-icons/md";
import { IconButton, Drawer } from "../../Components";
import { DrawerNavLink } from "./DrawerNavLink/DrawerNavLink";

const links = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Artists",
    to: "/artists",
  },
  {
    label: "Albums",
    to: "/albums",
  },
  {
    label: "Genres",
    to: "/genres",
  },
  {
    label: "Playlists",
    to: "/playlists",
  },
  {
    label: "Albumlists",
    to: "/albumlists",
  },
];

export function DrawerNav({ isOpen, onClose }) {
  return (
    <Drawer position="left" onClose={onClose} isOpen={isOpen}>
      <div className="DrawerNav-content">
        <div className="DrawerNav-header">
          <IconButton
            size={24}
            aria-label="Close Nav Drawer"
            isDark
            onClick={onClose}
          >
            <MdClose />
          </IconButton>
        </div>

        <ul className="DrawerNav-list">
          {links.map((link) => (
            <DrawerNavLink
              key={`DrawerNav-link=${link.label}`}
              {...link}
              onClick={onClose}
            />
          ))}
        </ul>
      </div>
    </Drawer>
  );
}
