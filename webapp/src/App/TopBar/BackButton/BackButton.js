import { MdArrowBack } from "react-icons/md";
import { IconButton } from "../../../Components";

export function BackButton({ onClick }) {
  return (
    <IconButton aria-label="Back" isDark onClick={onClick}>
      <MdArrowBack />
    </IconButton>
  );
}
