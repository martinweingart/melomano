import "./Drawer.scss";
import { useRef } from "react";
import clsx from "clsx";
import { CSSTransition } from "react-transition-group";
import { Portal } from "../Portal/Portal";

export function Drawer({ isOpen, children, onClose, position = "left" }) {
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={isOpen}
      timeout={300}
      classNames="Portal"
      unmountOnExit
    >
      <Portal ref={nodeRef} isOpen={isOpen} onClose={onClose} timeout={300}>
        <div className={clsx("Drawer", position)}>{children}</div>
      </Portal>
    </CSSTransition>
  );
}
