import "./Modal.scss";
import React, { useRef } from "react";
import clsx from "clsx";
import { CSSTransition } from "react-transition-group";
import { Portal } from "../Portal/Portal";

export function Modal({ className, isOpen, onClose, children }) {
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={isOpen}
      timeout={300}
      classNames="Portal"
      unmountOnExit
    >
      <Portal isOpen={isOpen} onClose={onClose} timeout={300}>
        <div className={clsx("Modal", className)}>{children}</div>
      </Portal>
    </CSSTransition>
  );
}
