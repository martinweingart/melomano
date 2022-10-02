import "./Portal.scss";
import React, { forwardRef, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

function createPortalDiv() {
  const div = document.createElement("div");
  div.id = "portal-root";
  return div;
}

function getPortalDiv() {
  return document.querySelector("#portal-root") || createPortalDiv();
}

export const Portal = forwardRef(
  ({ isOpen, children, timeout, onClose }, ref) => {
    const refBody = useRef(document.querySelector("body"));
    const refPortal = useRef(getPortalDiv());

    useEffect(() => {
      const bodyEl = refBody.current;

      return () => {
        bodyEl.style.overflow = "";
      };
    }, []);

    useEffect(() => {
      if (isOpen) {
        refBody.current.appendChild(refPortal.current);
        refBody.current.style.overflow = "hidden";
      } else {
        if (refPortal.current.parentElement) {
          refBody.current.style.overflow = "";

          setTimeout(() => {
            refBody.current.removeChild(refPortal.current);
          }, timeout);
        }
      }
    }, [isOpen, timeout]);

    return createPortal(
      <div
        ref={ref}
        aria-hidden={isOpen ? "false" : "true"}
        className={clsx("Portal", { isOpen })}
      >
        {children}

        <div className="Portal-backdrop" onClick={onClose} />
      </div>,
      refPortal.current
    );
  }
);
