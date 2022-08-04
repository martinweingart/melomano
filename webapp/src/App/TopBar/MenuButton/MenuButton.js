import { MdOutlineMenu } from "react-icons/md";
import { IconButton } from "../../../Components";

export function MenuButton({ onClick }) {
  return (
    <IconButton aria-label="Open Nav Drawer" isDark onClick={onClick}>
      <MdOutlineMenu />
    </IconButton>
  );
}
