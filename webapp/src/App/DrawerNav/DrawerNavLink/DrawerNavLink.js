import "./DrawerNavLink.scss";
import { useResolvedPath, useMatch, useNavigate } from "react-router-dom";
import clsx from "clsx";

export const DrawerNavLink = function ({ to, label, onClick }) {
  const navigate = useNavigate();
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });

  const onNavigate = () => {
    navigate(to);
    onClick();
  };

  return (
    <li
      className={clsx("DrawerNavLink", { isSelected: match })}
      onClick={onNavigate}
    >
      {label}
    </li>
  );
};
