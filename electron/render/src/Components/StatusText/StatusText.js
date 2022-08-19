import "./StatusText.css";
import { h } from "preact";

export function StatusText({ text }) {
  return (
    <p class={text}>
      Scanner status: <span>{text || "-"}</span>
    </p>
  );
}
