import "./TopBar.scss";
import { MenuButton } from "./MenuButton/MenuButton";

export function TopBar({ onMenuClick }) {
  return (
    <div className="TopBar">
      <MenuButton onClick={onMenuClick} />
    </div>
  );
}
